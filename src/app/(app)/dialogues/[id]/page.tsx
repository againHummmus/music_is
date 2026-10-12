import { getCurrentUser } from '@/actions/session';
import { getParticipants } from '@/actions/dialogueApi';
import { getMessages } from '@/actions/messageApi';
import { DialogueScreen } from '@/screens/dialogue/DialogueScreen';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function Page({ params }: { params: { id: string } }) {
  const dialogueId = Number(params.id);
  const [serverUser, participants, messages] = await Promise.all([
    getCurrentUser(),
    getParticipants(dialogueId),
    getMessages({ dialogueId }),
  ]);

  if (!participants) {
    return (
      <EmptyState>Couldn&apos;t load the dialogue. Try again later.</EmptyState>
    );
  }

  return (
    <DialogueScreen
      dialogueId={dialogueId}
      initialUser={serverUser}
      initialParticipants={participants}
      initialMessages={messages}
    />
  );
}
