'use client';

import React, { useState, useEffect } from 'react';

interface SuggestionInputProps<T> {
  searchFn: (
    params: { name: string; limit: number; offset: number } & Record<
      string,
      string | number | boolean | undefined
    >
  ) => Promise<{ data: T[] }>;
  placeholder: string;
  typeName: string;
  onSelect: (item: T) => void;
  extraParams?: Record<string, string | number | boolean | undefined>;
}

function SuggestionInput<
  T extends { id: string | number; name?: string | null },
>({
  searchFn,
  placeholder,
  typeName,
  onSelect,
  extraParams = {},
}: SuggestionInputProps<T>) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selected, setSelected] = useState(false);

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
          const response = await searchFn(requestParams);
          setSuggestions(response.data || []);
        } catch (error) {
          console.error(`Error fetching ${typeName} suggestions`, error);
          setSuggestions([]);
        } finally {
          setLoading(false);
          setHasLoaded(true);
        }
      } else {
        setSuggestions([]);
        setHasLoaded(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, selected, searchFn, typeName, extraParams]);

  const handleSelect = (item: T) => {
    onSelect(item);
    if (item.name) setInputValue(item.name);
    setSuggestions([]);
    setSelected(true);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setSelected(false);
        }}
        className={`w-full border border-darkStormy/80 bg-darkStormy/10 px-3 py-2 focus:outline-none ${
          suggestions.length > 0 || loading
            ? 'rounded-t-[7px]'
            : 'rounded-[7px]'
        }`}
      />
      {loading && (
        <div className="absolute left-0 top-[40px] z-10 max-h-48 w-full overflow-y-auto rounded-b-[7px] border border-mainOrange/80 bg-white">
          <div className="m-10 h-[20px] w-[100px] animate-pulse rounded-full bg-mainDark/10" />
        </div>
      )}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 top-[40px] z-10 max-h-48 w-full overflow-y-auto rounded-b-[7px] border border-mainOrange/80 bg-white">
          <div className="px-3 pt-2 text-xs text-mainOrange">{typeName}s:</div>
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className="cursor-pointer px-3 py-2 hover:bg-mainOrange/10"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
      {hasLoaded &&
        !loading &&
        !selected &&
        inputValue.trim() !== '' &&
        suggestions.length === 0 && (
          <ul className="absolute left-0 top-[40px] z-10 max-h-48 w-full overflow-y-auto rounded-b-[7px] border border-mainOrange/80 bg-white">
            <li className="px-3 py-2 text-xs text-mainOrange">
              No {typeName.toLowerCase()}s found :(
            </li>
          </ul>
        )}
    </div>
  );
}

export default SuggestionInput;
