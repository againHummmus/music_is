'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/app/store';
import { createImgUrl } from '../utils/createUrlFromHash';
import { createPostLike, deletePostLike } from '@/actions/postLikeApi';
import { searchPosts } from '@/actions/postApi';
import HugeiconsDelete02 from '~icons/hugeicons/delete-02?width=20px&height=20px';
import WeuiLikeFilled from '~icons/weui/like-filled?width=20px&height=20px';
import WeuiLikeOutlined from '~icons/weui/like-outlined?width=20px&height=20px';
import Link from 'next/link';
import { User, Post, PostLike } from '@/types/supabase';
import ClientDate from '@/lib/utils/ClientDate';

export const PostItem = ({
  user,
  isCurrentUser,
  post,
  handleDeletePost,
}: {
  user: User;
  isCurrentUser: boolean;
  post: Post & { Post_like: PostLike[] };
  handleDeletePost?: (id: number) => void;
}) => {
  const store = useStore();

  const isPostLiked = () =>
    !!post?.Post_like?.some((like: PostLike) => like.userId === store.user?.id);
  const [postInfo, setPostInfo] = useState({
    ...post,
    isLiked: isPostLiked(),
    likeCount: post?.Post_like?.length || 0,
  });

  const toggleLike = async () => {
    if (!store.user) return;

    const wasLiked = postInfo.isLiked;
    const originalLikeCount = postInfo.likeCount;

    setPostInfo((prev: any) => ({
      ...prev,
      isLiked: !wasLiked,
      likeCount: wasLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }));

    try {
      if (!wasLiked) {
        await createPostLike({
          postId: postInfo.id,
        });
      } else {
        await deletePostLike({
          postId: postInfo.id,
        });
      }
      const updatedPosts = await searchPosts({
        id: postInfo.id,
        limit: 1,
      });

      if (updatedPosts && updatedPosts.length > 0) {
        const updatedPost = updatedPosts[0];

        if (updatedPost) {
          setPostInfo((prev) => ({
            ...prev,
            isLiked: updatedPost.Post_like.some(
              (l: PostLike) => l.userId === store.user?.id
            ),
            likeCount: updatedPost.Post_like.length,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      setPostInfo((prev: any) => ({
        ...prev,
        isLiked: wasLiked,
        likeCount: originalLikeCount,
      }));
    }
  };

  return (
    <div
      key={post.id}
      className="relative flex flex-row gap-4 rounded-lg bg-white p-4 shadow-sm"
    >
      <Link href={'/discover/user/' + user.id} className="flex-shrink-0">
        <Image
          src={
            user.avatar_url
              ? createImgUrl(user.avatar_url)
              : '/images/placeholderAvatar.png'
          }
          alt="User avatar"
          width={60}
          height={60}
          className="h-[60px] w-[60px] flex-shrink-0 rounded-[7px] object-cover"
        />
      </Link>
      <div className="flex flex-grow flex-col gap-2">
        <div>
          <div className="text-sm text-gray-500">
            <span className="font-medium text-mainOrange">
              {user?.username}
            </span>
            <ClientDate iso={post.created_at} className='opacity-70'/>
          </div>
          <div className="mt-1 text-base text-gray-800">{post.content}</div>
        </div>
      </div>

      <div className="flex min-h-full flex-col items-end justify-between">
        {isCurrentUser ? (
          <button
            onClick={
              handleDeletePost ? () => handleDeletePost(post.id) : undefined
            }
            className="text-gray-400 transition-colors hover:text-red-500"
          >
            <HugeiconsDelete02 />
          </button>
        ) : (
          <div />
        )}

        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={toggleLike}
            className="group flex items-center gap-1.5"
          >
            {postInfo.isLiked ? (
              <WeuiLikeFilled className="text-mainOrange" />
            ) : (
              <WeuiLikeOutlined className="text-mainDark transition-all group-hover:text-mainOrange" />
            )}
            <span
              className={`text-sm ${postInfo.isLiked ? 'text-mainOrange' : 'text-mainDark'}`}
            >
              {postInfo.likeCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
