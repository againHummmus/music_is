create or replace function public.current_app_user_id()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select id from public."User" where "sbUserId"::text = auth.uid()::text limit 1
$$;

create or replace function public.is_dialogue_member(target_dialogue_id bigint)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public."User_dialogue"
    where "dialogueId" = target_dialogue_id
      and "userId" = public.current_app_user_id()
  )
$$;

create or replace function public.dialogue_has_members(target_dialogue_id bigint)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public."User_dialogue" where "dialogueId" = target_dialogue_id
  )
$$;

do $$
declare
  policy record;
begin
  for policy in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in ('Dialogue', 'User_dialogue', 'Message')
  loop
    execute format('drop policy %I on public.%I', policy.policyname, policy.tablename);
  end loop;
end
$$;

alter table public."Dialogue" enable row level security;
alter table public."User_dialogue" enable row level security;
alter table public."Message" enable row level security;

create policy "Participants read dialogues" on public."Dialogue"
  for select to authenticated
  using (public.is_dialogue_member(id) or not public.dialogue_has_members(id));

create policy "Users create dialogues" on public."Dialogue"
  for insert to authenticated
  with check (true);

create policy "Empty dialogues can be removed" on public."Dialogue"
  for delete to authenticated
  using (not public.dialogue_has_members(id));

create policy "Participants read membership" on public."User_dialogue"
  for select to authenticated
  using (public.is_dialogue_member("dialogueId"));

create policy "Join new dialogue or add to own dialogue" on public."User_dialogue"
  for insert to authenticated
  with check (
    (
      "userId" = public.current_app_user_id()
      and not public.dialogue_has_members("dialogueId")
    )
    or public.is_dialogue_member("dialogueId")
  );

create policy "Leave dialogue" on public."User_dialogue"
  for delete to authenticated
  using ("userId" = public.current_app_user_id());

create policy "Participants read messages" on public."Message"
  for select to authenticated
  using (public.is_dialogue_member("dialogueId"));

create policy "Participants send own messages" on public."Message"
  for insert to authenticated
  with check (
    "userId" = public.current_app_user_id()
    and public.is_dialogue_member("dialogueId")
  );

create policy "Authors delete own messages" on public."Message"
  for delete to authenticated
  using ("userId" = public.current_app_user_id());

alter table public."User"
  drop column if exists password_hash,
  drop column if exists reset_code,
  drop column if exists reset_code_expires,
  drop column if exists activation_link;

alter table public."User"
  add column if not exists recommendations_enabled boolean not null default true;

revoke update on public."User" from anon, authenticated;
grant update (
  username,
  avatar_url,
  email,
  is_activated,
  preferences_vector,
  recommendations_enabled
) on public."User" to authenticated;

create policy "No role escalation on insert" on public."User"
  as restrictive
  for insert to authenticated
  with check (app_role = 'user' and "artistId" is null);

