'use client';

import { useAuthStore } from '@/stores/authStore';
import Image from 'next/image';
import { createImgUrl } from '@/lib/utils/createUrlFromHash';
import Link from 'next/link';
import { ClientDate } from '@/components/ui/ClientDate';
import type {
  DialogueRow,
  MessageRow,
  UserWithArtist,
} from '@/actions/types';
import { EmptyState } from '@/components/ui/EmptyState';

interface Props {
  initialUser: UserWithArtist | null;
  initialDialogues: DialogueRow[];
  initialLastMessages: Record<number, MessageRow | null>;
}

export function DialoguesScreen({
  initialUser,
  initialDialogues,
  initialLastMessages,
}: Props) {
  const storeUser = useAuthStore((s) => s.user);
  const user = storeUser ?? initialUser;
  const dialogues = initialDialogues;
  const lastMessages = initialLastMessages;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">Your dialogues</h1>
      {dialogues.length > 0 ? (
        dialogues.map((d) => {
          const partner = d.Dialogue?.User_dialogue.find(
            (p) => p.userId !== user?.id
          )?.User;
          const message =
            d.dialogueId == null ? null : lastMessages[d.dialogueId];
          return (
            <Link
              key={d.dialogueId}
              className="flex items-start gap-4 rounded border border-lightStormy p-2 transition-all hover:border-mainOrange/80 hover:shadow-md hover:shadow-mainOrange/10 main:p-4"
              href={`/dialogues/${d.dialogueId}`}
            >
              <Image
                src={
                  partner?.avatar_url
                    ? createImgUrl(partner.avatar_url)
                    : '/images/placeholderAvatar.png'
                }
                alt={partner?.username ?? 'Unknown user'}
                width={60}
                height={60}
                className="aspect-square rounded-[7px] object-cover"
              />
              <div className="flex flex-col">
                <div className="font-semibold">
                  {partner?.username ?? 'Unknown user'}
                </div>
                <div className="text-sm text-gray-600">
                  {message?.content ?? 'No messages'}
                </div>
                {message && (
                  <div className="text-[10px] text-gray-400">
                    <ClientDate iso={message.created_at} className='opacity-70'/>
                  </div>
                )}
              </div>
            </Link>
          );
        })
      ) : (
        <EmptyState>You have no dialogues yet!</EmptyState>
      )}
    </div>
  );
}
