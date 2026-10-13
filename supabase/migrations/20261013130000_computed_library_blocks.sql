create or replace function public.friends_like_tracks(max_count integer default 20)
returns table (track_id bigint, friend_likes bigint)
language sql
stable
security definer
set search_path = public
as $$
  with me as (
    select id from "User"
    where id = public.current_app_user_id() and recommendations_enabled
  ),
  friends as (
    select s."Followee" as id
    from "User_user_subscription" s
    join me on s."Follower" = me.id
    join "User" u on u.id = s."Followee" and u.recommendations_enabled
  )
  select tl."trackId", count(distinct tl."userId")
  from "Track_like" tl
  join friends f on f.id = tl."userId"
  where tl."trackId" is not null
    and not exists (
      select 1 from "Track_like" mine, me
      where mine."userId" = me.id and mine."trackId" = tl."trackId"
    )
  group by tl."trackId"
  order by 2 desc, 1
  limit least(greatest(max_count, 1), 100)
$$;

revoke execute on function public.friends_like_tracks(integer) from public, anon;
grant execute on function public.friends_like_tracks(integer) to authenticated;

create or replace function public.chart_tracks(max_count integer default 20)
returns table (track_id bigint, likes bigint)
language sql
stable
set search_path = public
as $$
  select tl."trackId", count(*)
  from "Track_like" tl
  where tl."trackId" is not null
  group by tl."trackId"
  order by 2 desc, 1
  limit least(greatest(max_count, 1), 100)
$$;

revoke execute on function public.chart_tracks(integer) from public, anon;
grant execute on function public.chart_tracks(integer) to authenticated;
