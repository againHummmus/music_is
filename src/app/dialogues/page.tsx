'use client';

import { useEffect, useState } from 'react';
import DialogueApi from '@/actions/dialogueApi';
import MessageApi, { MessageDto } from '@/actions/messageApi';
import { useStore } from '@/app/store';
import Image from 'next/image';
import { createImgUrl } from '@/components/shared/utils/createUrlFromHash';
import Link from 'next/link';

export default function UserDialoguesList() {
    const { user } = useStore();
    const [dialogues, setDialogues] = useState<any[]>([]);
    const [lastMessages, setLastMessages] = useState<Record<number, MessageDto | null>>({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!user?.id) return;

        DialogueApi.getUserDialogues({ userId: user.id })
            .then(async (data) => {
                setDialogues(data);
                const messagesMap: Record<number, MessageDto | null> = {};
                for (const d of data) {
                    try {
                        const messages = await MessageApi.getMessages({
                            userId: user.id,
                            dialogueId: d.dialogueId,
                            limit: 1,
                            offset: d.Dialogue.Message[0]?.count - 1,
                        });
                        messagesMap[d.dialogueId] = messages?.[messages.length - 1] ?? null;
                    } catch (err) {
                        console.error('Error loading last message', err);
                        messagesMap[d.dialogueId] = null;
                    }
                }

                setLastMessages(messagesMap);
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [user]);

    return (
        <div className="space-y-4 p-4">
            <h1 className="text-xl font-bold">Your dialogues</h1>
            {loading ?
                Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-[90px] bg-gray-300 animate-pulse rounded"
                    ></div>
                )) :
                dialogues.length > 0 ?

                    dialogues?.map((d) => {
                        const participants = d.Dialogue.User_dialogue;
                        const partner = participants.find((p: any) => p.userId !== user.id)?.User;
                        const message = lastMessages[d.dialogueId];
                        return (
                            <Link key={d.dialogueId} className="border p-2 main:p-4 rounded flex items-start gap-4 border-lightStormy hover:border-mainOrange/80 hover:shadow-md hover:shadow-mainOrange/10 transition-all" href={`/dialogues/${d.dialogueId}`}>
                                {partner?.avatar_url && (
                                    <Image
                                        src={createImgUrl(partner.avatar_url)}
                                        alt={partner.username}
                                        width={60}
                                        height={60}
                                        className="rounded-[7px] aspect-square object-cover"
                                    />
                                )}
                                <div className="flex flex-col">
                                    <div className="font-semibold">{partner?.username ?? 'Unknown user'}</div>
                                    <div className="text-sm text-gray-600">
                                        {message?.content ?? 'No messages'}
                                    </div>
                                    {message && (
                                        <div className="text-[10px] text-gray-400">
                                            {new Date(message.created_at).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })
                    : <p>No active dialogues:(</p>
            }
        </div>
    );
}
