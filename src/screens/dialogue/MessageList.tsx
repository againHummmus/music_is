'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { TrackItem } from '@/components/track/TrackItem';
import { useDialogueMessages } from '@/hooks/useDialogueMessages';

interface MessageListProps {
  dialogueId: number;
}

export function MessageList({ dialogueId }: MessageListProps) {
  const user = useAuthStore((s) => s.user);
  const messages = useDialogueMessages(dialogueId, Boolean(user));
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) return null;

  return (
    <div
      ref={listRef}
      className="min-h-full flex-1 space-y-2 overflow-y-auto p-4"
    >
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
      {/* <div ref={bottomRef} /> */}
    </div>
  );
}
