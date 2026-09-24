// components/MessageInput.tsx
'use client';

import { useState } from 'react';
import { createMessage } from '@/actions/messageApi';
import { useAuthStore } from '@/stores/authStore';
import TrackSuggestionInput from '../shared/utils/ui/TrackSuggestionsInput';
import type { TrackSuggestion } from '../shared/utils/ui/TrackSuggestionsInput';
import { Track } from '../shared/track/TrackItem';
import type { TrackRow } from '@/actions/types';
import HugeiconsMusicNote04 from '~icons/hugeicons/music-note-04';
import HugeiconsCancel01 from '~icons/hugeicons/cancel-01';

interface MessageInputProps {
  dialogueId: number;
}

export default function MessageInput({ dialogueId }: MessageInputProps) {
  const [text, setText] = useState('');
  const [track, setTrack] = useState<TrackSuggestion | null>(null);
  const [addTrack, setAddTrack] = useState(false);
  const user = useAuthStore((s) => s.user);

  const sendMessage = async () => {
    if ((!text.trim() && !track) || !dialogueId || !user) return;

    try {
      await createMessage({
        dialogueId,
        content: text.trim(),
        track: track ? { id: track.id } : undefined,
      });

      setText('');
      setTrack(null);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const handleTrackSelect = (selectedTrack: TrackSuggestion) => {
    setTrack(selectedTrack);
    setAddTrack(false);
  };

  const handleRemoveTrack = () => {
    setTrack(null);
  };

  return (
    <div className="fixed bottom-[50px] left-0 right-0 flex flex-col gap-10 border-t border-gray-300 bg-mainWhite/20 py-2 pb-[20px] backdrop-blur-md max-main:px-1 main:sticky main:bottom-0">
      {addTrack && (
        <div className="mb-2">
          <TrackSuggestionInput
            placeholder="Find a track..."
            onSelect={handleTrackSelect}
            isSearchUp={false}
          />
        </div>
      )}
      <div className="flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Enter..."
          className="flex min-w-0 grow rounded-md border border-gray-300 px-3 py-2 focus:outline-mainOrange/30 focus:ring-1"
        />
        <button
          onClick={() => setAddTrack(!addTrack)}
          className="ml-2 h-full rounded-md border border-mainOrange px-1 py-2 text-mainOrange main:px-4"
        >
          <HugeiconsMusicNote04 />
        </button>
        <button
          onClick={sendMessage}
          disabled={!text.trim() && !track}
          className="ml-2 h-full rounded-md bg-mainOrange px-4 py-2 text-white disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
      {track && (
        <div className="mb-2 flex items-center justify-between rounded-md border border-mainOrange bg-mainWhite p-2">
          <Track
            key={track.id}
            info={track as unknown as TrackRow}
            className="w-full"
          />
          <HugeiconsCancel01
            onClick={handleRemoveTrack}
            className="ml-2 size-[20px] cursor-pointer text-badRed focus:outline-none"
            aria-label="Delete track"
          />
        </div>
      )}
    </div>
  );
}
