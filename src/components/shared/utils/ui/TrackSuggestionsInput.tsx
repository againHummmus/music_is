'use client';

import React, { useState, useEffect, useRef } from "react";
import TrackApi from "@/actions/trackApi";
import { Track } from "../../track/TrackItem";

interface TrackSuggestion {
    id: string;
    name?: string;
    Artist?: { name?: string };
    Album?: { image_hash?: string; name?: string };
}

interface TrackSuggestionInputProps {
    placeholder: string;
    extraParams?: Record<string, any>;
    className?: string;
    onSelect: (track: TrackSuggestion) => void;
    isSearchUp?: boolean
}

export default function TrackSuggestionInput({
    placeholder,
    className,
    extraParams = {},
    onSelect,
    isSearchUp
}: TrackSuggestionInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<TrackSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(false);
    const [showOutput, setShowOutput] = useState(true)
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
            if (inputValue.trim() !== "") {
                setLoading(true);
                try {
                    const requestParams = { name: inputValue, limit: 30, offset: 0, ...extraParams };
                    const response = await TrackApi.searchTracks(requestParams);
                    const data: TrackSuggestion[] = response.data || [];
                    if (data.length > 10) {
                        return;
                    }
                    setSuggestions(data);
                } catch (error) {
                    console.error("Error fetching track suggestions", error);
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
                    setShowOutput && setShowOutput(true)
                }}
                className={`w-full max-h-[40px] my-[5px] px-3 py-2 bg-mainWhite border border-mainOrange focus:outline-none ${(suggestions.length > 0 || loading) && showOutput ? `${isSearchUp ? 'rounded-t-[7px]' : 'rounded-b-[7px]'}` : "rounded-[7px]"
                    }`}
            />
            {loading && showOutput && (
                <div className={`${isSearchUp ? 'rounded-b-[7px] top-[50px]' : 'rounded-t-[7px] bottom-[50px]'} absolute left-0 w-full bg-white border border-mainOrange/80 overflow-y-auto z-10`}>
                    <div className="animate-pulse m-10 w-[100px] h-[20px] bg-mainDark/10 rounded-full" />
                </div>
            )}
            {suggestions.length > 0 && showOutput && (
                <ul className={`${isSearchUp ? 'rounded-b-[7px] top-[50px]' : 'rounded-t-[7px] bottom-[50px]'} absolute w-full shrink-0 left-0 bg-white border border-mainOrange/80 overflow-y-auto z-10`}>
                    {suggestions.map((item) => (
                        <li
                            onClick={() => onSelect(item)}
                            key={item.id}
                            className="cursor-pointer hover:bg-mainOrange/10"
                        >
                            <Track info={item} />
                        </li>
                    ))}
                </ul>
            )}
            {
                !loading &&
                !selected &&
                showOutput &&
                inputValue.trim() !== "" &&
                suggestions.length === 0 && (
                    <ul className={`${isSearchUp ? 'rounded-b-[7px] top-[50px]' : 'rounded-t-[7px] bottom-[50px]'} absolute w-full left-0 bg-white border border-mainOrange/80 max-h-48 overflow-y-auto z-10`}>
                        <li className="px-3 py-2 text-xs text-mainOrange">
                            No tracks found :(
                        </li>
                    </ul>
                )}
        </div>
    );
}
