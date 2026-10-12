'use client';

import type {
  MessageRow,
  ParticipantRow,
  UserWithArtist,
} from '@/actions/types';
import { useAuthStore } from '@/stores/authStore';
import { MessageList } from '@/screens/dialogue/MessageList';
import { MessageInput } from '@/screens/dialogue/MessageInput';

export function DialogueScreen({
  dialogueId,
  initialUser,
  initialParticipants,
  initialMessages,
}: {
  dialogueId: number;
  initialUser: UserWithArtist | null;
  initialParticipants: ParticipantRow[];
  initialMessages: MessageRow[];
}) {
  const storeUser = useAuthStore((s) => s.user);
  const user = storeUser ?? initialUser;

  return (
    <>
      <div className="sticky top-[45px] z-[6000] mx-auto w-fit rounded-full bg-lightStormy/30 px-[10px] backdrop-blur-md main:top-[70px]">
        {initialParticipants
          .filter((p) => p.userId?.toString() != user?.id)
          .map((p, index) => (
            <div key={p.userId} className="flex items-center space-x-2">
              <h2>
                {p.User?.username}
                {index != initialParticipants.length - 2 && ', '}
              </h2>
            </div>
          ))}
      </div>
      <div className="flex min-h-full flex-col">
        <MessageList dialogueId={dialogueId} initialMessages={initialMessages} />
        <MessageInput dialogueId={dialogueId} />
      </div>
    </>
  );
}
