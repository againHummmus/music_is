'use client';

import React, { useState, useEffect } from "react";

interface SuggestionInputProps<T> {
  searchFn: (params: { name: string; limit: number; offset: number } & Record<string, any>) => Promise<{ data: T[] }>;
  placeholder: string;
  typeName: string;
  onSelect: (item: T) => void;
  extraParams?: Record<string, any>;
}

function SuggestionInput<T extends { id: string; name?: string }>({
  searchFn,
  placeholder,
  typeName,
  onSelect,
  extraParams = {},
}: SuggestionInputProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (selected) return;

    const delayDebounceFn = setTimeout(async () => {
      if (inputValue.trim() !== "") {
        setLoading(true);
        try {
          const requestParams = { name: inputValue, limit: 30, offset: 0, ...extraParams };
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
        className={`w-full px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 focus:outline-none ${
          suggestions.length > 0 || loading ? "rounded-t-[7px]" : "rounded-[7px]"
        }`}
      />
      {loading && (
        <div className="absolute w-full top-[40px] left-0 bg-white border border-mainOrange/80 rounded-b-[7px] max-h-48 overflow-y-auto z-10">
          <div className="animate-pulse m-10 w-[100px] h-[20px] bg-mainDark/10 rounded-full" />
        </div>
      )}
      {suggestions.length > 0 && (
        <ul className="absolute w-full top-[40px] left-0 bg-white border border-mainOrange/80 rounded-b-[7px] max-h-48 overflow-y-auto z-10">
          <div className="px-3 pt-2 text-xs text-mainOrange">{typeName}s:</div>
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className="px-3 py-2 hover:bg-mainOrange/10 cursor-pointer"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
      {hasLoaded &&
        !loading &&
        !selected &&
        inputValue.trim() !== "" &&
        suggestions.length === 0 && (
          <ul className="absolute w-full top-[40px] left-0 bg-white border border-mainOrange/80 rounded-b-[7px] max-h-48 overflow-y-auto z-10">
            <li className="px-3 py-2 text-xs text-mainOrange">
              No {typeName.toLowerCase()}s found :(
            </li>
          </ul>
        )}
    </div>
  );
}

export default SuggestionInput;
