import { getCurrentUser } from '@/actions/session';
import { getParticipants } from '@/actions/dialogueApi';
import { DialogueScreen } from '@/screens/dialogue/DialogueScreen';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function Page({ params }: { params: { id: string } }) {
  const serverUser = await getCurrentUser();

  const participants = await getParticipants(Number(params.id));

  if (!participants) {
    return (
      <EmptyState>Couldn&apos;t load the dialogue. Try again later.</EmptyState>
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
