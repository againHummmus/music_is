'use client';

import { useEffect, useState } from 'react';
import DialogueApi from '@/actions/dialogueApi';
import { useStore } from '@/app/store';
import MessageInput from '@/components/messenger/MessageInput';
import MessageList from '@/components/messenger/MessageList';

export default function DialoguePage({ params }: { params: any }) {
  const dialogueId = params.id;
  const { user } = useStore();

  const [participants, setParticipants] = useState<
    Array<{ userId: number; is_creator: boolean; User: { id: number; username: string; avatar_url?: string } }>
  >([]);

  useEffect(() => {
    if (!dialogueId) return;
    DialogueApi.getParticipants(dialogueId)
      .then((data) => setParticipants(data))
      .catch((err) => console.error('Error fetching participants', err));
  }, [dialogueId]);
  
  return (
    <>
      <div className="z-[6000] sticky w-fit rounded-full top-[45px] main:top-[70px] mx-auto px-[10px] bg-lightStormy/30 backdrop-blur-md">
        {participants.filter(participant => participant.userId.toString() != user.id).map((p, index) => (
          <div key={p.userId} className=" flex items-center space-x-2">
            <h2>{p.User.username}{index != participants.length - 2 && ', '}</h2>
          </div>
        ))}
      </div>
      <div className="flex flex-col min-h-full">
        <MessageList dialogueId={dialogueId}/>
        <MessageInput dialogueId={dialogueId} />
      </div>
    </>
  );
}
