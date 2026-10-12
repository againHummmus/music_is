import { getCurrentUser } from '@/actions/session';
import { getUserDialogues } from '@/actions/dialogueApi';
import { getLastMessage } from '@/actions/messageApi';
import { DialoguesScreen } from '@/screens/dialogues/DialoguesScreen';
import type { DialogueRow, MessageRow } from '@/actions/types';

export default async function Page() {
  const user = await getCurrentUser();

  let dialogues: DialogueRow[] = [];
  let lastMessages: Record<number, MessageRow | null> = {};

  if (user?.id) {
    dialogues = await getUserDialogues();
    const messageResults = await Promise.all(
      dialogues.map(async ({ dialogueId, Dialogue }) => {
        if (dialogueId == null) return { dialogueId, message: null };
        const count = Dialogue?.Message[0]?.count ?? 0;
        if (count === 0) return { dialogueId, message: null };
        const message = await getLastMessage({ dialogueId });
        return { dialogueId, message };
      })
    );

    lastMessages = Object.fromEntries(
      messageResults.map(({ dialogueId, message }) => [dialogueId, message])
    );
  }

  return (
    <DialoguesScreen
      initialUser={user}
      initialDialogues={dialogues}
      initialLastMessages={lastMessages}
    />
  );
}
