'use client';

import React, { useState, useEffect, useRef } from 'react';
import { searchTracks } from '@/actions/trackApi';
import type { TrackRow } from '@/actions/types';
import { Track } from '../../track/TrackItem';

export interface TrackSuggestion {
  id: string | number;
  name?: string | null;
  Artist?: { name?: string | null } | null;
  Album?: { image_hash?: string | null; name?: string | null } | null;
}

interface TrackSuggestionInputProps {
  placeholder: string;
  extraParams?: Record<string, any>;
  className?: string;
  onSelect: (track: TrackSuggestion) => void;
  isSearchUp?: boolean;
}

export default function TrackSuggestionInput({
  placeholder,
  className,
  extraParams = {},
  onSelect,
  isSearchUp,
}: TrackSuggestionInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<TrackSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowOutput?.(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setShowOutput]);

  useEffect(() => {
    if (selected) return;

    const delayDebounceFn = setTimeout(async () => {
      if (inputValue.trim() !== '') {
        setLoading(true);
        try {
          const requestParams = {
            name: inputValue,
            limit: 30,
            offset: 0,
            ...extraParams,
          };
          const response = await searchTracks(requestParams);
          const data: TrackSuggestion[] = response.data || [];
          if (data.length > 10) {
            return;
          }
          setSuggestions(data);
        } catch (error) {
          console.error('Error fetching track suggestions', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, selected]);

  return (
    <div className={`relative flex-col ${className}`} ref={wrapperRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setSelected(false);
          setShowOutput && setShowOutput(true);
        }}
        className={`my-[5px] max-h-[40px] w-full border border-mainOrange bg-mainWhite px-3 py-2 focus:outline-none ${
          (suggestions.length > 0 || loading) && showOutput
            ? `${isSearchUp ? 'rounded-t-[7px]' : 'rounded-b-[7px]'}`
            : 'rounded-[7px]'
        }`}
      />
      {loading && showOutput && (
        <div
          className={`${isSearchUp ? 'top-[50px] rounded-b-[7px]' : 'bottom-[50px] rounded-t-[7px]'} absolute left-0 z-10 w-full overflow-y-auto border border-mainOrange/80 bg-white`}
        >
          <div className="m-10 h-[20px] w-[100px] animate-pulse rounded-full bg-mainDark/10" />
        </div>
      )}
      {suggestions.length > 0 && showOutput && (
        <ul
          className={`${isSearchUp ? 'top-[50px] rounded-b-[7px]' : 'bottom-[50px] rounded-t-[7px]'} absolute left-0 z-10 w-full shrink-0 overflow-y-auto border border-mainOrange/80 bg-white`}
        >
          {suggestions.map((item) => (
            <li
              onClick={() => onSelect(item)}
              key={item.id}
              className="cursor-pointer hover:bg-mainOrange/10"
            >
              <Track info={item as unknown as TrackRow} />
            </li>
          ))}
        </ul>
      )}
      {!loading &&
        !selected &&
        showOutput &&
        inputValue.trim() !== '' &&
        suggestions.length === 0 && (
          <ul
            className={`${isSearchUp ? 'top-[50px] rounded-b-[7px]' : 'bottom-[50px] rounded-t-[7px]'} absolute left-0 z-10 max-h-48 w-full overflow-y-auto border border-mainOrange/80 bg-white`}
          >
            <li className="px-3 py-2 text-xs text-mainOrange">
              No tracks found :(
            </li>
          </ul>
        )}
    </div>
  );
}
