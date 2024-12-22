"use client";
import React, { useState, useEffect } from "react";
import HugeiconsSearch01 from "~icons/hugeicons/search-01";
import HugeiconsCancel01 from "~icons/hugeicons/cancel-01?width=24px&height=24px";

export default function Search({
  placeholder,
}: {
  placeholder?: string;
  notFound?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleWindowResize = () => {
    if (window.innerWidth >= 800 || window.innerWidth <= 1024) {
      setIsOpen(false);
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const searchInput = document.getElementById("search-input");
    if (isOpen) {
      searchInput?.focus();
    }
  }, [isOpen]);

  return (
    <div className={`relative z-50`}>
      <div
        className="group flex h-[40px] cursor-pointer items-center overflow-hidden rounded-full border border-mainOrange transition-all duration-300 after:absolute after:left-0 after:top-0 after:-z-[1] after:h-full after:w-full after:bg-white/20 after:backdrop-blur main:max-laptop:absolute main:max-laptop:right-0 laptop:w-[250px]"
      >
        <div className="p-[8px]" onClick={() => setIsOpen(true)}>
          <HugeiconsSearch01 className="text-mainOrange transition-all" />
        </div>

        <input
          id="search-input"
          onClick={() => setIsOpen(true)}
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          type="text"
          className={`search-input h-full w-full bg-transparent font-light outline-none transition-all duration-300 placeholder:text-placeholderOrange`}
          placeholder={placeholder ? placeholder : "Search"}
        />
        <button
          onClick={() => {
            setIsOpen(false);
            setSearchValue("");
          }}
          className={`block laptop:hidden`}
          aria-label="close search"
        >
          <HugeiconsCancel01
            className="h-[40px] w-[40px] p-[8px] text-white transition-all duration-300"
          />
        </button>
      </div>
    </div>
  );
}
