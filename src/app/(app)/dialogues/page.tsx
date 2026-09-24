import { getCurrentUser } from '@/actions/session';
import { getUserDialogues } from '@/actions/dialogueApi';
import { getLastMessage } from '@/actions/messageApi';
import DialoguesScreen from './Screen';
export default async function Page() {
  const user = await getCurrentUser();

  let dialogues: any[] = [];
  let lastMessages: Record<number, any> = {};

  if (user?.id) {
    dialogues = await getUserDialogues();
    const messageResults = await Promise.all(
      dialogues.map(async (d) => {
        const count = d.Dialogue.Message[0]?.count ?? 0;
        if (count === 0) return { dialogueId: d.dialogueId, message: null };
        const message = await getLastMessage({
          dialogueId: d.dialogueId,
        });
        return { dialogueId: d.dialogueId, message };
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
