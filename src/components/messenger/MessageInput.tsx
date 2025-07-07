// components/MessageInput.tsx
'use client';

import { useState } from 'react';
import MessageApi from '@/actions/messageApi';
import { useStore } from '@/app/store';
import TrackSuggestionInput from '../shared/utils/ui/TrackSuggestionsInput';
import { Track } from '../shared/track/TrackItem';
import HugeiconsMusicNote04 from '~icons/hugeicons/music-note-04';
import HugeiconsCancel01 from '~icons/hugeicons/cancel-01';

interface MessageInputProps {
  dialogueId: number;
}

export default function MessageInput({ dialogueId }: MessageInputProps) {
  const [text, setText] = useState('');
  const [track, setTrack] = useState<any>(null);
  const [addTrack, setAddTrack] = useState(false);
  const { user } = useStore();

  const sendMessage = async () => {
    if ((!text.trim() && !track) || !dialogueId || !user) return;

    try {
      await MessageApi.createMessage({
        userId: user.id,
        dialogueId,
        content: text.trim(),
        track: track ? track.id : undefined
      });

      setText('');
      setTrack(null);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const handleTrackSelect = (selectedTrack: any) => {
    setTrack(selectedTrack);
    setAddTrack(false);
  };

  const handleRemoveTrack = () => {
    setTrack(null);
  };

  return (
    <div className="fixed right-0 left-0 main:sticky flex flex-col bottom-[50px] main:bottom-0 py-2 max-main:px-1 gap-10 pb-[20px] border-t border-gray-300 bg-mainWhite/20 backdrop-blur-md">
      {addTrack && <div className="mb-2">
        <TrackSuggestionInput
          placeholder="Find a track..."
          onSelect={handleTrackSelect}
          isSearchUp={false}
        />
      </div>}
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
          className="flex grow px-3 py-2 min-w-0 border border-gray-300 rounded-md focus:ring-1 focus:outline-mainOrange/30"
        />
        <button
          onClick={() => setAddTrack(!addTrack)}
          className="h-full ml-2 px-1 main:px-4 py-2 border border-mainOrange text-mainOrange rounded-md"
        >
          <HugeiconsMusicNote04 />
        </button>
        <button
          onClick={sendMessage}
          disabled={!text.trim() && !track}
          className="h-full ml-2 px-4 py-2 bg-mainOrange text-white rounded-md disabled:bg-gray-400"
        >
          Send
        </button>

      </div>
      {track && (
        <div className="flex items-center justify-between p-2 mb-2 bg-mainWhite rounded-md border border-mainOrange">
          <Track key={track.id} info={track} className='w-full'/>
          <HugeiconsCancel01
            onClick={handleRemoveTrack}
            className="ml-2 text-badRed focus:outline-none size-[20px] cursor-pointer"
            aria-label="Delete track"
          />
        </div>
      )}
    </div>
  );
}