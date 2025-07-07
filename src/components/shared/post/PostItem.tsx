
"use client";

import { useState } from "react";
import Image from "next/image";
import { useStore } from "@/app/store"; 
import { createImgUrl } from "../utils/createUrlFromHash";
import PostLikeApi from "@/actions/postLikeApi"; 
import PostApi from "@/actions/postApi";
import HugeiconsDelete02 from "~icons/hugeicons/delete-02?width=20px&height=20px";
import WeuiLikeFilled from '~icons/weui/like-filled?width=20px&height=20px';
import WeuiLikeOutlined from '~icons/weui/like-outlined?width=20px&height=20px'; 


export const PostItem = ({ user, isCurrentUser, post, handleDeletePost }: { user: any, isCurrentUser: boolean, post: any, handleDeletePost?: (id: any) => void }) => {

    const store = useStore();

    const isPostLiked = () => !!post?.Post_like?.some((like: any) => like.userId === store.user?.id);
    const [postInfo, setPostInfo] = useState({
        ...post,
        isLiked: isPostLiked(),
        likeCount: post?.Post_like?.length || 0
    });

    const toggleLike = async () => {
        if (!store.user) return;

        const wasLiked = postInfo.isLiked;
        const originalLikeCount = postInfo.likeCount;

        setPostInfo((prev: any) => ({
            ...prev,
            isLiked: !wasLiked,
            likeCount: wasLiked ? prev.likeCount - 1 : prev.likeCount + 1
        }));

        try {
            if (!wasLiked) {
                await PostLikeApi.createPostLike({ userId: store.user.id, postId: postInfo.id });
            } else {
                await PostLikeApi.deletePostLike({ userId: store.user.id, postId: postInfo.id });
            }
            const updatedPosts = await PostApi.searchPosts({ id: postInfo.id, limit: 1 });
            if (updatedPosts.length > 0) {
                const updatedPost = updatedPosts[0];
                setPostInfo({
                    ...updatedPost,
                    isLiked: updatedPost.Post_like.some((l: any) => l.userId === store.user.id),
                    likeCount: updatedPost.Post_like.length
                });
            }
        } catch (error) {
            console.error("Failed to toggle like:", error);
            setPostInfo((prev: any) => ({ ...prev, isLiked: wasLiked, likeCount: originalLikeCount }));
        }
    };


    return (
        <div key={post.id} className="flex flex-row gap-4 bg-white p-4 rounded-lg shadow-sm relative">
            <Image
                src={
                    user.avatar_url
                        ? createImgUrl(user.avatar_url)
                        : "/images/placeholderAvatar.jpg"
                }
                alt="User avatar"
                width={60}
                height={60}
                className="w-[60px] h-[60px] object-cover rounded-[7px] flex-shrink-0"
            />

            <div className='flex flex-col gap-2 flex-grow'>
                <div>
                    <div className="text-sm text-gray-500">
                        <span className='text-mainOrange font-medium'>{user?.username}</span>
                        <span className='opacity-70'>{` ∘ ${new Date(post.created_at).toLocaleString()}`}</span>
                    </div>
                    <div className="text-base text-gray-800 mt-1">{post.content}</div>
                </div>
            </div>

            <div className='flex flex-col justify-between items-end min-h-full '>
                {isCurrentUser ? (
                    <button
                        onClick={handleDeletePost ? () => handleDeletePost(post.id) : undefined}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <HugeiconsDelete02 />
                    </button>
                ) : <div />}

                <div className="flex items-center gap-3 mt-2">
                    <button onClick={toggleLike} className="flex items-center gap-1.5 group">
                        {postInfo.isLiked ? (
                            <WeuiLikeFilled className="text-mainOrange" />
                        ) : (
                            <WeuiLikeOutlined className="text-mainDark group-hover:text-mainOrange transition-all" />
                        )}
                        <span className={`text-sm ${postInfo.isLiked ? 'text-mainOrange' : 'text-mainDark'}`}>{postInfo.likeCount}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}