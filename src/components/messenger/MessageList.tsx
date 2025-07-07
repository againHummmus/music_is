'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import MessageApi from '@/actions/messageApi';
import { useStore } from '@/app/store';
import { Track } from '../shared/track/TrackItem';

interface MessageListProps {
    dialogueId: number;
}

export default function MessageList({ dialogueId }: MessageListProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const { user } = useStore();
    const listRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!dialogueId || !user) return;
        MessageApi.getMessages({ userId: user.id, dialogueId })
            .then(data => setMessages(data || []))
            .catch(console.error);
    }, [dialogueId, user])

    useEffect(() => {
        if (!dialogueId) return;
        const channel = supabase
            .channel('…')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'Message',
                filter: `dialogueId=eq.${dialogueId}`,
            },
                async (ctx) => {
                    const newMessage = await MessageApi.getMessages({
                        userId: user.id,
                        dialogueId: dialogueId,
                        limit: 1,
                        id: ctx.new.id
                    });
                    setMessages((prev) => [...prev, newMessage[0]]);
                })
            .subscribe(status => {
                if (status !== 'SUBSCRIBED') return;
            })

        return () => {
            channel.unsubscribe()
        };
    }, [dialogueId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!user) return null;

    return (
        <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-4 space-y-2 min-h-full"
        >
            {messages?.map((msg) => {
                const isOwn = msg.userId.toString() === user.id.toString();
                return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`py-2 px-4 space-y-5 rounded-lg ${isOwn ? 'bg-white border border-mainOrange/50' : ' bg-lightStormy/40'}`}
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
            <div ref={bottomRef} />
        </div>
    );
}
