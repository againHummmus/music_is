import { useState } from 'react';
import {
  createSubscription,
  deleteSubscription,
} from '@/actions/userSubscriptionApi';
import { createPost, deletePost } from '@/actions/postApi';
import { createDialogue } from '@/actions/dialogueApi';
import { useRouter } from 'next/navigation';

export const useUserActions = (
  user: any,
  currentUser: any,
  initialPosts: any[]
) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subId, setSubId] = useState<string | number | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [postLoading, setPostLoading] = useState(false);
  const router = useRouter();

  const toggleSubscription = async () => {
    if (!currentUser || !user) return;
    setSubLoading(true);
    try {
      if (isSubscribed && subId) {
        await deleteSubscription({ id: subId });
        setIsSubscribed(false);
        setSubId(null);
      } else {
        const [newSub] = await createSubscription({ followee: user.id });
        setIsSubscribed(true);
        setSubId(newSub?.id ?? null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubLoading(false);
    }
  };

  const submitPost = async (content: string) => {
    setPostLoading(true);
    try {
      const created = await createPost({ content });
      setPosts((prev) => [created, ...prev]);
    } finally {
      setPostLoading(false);
    }
  };

  const removePost = async (postId: number) => {
    await deletePost({ id: postId });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const startDialogue = async () => {
    const { dialogueId } = await createDialogue({ otherUserId: user.id });
    router.push(`/dialogues/${dialogueId}`);
  };

  return {
    posts,
    isSubscribed,
    subLoading,
    postLoading,
    toggleSubscription,
    createPost: submitPost,
    deletePost: removePost,
    startDialogue,
  };
};
