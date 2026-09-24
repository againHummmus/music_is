'use client';

import { useStore } from '@/app/store';
import Image from 'next/image';
import { createImgUrl } from '@/components/shared/utils/createUrlFromHash';
import Link from 'next/link';
import ClientDate from '@/lib/utils/ClientDate';
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';

interface Props {
  initialUser: any;
  initialDialogues: any[];
  initialLastMessages: Record<number, any>;
}

export default function DialoguesScreen({
  initialUser,
  initialDialogues,
  initialLastMessages,
}: Props) {
  const storeUser = useStore((s) => s.user);
  const user = storeUser ?? initialUser;
  const dialogues = initialDialogues;
  const lastMessages = initialLastMessages;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">Your dialogues</h1>
      {dialogues.length > 0 ? (
        dialogues.map((d) => {
          const partner = d.Dialogue.User_dialogue.find(
            (p: any) => p.userId !== user.id
          )?.User;
          const message = lastMessages[d.dialogueId];
          return (
            <Link
              key={d.dialogueId}
              className="flex items-start gap-4 rounded border border-lightStormy p-2 transition-all hover:border-mainOrange/80 hover:shadow-md hover:shadow-mainOrange/10 main:p-4"
              href={`/dialogues/${d.dialogueId}`}
            >
              <Image
                src={
                  partner.avatar_url
                    ? createImgUrl(partner.avatar_url)
                    : '/images/placeholderAvatar.png'
                }
                alt={partner.username}
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
        <div className="flex h-[230px] flex-col items-center justify-center gap-20 rounded-[7px] border border-dashed border-mainOrange text-mainOrange">
          <StreamlineSleep className="h-[40px] w-[40px]" />
          <p>You have no dialogues yet!</p>
        </div>
      )}
    </div>
  );
}
