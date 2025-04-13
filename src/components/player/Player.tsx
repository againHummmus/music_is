'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '@/app/store';
import Image from 'next/image';
import MagePauseFill from '~icons/mage/pause-fill?width=48px&height=48px';
import MagePlayFill from '~icons/mage/play-fill?width=48px&height=48px';
import { createMp3Url, createImgUrl } from '../shared/utils/createUrlFromHash';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function Player() {
  const { currentTrack, isPlaying, togglePlay, currentTime, setCurrentTime } = useStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [localTime, setLocalTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setLocalTime(audioRef.current.currentTime);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setLocalTime(newTime);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error("Audio play error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-[40px] main:bottom-0 left-0 right-0 bg-gray-900 text-white pt-2 pb-4 main:pb-2 px-[15px] flex flex-col items-center z-[1000]">
      <div className="w-full flex items-center">
        <div className="w-12 h-12 mr-4">
          <Image
            src={
              currentTrack.Album?.image_hash
                ? createImgUrl(currentTrack.Album.image_hash)
                : '/default_album.jpg'
            }
            width={100}
            height={100}
            alt={currentTrack.name || 'album image'}
            className="w-full h-full object-cover rounded-[7px]"
          />
        </div>
        <div className="flex-1">
          <div className="font-medium">{currentTrack.name}</div>
          <div className="text-sm text-gray-400">{currentTrack.Artist?.name}</div>
        </div>
        <button className="ml-auto p-2" onClick={togglePlay}>
          {isPlaying ? (
            <MagePauseFill className="text-mainOrange w-[30px] main:w-[35px]" />
          ) : (
            <MagePlayFill className="text-mainOrange w-[30px] main:w-[35px]" />
          )}
        </button>
      </div>

      <div className="w-full mt-2">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={localTime}
          onChange={handleSliderChange}
          className="w-full h-2 accent-mainOrange rounded outline-none"
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