create or replace function public.become_artist(
  artist_name text,
  artist_image_hash text
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  me bigint := public.current_app_user_id();
  new_artist_id bigint;
begin
  if me is null then
    raise exception 'Unauthorized';
  end if;
  if exists (select 1 from "User" where id = me and "artistId" is not null) then
    raise exception 'User is already an artist';
  end if;

  insert into "Artist" (name, image_hash)
  values (artist_name, artist_image_hash)
  returning id into new_artist_id;

  update "User"
  set "artistId" = new_artist_id,
      app_role = case when app_role = 'admin' then app_role else 'artist' end
  where id = me;

  return new_artist_id;
end
$$;

revoke execute on function public.become_artist(text, text) from public, anon;
grant execute on function public.become_artist(text, text) to authenticated;

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  me bigint := public.current_app_user_id();
  my_artist_id bigint;
  my_auth_id uuid := auth.uid();
begin
  if me is null or my_auth_id is null then
    raise exception 'Unauthorized';
  end if;

  select "artistId" into my_artist_id from "User" where id = me;

  update "Message" set "userId" = null where "userId" = me;
  delete from "User_dialogue" where "userId" = me;

  delete from "Post_like" where "userId" = me;
  delete from "Post_like" where "postId" in (select id from "Post" where "userId" = me);
  delete from "Post" where "userId" = me;

  delete from "Track_like" where "userId" = me;
  delete from "Playlist_like" where "userId" = me;
  delete from "User_user_subscription" where "Follower" = me or "Followee" = me;
  delete from "User_recommendation" where "User" = me or "RecommendedUser" = me;
  delete from "User_group" where "userId" = me;
  delete from "Token" where "userId" = me;

  update "Post" set "playlistId" = null
  where "playlistId" in (select id from "Playlist" where "Creator" = me);
  delete from "Playlist_track"
  where "playlistId" in (select id from "Playlist" where "Creator" = me);
  delete from "Playlist_like"
  where "playlistId" in (select id from "Playlist" where "Creator" = me);
  delete from "User_playlist"
  where "Playlist" in (select id from "Playlist" where "Creator" = me);
  delete from "Playlist" where "Creator" = me;
  delete from "User_playlist" where "User" = me;

  if my_artist_id is not null then
    update "Post" set "trackId" = null
    where "trackId" in (select id from "Track" where "artistId" = my_artist_id);
    update "Message" set "Track" = null
    where "Track" in (select id from "Track" where "artistId" = my_artist_id);
    delete from "Playlist_track"
    where "trackId" in (select id from "Track" where "artistId" = my_artist_id);
    delete from "Track_like"
    where "trackId" in (select id from "Track" where "artistId" = my_artist_id);
    delete from "Track" where "artistId" = my_artist_id;
    delete from "Album" where "artistId" = my_artist_id;
  end if;

  delete from "User" where id = me;

  if my_artist_id is not null
    and not exists (select 1 from "User" where "artistId" = my_artist_id) then
    delete from "Artist" where id = my_artist_id;
  end if;

  delete from auth.users where id = my_auth_id;
end
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

create policy "Users create own profile" on public."User"
  for insert to authenticated
  with check ("sbUserId" = auth.uid());

create policy "Users read own recommendations" on public."User_recommendation"
  for select to authenticated
  using ("User" = public.current_app_user_id());

create policy "Users delete own recommendations" on public."User_recommendation"
  for delete to authenticated
  using ("User" = public.current_app_user_id());

create or replace function public.is_app_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public."User"
    where "sbUserId" = auth.uid() and app_role = 'admin'
  )
$$;

with file_owners as (
  select 'img/' || u.avatar_url as name, u."sbUserId" as owner
  from public."User" u
  where u.avatar_url is not null and u."sbUserId" is not null
  union all
  select 'img/' || a.image_hash, u."sbUserId"
  from public."Artist" a
  join public."User" u on u."artistId" = a.id
  where a.image_hash is not null and u."sbUserId" is not null
  union all
  select 'img/' || al.image_hash, u."sbUserId"
  from public."Album" al
  join public."User" u on u."artistId" = al."artistId"
  where al.image_hash is not null and u."sbUserId" is not null
  union all
  select 'mp3/' || t.file_hash, u."sbUserId"
  from public."Track" t
  join public."User" u on u."artistId" = t."artistId"
  where u."sbUserId" is not null
)
update storage.objects o
set owner_id = f.owner::text, owner = f.owner
from file_owners f
where o.bucket_id = 'musicIsStorage'
  and o.name = f.name
  and o.owner_id is null;

drop policy if exists "Can change storage (all actions)" on storage.objects;
drop policy if exists "Can insert into storage" on storage.objects;
drop policy if exists "Can update storage" on storage.objects;

create policy "Users upload files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'musicIsStorage');

create policy "Owners and admins update files" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'musicIsStorage'
    and (owner_id = auth.uid()::text or public.is_app_admin())
  );

create policy "Owners and admins delete files" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'musicIsStorage'
    and (owner_id = auth.uid()::text or public.is_app_admin())
  );
