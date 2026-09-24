import { getCurrentUser } from '@/actions/session';
import { getParticipants } from '@/actions/dialogueApi';
import DialogueScreen from './Screen';
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';

export default async function Page({ params }: { params: { id: string } }) {
  const serverUser = await getCurrentUser();

  const participants = await getParticipants(Number(params.id));

  if (!participants) {
    return (
      <div className="flex h-[230px] flex-col items-center justify-center gap-20 rounded-[7px] border border-dashed border-mainOrange text-mainOrange">
        <StreamlineSleep className="h-[40px] w-[40px]" />
        <p>Couldn&apos;t load the dialogue. Try again later.</p>
      </div>
    );
  }

  return (
    <DialogueScreen
      dialogueId={Number(params.id)}
      initialUser={serverUser}
      initialParticipants={participants}
    />
  );
}
