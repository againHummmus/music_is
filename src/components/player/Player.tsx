'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '@/app/store';
import Image from 'next/image';
import MagePauseFill from '~icons/mage/pause-fill?width=48px&height=48px';
import MagePlayFill from '~icons/mage/play-fill?width=48px&height=48px';
import { createMp3Url, createImgUrl } from '../shared/utils/createUrlFromHash';
import HugeiconsRepeat from '~icons/hugeicons/repeat?width=48px&height=48px';
import SolarArrowRightBold from '~icons/solar/arrow-right-bold?width=48px&height=48px';
import HugeiconsPrevious from '~icons/hugeicons/previous?width=48px&height=48px';
import HugeiconsNext from '~icons/hugeicons/next?width=48px&height=48px';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playTrack,
    currentTime,
    setCurrentTime,
    currentPlaylist,
  } = useStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [localTime, setLocalTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const url = createMp3Url(currentTrack.file_hash);
      if (audioRef.current.src !== url) {
        audioRef.current.src = url;
      }
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTrack, currentTime]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setLocalTime(audioRef.current.currentTime);
  };

  const handlePause = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setLocalTime(newTime);
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(console.error);
    else audioRef.current.pause();
  }, [isPlaying, currentTrack, localTime]);

  const currentIndex = () =>
    currentPlaylist.Playlist_track.findIndex((t) => t.Track.id === currentTrack?.id);

  const playNextTrack = () => {
    if (!currentTrack) return;
    const idx = currentIndex();
    const next = currentPlaylist.Playlist_track[idx + 1];
    if (next) playTrack(next.Track);
  };

  const playPrevTrack = () => {
    if (!currentTrack) return;
    const idx = currentIndex();
    const prev = currentPlaylist.Playlist_track[idx - 1];
    if (prev) playTrack(prev.Track);
  };

  const restartTrack = () => {
    if (!audioRef.current || !currentTrack) return;
    audioRef.current.currentTime = 0;
    setLocalTime(0);
    playTrack(currentTrack);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    const onEnded = () => {
      if (isRepeat) restartTrack();
      else playNextTrack();
    };
    audioRef.current.addEventListener('ended', onEnded);
    return () => audioRef.current?.removeEventListener('ended', onEnded);
  }, [currentTrack, currentPlaylist, isRepeat]);

  if (!currentTrack) return null;



  return (
    <div className="sticky bottom-[50px] main:bottom-0 left-0 right-0 bg-gray-900 text-white p-2 main:p-4 bg-cover bg-center flex flex-col items-center z-[10000] after:absolute after:content-'' after:w-full after:h-full after:top-0 after:left-0 after:bg-gradient-to-r from-mainBlack to-mainBlack/50"
      style={{
        backgroundImage: `url(${currentTrack.Album?.image_hash
            ? createImgUrl(currentTrack.Album.image_hash)
            : '/default_album.jpg'
          })`,
      }}>
      <div className="relative z-[7000] w-full flex justify-between">
        <div className='flex flex-row gap-[10px]'>
          <div>
            <div className='flex flex-row gap-10 items-center'>
              <div className="font-medium">{currentTrack.name}</div>
              <button onClick={() => setIsRepeat(!isRepeat)} aria-label="Repeat">
                {isRepeat ? <HugeiconsRepeat className='w-[17px]' /> : <SolarArrowRightBold className='w-[20px]' />}
              </button>
            </div>
            <div className="text-sm text-gray-400">{currentTrack.Artist?.name}</div>
          </div>
        </div>

        <div className='flex flex-row gap-[10px]'>
          <button className="p-2" onClick={playPrevTrack} aria-label="Previous">
            <HugeiconsPrevious className='w-[20px] h-[20px] text-mainOrange' />
          </button>
          <button className="mx-2 p-2" onClick={togglePlay} aria-label="Play/Pause">
            {isPlaying ? <MagePauseFill className="text-mainOrange w-[20px] main:w-[25px]" /> : <MagePlayFill className="text-mainOrange w-[20px] main:w-[25px]" />}
          </button>
          <button className="p-2" onClick={playNextTrack} aria-label="Next">
            <HugeiconsNext className='w-[20px] h-[20px] text-mainOrange' />
          </button>
        </div>

      </div>

      <div className="relative z-[7000] w-full mt-2">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={localTime}
          onChange={handleSliderChange}
          className="w-full h-[5px] accent-mainOrange rounded outline-none"
        />
        <div className="text-xs text-gray-400 mt-1 flex justify-between">
          <span>{formatTime(localTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPause={handlePause}
        style={{ display: 'none' }}
      />
    </div>
  );
}
