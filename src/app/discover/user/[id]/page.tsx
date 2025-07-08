"use client";

import { useState, useEffect } from "react";
import { createImgUrl } from "@/components/shared/utils/createUrlFromHash";
import Image from "next/image";
import UserApi from "@/actions/userApi";
import SubscriptionApi from "@/actions/userSubscriptionApi";
import PostApi from "@/actions/postApi";
import { useStore } from "@/app/store";
import { PlaylistItem } from "@/components/shared/playlist/PlaylistItem";
import { ArrowButton } from "@/components/shared/buttons/ArrowButton";
import HugeiconsLocationUser01 from "~icons/hugeicons/location-user-01?width=24px&height=24px";
import { PostItem } from "@/components/shared/post/PostItem";
import { Track } from "@/components/shared/track/TrackItem";
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';
import HugeiconsBubbleChat from '~icons/hugeicons/bubble-chat?width=48px&height=48px';
import DialogueApi from "@/actions/dialogueApi";
import UserAlbumsBlock from "@/components/album/AlbumsBlock";

export const dynamic = "force-dynamic";

export default function UserPage({ params }: { params: any }) {
    const store = useStore();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subId, setSubId] = useState<string | null>(null);
    const [subLoading, setSubLoading] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);

    const [posts, setPosts] = useState<any[]>([]);
    const [newPost, setNewPost] = useState("");
    const [postLoading, setPostLoading] = useState(false);

    const currentUser = store.user;
    const isCurrentUser = currentUser?.id === user?.id;

    const onWrite = async () => {
        try {
            const { dialogueId } = await DialogueApi.createDialogue({ userId: currentUser.id, otherUserId: user.id });
            window.location.href = `/dialogues/${dialogueId}`;
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        UserApi.getUser({ id: params.id })
            .then((u) => setUser(u))
            .finally(() => setIsLoading(false));
    }, [params.id]);

    useEffect(() => {
        if (!user || !currentUser) return;

        SubscriptionApi.searchSubscriptions({
            follower: currentUser.id,
            followee: user?.id,
            limit: 1,
        })
            .then((results) => {
                if (results.length) {
                    setIsSubscribed(true);
                    setSubId(results[0].id);
                }
            })
            .catch(console.error);

        SubscriptionApi.searchSubscriptions({
            followee: user?.id,
            limit: 1000,
        })
            .then((results) => {
                setSubscriberCount(results.length);
            })
            .catch(console.error);
    }, [user, currentUser]);

    useEffect(() => {
        if (!user) return;
        PostApi.searchPosts({ userId: user?.id, limit: 100, offset: 0 })
            .then((list) => {
                setPosts(list.sort((a: any, b: any) => Date.parse(b.created_at) - Date.parse(a.created_at)));
            })
            .catch(console.error);
    }, [user]);

    const toggleSubscription = async () => {
        if (!currentUser || !user) return;
        setSubLoading(true);
        try {
            if (isSubscribed && subId) {
                await SubscriptionApi.deleteSubscription({ id: subId });
                setIsSubscribed(false);
                setSubId(null);
                setSubscriberCount((c) => c - 1);
            } else {
                const [newSub] = await SubscriptionApi.createSubscription({
                    follower: currentUser.id,
                    followee: user?.id,
                });
                setIsSubscribed(true);
                setSubId(newSub.id);
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
            const created = await PostApi.createPost({
                content: newPost,
                userId: user?.id,
            });
            setPosts((prev) => [created, ...prev]);
            setNewPost("");
        } catch (err) {
            console.error(err);
        } finally {
            setPostLoading(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await PostApi.deletePost({ id: postId });
            setPosts((prev) => prev.filter((p) => p.id !== postId));
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full w-full">
                <div className="w-8 h-8 border-4 border-mainOrange border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-20 w-full">
            <div
                className="relative w-full flex justify-between bg-cover bg-center rounded-[7px] p-20 main:p-30 after:absolute after:content-'' after:w-full after:h-full after:top-0 after:left-0 after:bg-gradient-to-l from-mainBlack/80 to-mainBlack/50 after:rounded-[7px]"
                style={{
                    backgroundImage: user?.avatar_url
                        ? `url(${createImgUrl(user?.avatar_url)})`
                        : 'url("/images/placeholderAvatar.png")',
                }}
            >
                <div className="flex my-auto items-center gap-20 z-10">
                    <Image
                        src={
                            user?.avatar_url
                                ? createImgUrl(user?.avatar_url)
                                : "/images/placeholderAvatar.png"
                        }
                        alt="User avatar"
                        width={150}
                        height={150}
                        className="w-[80px] h-[80px] main:w-[150px] main:h-[150px] object-cover rounded-[7px]"
                    />
                    <div className="flex flex-col text-white gap-10">
                        <h2 className="text-base laptop:text-[40px] font-bold leading-none">
                            {user?.username}
                        </h2>
                        <div className='py-5 px-10 bg-lightStormy text-mainBlack w-fit font-medium text-sm rounded-full'>{user?.app_role}</div>
                    </div>
                </div>
                <div className="min-h-full relative z-[4000] flex items-end flex-col justify-between">
                    <div className="flex flex-row items-center text-lightStormy">
                        <HugeiconsLocationUser01 />
                        <div className="font-semibold ml-2">{subscriberCount}</div>
                    </div>
                    {!isCurrentUser && (
                        <div className='flex flex-row items-center gap-10' >
                            <HugeiconsBubbleChat onClick={() => onWrite()} className="cursor-pointer w-[40px] h-[30px] text-white hover:text-mainOrange" />
                            <button
                                onClick={toggleSubscription}
                                disabled={subLoading}
                                className={`
                    px-4 py-2 rounded-[7px] font-semibold transition-all
                    ${isSubscribed ? "bg-lightStormy text-mainBlack" : "bg-mainOrange text-mainBlack"}
                    ${subLoading ? "opacity-50 cursor-wait" : "hover:brightness-110"}
                  `}
                            >
                                {isSubscribed ? "Unsubscribe" : "Subscribe"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {user.app_role === 'artist' &&
                <div className='flex flex-col gap-10 mb-15'>
                    <div className="font-bold text-[24px] text-mainBlack">
                        Tracks by {user?.username}:
                    </div>

                    {user?.User_playlist?.filter((up: any) => up.Playlist?.name === 'Added by me')[0]?.Playlist.Playlist_track.length > 0 ?
                        <div className="grid gid-cols-1 main:grid-cols-2 w-full gap-10">
                            {user?.User_playlist?.filter((up: any) => up.Playlist?.name === 'Added by me')[0]?.Playlist.Playlist_track?.map((item: any, index: any) => (
                                <Track key={index} info={item?.Track} playlist={user?.User_playlist?.filter((up: any) => up.Playlist?.name === 'Added by me')[0]?.Playlist} />
                            ))}
                        </div>
                        : <div className='flex flex-col h-[230px] gap-20 rounded-[7px] border border-mainOrange border-dashed items-center justify-center text-mainOrange'>
                            <StreamlineSleep className='w-[40px] h-[40px]' />
                            <p>Nothing here yet!</p>
                        </div>
                    }
                    {user?.User_playlist?.filter((up: any) => up.Playlist?.name === 'Added by me')[0]?.Playlist?.Playlist_track.length > 0 && <ArrowButton title={"Go"} href={"/discover/playlists/" + user?.User_playlist?.filter((up: any) => up.Playlist?.name === 'Added by me')[0]?.Playlist?.id} color={"mainOrange"} maxWidth="100px" />}
                </div>}
            {user.app_role === 'artist' &&
                <UserAlbumsBlock userId={user?.id} limit={4} />}

            {user?.User_playlist?.filter((up: any) => up.Playlist?.is_public).length > 0 && (
                <div className='flex flex-col gap-10 mb-15'>
                    <div className="font-bold text-[24px] text-mainBlack">
                        Playlists created by {user?.username}:
                    </div>
                    <div className="grid grid-cols-1 laptop:grid-cols-2 w-full gap-10">
                        {user?.User_playlist.filter((up: any) => up.Playlist?.is_public).map(
                            (up: any) => <PlaylistItem key={up.Playlist.id} info={up.Playlist} />
                        )}
                    </div>
                    <ArrowButton
                        title="Go"
                        href={`/discover/user/${user?.id}/playlists`}
                        color="mainOrange"
                        maxWidth="100px"
                    />
                </div>
            )}

            {isCurrentUser && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-mainOrange"
                        rows={3}
                    />
                    <button
                        onClick={handleCreatePost}
                        disabled={postLoading}
                        className={`mt-3 px-6 py-2 bg-mainOrange text-white rounded shadow ${postLoading ? "opacity-50 cursor-wait" : "hover:bg-[#e5771d]"
                            }`}
                    >
                        {postLoading ? "Posting..." : "Post"}
                    </button>
                </div>
            )}

            <div className="space-y-6">
                {posts.length > 0 ? posts.map((p) =>
                    <PostItem user={user} isCurrentUser={isCurrentUser} post={p} handleDeletePost={handleDeletePost} key={p.id} />
                ) :
                    <div className="text-center text-gray-500">The user has no posts yet...</div>
                }
            </div>
        </div>
    );
}
