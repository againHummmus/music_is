'use client';

import React, { useRef, useEffect, useState } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
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
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const currentPlaylist = usePlayerStore((s) => s.currentPlaylist);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
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

  const playlistTracks = currentPlaylist?.Playlist_track ?? [];

  const currentIndex = () =>
    playlistTracks.findIndex((t) => t.Track?.id === currentTrack?.id);

  const playTrackAt = (offset: number) => {
    if (!currentTrack) return;
    const idx = currentIndex();
    if (idx === -1) return;
    const target = playlistTracks[idx + offset];
    if (target?.Track) playTrack(target.Track);
  };

  const playNextTrack = () => playTrackAt(1);

  const playPrevTrack = () => playTrackAt(-1);

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
    <div
      className="after:content-'' sticky bottom-[50px] left-0 right-0 z-[10000] flex flex-col items-center bg-gray-900 from-mainBlack to-mainBlack/50 bg-cover bg-center p-1 main:px-4 text-white after:absolute after:left-0 after:top-0 after:h-full after:w-full after:bg-gradient-to-r main:bottom-0 main:p-2"
      style={{
        backgroundImage: `url(${
          currentTrack.Album?.image_hash
            ? createImgUrl(currentTrack.Album.image_hash)
            : '/default_album.jpg'
        })`,
      }}
    >
      <div className="relative z-[7000] flex w-full justify-between">
        <div className="flex flex-row gap-[10px]">
          <div>
            <div className="flex flex-row items-center gap-10">
              <span className="font-medium">{currentTrack.name}</span>
              <span>∘</span>
              <span className="text-sm text-gray-400">
              {currentTrack.Artist?.name}
            </span>
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                aria-label="Repeat"
              >
                {isRepeat ? (
                  <HugeiconsRepeat className="w-[17px]" />
                ) : (
                  <SolarArrowRightBold className="w-[20px]" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-[10px]">
          <button onClick={playPrevTrack} aria-label="Previous">
            <HugeiconsPrevious className="h-[20px] w-[20px] text-mainOrange" />
          </button>
          <button
            className="mx-2"
            onClick={togglePlay}
            aria-label="Play/Pause"
          >
            {isPlaying ? (
              <MagePauseFill className="w-[20px] text-mainOrange main:w-[25px]" />
            ) : (
              <MagePlayFill className="w-[20px] text-mainOrange main:w-[25px]" />
            )}
          </button>
          <button onClick={playNextTrack} aria-label="Next">
            <HugeiconsNext className="h-[20px] w-[20px] text-mainOrange" />
          </button>
        </div>
      </div>

      <div className="relative z-[7000] w-full">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={localTime}
          onChange={handleSliderChange}
          className="h-[5px] w-full rounded accent-mainOrange outline-none"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
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
