'use client';

import { useState } from 'react';
import { createImgUrl } from '@/components/shared/utils/createUrlFromHash';
import Image from 'next/image';
import { createSubscription, deleteSubscription } from '@/actions/userSubscriptionApi';
import { createPost, deletePost } from '@/actions/postApi';
import { useStore } from '@/app/store';
import { PlaylistItem } from '@/components/shared/playlist/PlaylistItem';
import HugeiconsLocationUser01 from '~icons/hugeicons/location-user-01?width=24px&height=24px';
import { PostItem } from '@/components/shared/post/PostItem';
import { Track } from '@/components/shared/track/TrackItem';
import HugeiconsBubbleChat from '~icons/hugeicons/bubble-chat?width=48px&height=48px';
import { createDialogue } from '@/actions/dialogueApi';
import UserAlbumsBlock from '@/components/album/AlbumsBlock';
import { ContentBlock } from '@/components/shared/ContentBlock';

export default function UserScreen({
  params,
  initialCurrentUser,
  initialViewedUser,
  initialIsSubscribed,
  initialSubId,
  initialSubscriberCount,
  initialPosts,
}: {
  params: any;
  initialCurrentUser: any;
  initialViewedUser: any;
  initialIsSubscribed: boolean;
  initialSubId: string | number | null;
  initialSubscriberCount: number;
  initialPosts: any[];
}) {
  const store = useStore();
  const storeCurrentUser = store.user;
  const currentUser = storeCurrentUser ?? initialCurrentUser;

  const user: any = initialViewedUser;

  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [subId, setSubId] = useState<string | number | undefined | null>(initialSubId);
  const [subLoading, setSubLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(
    initialSubscriberCount
  );

  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [postLoading, setPostLoading] = useState(false);

  const isCurrentUser = currentUser?.id === user?.id;

  const onWrite = async () => {
    try {
      const { dialogueId } = await createDialogue({ otherUserId: user.id });
      window.location.href = `/dialogues/${dialogueId}`;
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubscription = async () => {
    if (!currentUser || !user) return;
    setSubLoading(true);
    try {
      if (isSubscribed && subId) {
        await deleteSubscription({ id: subId });
        setIsSubscribed(false);
        setSubId(null);
        setSubscriberCount((c) => c - 1);
      } else {
        const [newSub] = await createSubscription({
          followee: user?.id,
        });
        setIsSubscribed(true);
        setSubId(newSub?.id);
        setSubscriberCount((c) => c + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    setPostLoading(true);
    try {
      const created = await createPost({
        content: newPost,
      });
      setPosts((prev) => [created, ...prev]);
      setNewPost('');
    } catch (err) {
      console.error(err);
    } finally {
      setPostLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost({ id: postId });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const addedByMePlaylist = user?.User_playlist?.find(
    (up: any) => up.Playlist?.name === 'Added by me'
  )?.Playlist;
  const publicPlaylists: any[] =
    user?.User_playlist?.filter((up: any) => up.Playlist?.is_public) ?? [];

  return (
    <div className="flex w-full flex-col gap-20">
      <div
        className="relative flex w-full justify-between rounded-[7px] from-mainBlack/80 to-mainBlack/50 bg-cover bg-center p-20 after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-[7px] after:bg-gradient-to-l after:content-[''] main:p-30"
        style={{
          backgroundImage: user?.avatar_url
            ? `url(${createImgUrl(user?.avatar_url)})`
            : 'url("/images/placeholderAvatar.png")',
        }}
      >
        <div className="z-10 my-auto flex items-center gap-20">
          <Image
            src={
              user?.avatar_url
                ? createImgUrl(user?.avatar_url)
                : '/images/placeholderAvatar.png'
            }
            alt="User avatar"
            width={150}
            height={150}
            className="h-[80px] w-[80px] rounded-[7px] object-cover main:h-[150px] main:w-[150px]"
          />
          <div className="flex flex-col gap-10 text-white">
            <h2 className="text-base font-bold leading-none laptop:text-[40px]">
              {user?.username}
            </h2>
            <div className="w-fit rounded-full bg-lightStormy px-10 py-5 text-sm font-medium text-mainBlack">
              {user?.app_role}
            </div>
          </div>
        </div>
        <div className="relative z-[4000] flex min-h-full flex-col items-end justify-between">
          <div className="flex flex-row items-center text-lightStormy">
            <HugeiconsLocationUser01 />
            <div className="ml-2 font-semibold">{subscriberCount}</div>
          </div>
          {!isCurrentUser && (
            <div className="flex flex-row items-center gap-10">
              <HugeiconsBubbleChat
                onClick={() => onWrite()}
                className="h-[30px] w-[40px] cursor-pointer text-white hover:text-mainOrange"
              />
              <button
                onClick={toggleSubscription}
                disabled={subLoading}
                className={`rounded-[7px] px-4 py-2 font-semibold transition-all ${isSubscribed ? 'bg-lightStormy text-mainBlack' : 'bg-mainOrange text-mainBlack'} ${subLoading ? 'cursor-wait opacity-50' : 'hover:brightness-110'}`}
              >
                {isSubscribed ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          )}
        </div>
      </div>

      {isCurrentUser && (
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-[7px] border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mainOrange"
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button
            onClick={handleCreatePost}
            disabled={postLoading || !newPost.trim()}
            className="rounded-[7px] bg-mainOrange px-4 py-2 text-white disabled:opacity-50"
          >
            Post
          </button>
        </div>
      )}

      {posts.length > 0 && (
        <ContentBlock
          title="Posts"
          items={posts}
          renderItem={(post) => (
            <PostItem
              key={post.id}
              user={user}
              isCurrentUser={isCurrentUser}
              post={post}
              handleDeletePost={isCurrentUser ? handleDeletePost : undefined}
            />
          )}
          gridClassName="flex flex-col w-full gap-10"
        />
      )}

      {addedByMePlaylist && (
        <ContentBlock
          title="Added by me"
          items={[addedByMePlaylist]}
          renderItem={(playlist) => (
            <PlaylistItem key={playlist.id} info={playlist} />
          )}
        />
      )}

      {publicPlaylists.length > 0 && (
        <ContentBlock
          title="Public playlists"
          items={publicPlaylists.map((up: any) => up.Playlist)}
          renderItem={(playlist) => (
            <PlaylistItem key={playlist.id} info={playlist} />
          )}
        />
      )}

      {user?.Artist && (
        <div className="flex flex-col gap-10">
          <UserAlbumsBlock user={user} />
        </div>
      )}

      {user?.Track && user.Track.length > 0 && (
        <ContentBlock
          title="Tracks"
          items={user.Track}
          renderItem={(track) => (
            <Track key={track.id} info={track} className="w-full" />
          )}
          gridClassName="flex flex-col w-full gap-10"
        />
      )}
    </div>
  );
}
