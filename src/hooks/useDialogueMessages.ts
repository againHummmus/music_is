import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabaseBrowser';
import { getMessages } from '@/actions/messageApi';
import type { MessageRow } from '@/actions/types';

export function useDialogueMessages(
  dialogueId: number,
  initialMessages: MessageRow[],
  pageSize: number,
  enabled: boolean
) {
  const [messages, setMessages] = useState(initialMessages);
  const [hasOlder, setHasOlder] = useState(
    initialMessages.length >= pageSize
  );
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  const loadOlder = async () => {
    const oldest = messages[0];
    if (!oldest || isLoadingOlder) return;
    setIsLoadingOlder(true);
    try {
      const older = await getMessages({
        dialogueId,
        limit: pageSize,
        before: oldest.created_at,
      });
      setMessages((prev) => [...older, ...prev]);
      setHasOlder(older.length === pageSize);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingOlder(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const appendMessage = (message: MessageRow) =>
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message]
      );

    const channel = supabase
      .channel(`dialogue-${dialogueId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `dialogueId=eq.${dialogueId}`,
        },
        async (ctx) => {
          const [message] = await getMessages({
            dialogueId,
            limit: 1,
            id: ctx.new.id,
          });
          if (message && !cancelled) appendMessage(message);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      channel.unsubscribe();
    };
  }, [dialogueId, enabled]);

  return { messages, hasOlder, isLoadingOlder, loadOlder };
}
