"use client"
import React, { useState } from "react";
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01';
import { FileUploader } from "react-drag-drop-files";

export default function UploadTrack() {
  const fileTypes = ["MP3"];
  const [file, setFile] = useState<any>(null);
  const handleChange = (file: any) => {
    setFile(file);
  };
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 bg-mainWhite text-darkStormy/80">
      <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-8 text-center">
        Uploading your track
      </h1>

      <div className="w-full max-w-[550px] flex flex-col gap-6 mb-6">
        <div className="p-6 bg-white rounded-lg flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4 text-mainBlack w-full text-center">Add files</h2>
          <FileUploader handleChange={handleChange} name="track" types={fileTypes}>
            <div className="w-full h-[50px] main:h-[100px] flex flex-row items-center justify-center gap-[10px] px-4 py-2 bg-darkStormy/10 border border-dashed border-darkStormy/80 hover:border-darkStormy hover:text-darkStormy rounded-[7px] transition-all">
              {file 
              ? <div>
                  {file.name}
                </div>
              : <>
                  <p className="hidden main:block">drag-n-drop or select</p>
                  <p className="block main:hidden">select</p>
                  <HugeiconsUploadCircle01 className="min-w-[25px] min-h-[25px]" />
                </>}
            </div>
          </FileUploader>
        </div>

        <div className="p-6 bg-white rounded-lg flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-4 text-mainBlack w-full text-center">basic info</h2>
          <input
            type="text"
            placeholder="name..."
            className="w-full mb-3 px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />
          <input
            type="text"
            placeholder="genre..."
            className="w-full mb-3 px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />
          <textarea
            placeholder="add lyrics, if you want..."
            className="w-full h-24 mb-3 px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-mainOrange resize-none"
          />
        </div>
      </div>

      <button className="p-4 rounded-full aspect-square bg-mainBlack text-white hover:bg-mainOrange transition-all">
        OK
      </button>
    </div>
  );
}
