'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { TrackItem } from '@/components/track/TrackItem';
import { useDialogueMessages } from '@/hooks/useDialogueMessages';
import type { MessageRow } from '@/actions/types';

interface MessageListProps {
  dialogueId: number;
  initialMessages: MessageRow[];
  pageSize: number;
}

export function MessageList({
  dialogueId,
  initialMessages,
  pageSize,
}: MessageListProps) {
  const user = useAuthStore((s) => s.user);
  const { messages, hasOlder, isLoadingOlder, loadOlder } =
    useDialogueMessages(dialogueId, initialMessages, pageSize, Boolean(user));
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages.at(-1)?.id;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lastMessageId]);

  if (!user) return null;

  return (
    <div
      className="min-h-full flex-1 space-y-2 overflow-y-auto p-4"
    >
      {hasOlder && (
        <div className="flex justify-center">
          <button
            onClick={loadOlder}
            disabled={isLoadingOlder}
            className="rounded-[7px] px-4 py-1 text-sm text-mainOrange hover:bg-mainOrange/10 disabled:opacity-50"
          >
            {isLoadingOlder ? 'Loading...' : 'Load earlier messages'}
          </button>
        </div>
      )}
      {messages?.map((msg) => {
        const isOwn = msg.userId?.toString() === user.id.toString();
        return (
          <div
            key={msg.id}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`space-y-5 rounded-lg px-4 py-2 ${isOwn ? 'border border-mainOrange/50 bg-white' : 'bg-lightStormy/40'}`}
            >
              {msg.Track && <TrackItem info={msg.Track} />}
              <div className="text-sm">{msg.content}</div>
              <span className="text-[10px] text-gray-600">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
