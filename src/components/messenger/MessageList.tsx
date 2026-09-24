'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/supabaseBrowser';
import { getMessages } from '@/actions/messageApi';
import type { MessageRow } from '@/actions/types';
import { useStore } from '@/app/store';
import { Track } from '../shared/track/TrackItem';

interface MessageListProps {
  dialogueId: number;
}

export default function MessageList({ dialogueId }: MessageListProps) {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const { user } = useStore();
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dialogueId || !user) return;
    getMessages({ dialogueId })
      .then((data) => setMessages(data || []))
      .catch(console.error);
  }, [dialogueId, user]);

  useEffect(() => {
    if (!dialogueId) return;
    const channel = supabase
      .channel('…')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `dialogueId=eq.${dialogueId}`,
        },
        async (ctx) => {
          if (!user) return;
          const newMessage = await getMessages({
            dialogueId: dialogueId,
            limit: 1,
            id: ctx.new.id,
          });
          const first = newMessage[0];
          if (first) setMessages((prev) => [...prev, first]);
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') return;
      });

    return () => {
      channel.unsubscribe();
    };
  }, [dialogueId]);

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
              {msg.Track && <Track info={msg.Track} />}
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
