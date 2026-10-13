create or replace function public.recommended_users(max_count integer default 10)
returns table (user_id bigint, similarity double precision)
language sql
stable
security definer
set search_path = public
as $$
  with me as (
    select id from "User"
    where id = public.current_app_user_id() and recommendations_enabled
  ),
  my_likes as (
    select distinct tl."trackId"
    from "Track_like" tl
    join me on tl."userId" = me.id
  ),
  candidates as (
    select u.id
    from "User" u, me
    where u.id <> me.id
      and u.recommendations_enabled
      and not exists (
        select 1 from "User_user_subscription" s
        where s."Follower" = me.id and s."Followee" = u.id
      )
  ),
  candidate_likes as (
    select distinct tl."userId", tl."trackId"
    from "Track_like" tl
    join candidates c on c.id = tl."userId"
  ),
  scored as (
    select
      cl."userId",
      count(*) filter (where cl."trackId" in (select "trackId" from my_likes)) as common_count,
      count(*) as their_count
    from candidate_likes cl
    group by cl."userId"
  )
  select
    s."userId",
    s.common_count::double precision
      / ((select count(*) from my_likes) + s.their_count - s.common_count)
  from scored s
  where s.common_count > 0
  order by 2 desc, s."userId"
  limit least(greatest(max_count, 1), 50)
$$;

revoke execute on function public.recommended_users(integer) from public, anon;
grant execute on function public.recommended_users(integer) to authenticated;

drop function if exists public.get_recommended_users(bigint);

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

drop table if exists public."User_recommendation";

alter table public."User" drop column if exists preferences_vector;
