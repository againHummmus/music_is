import React from 'react';
import { createImgUrl } from '../shared/utils/createUrlFromHash';
import Link from 'next/link';

export default function AlbumCard({ album }: { album: any }) {
  return (
    <Link
      className="transform overflow-hidden rounded-lg border border-mainOrange bg-white transition-transform duration-300 hover:-translate-y-[3px]"
      href={`/album/${album.id}`}
    >
      <img
        src={createImgUrl(album.image_hash)}
        alt={album.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="mb-1 truncate text-xl font-bold text-gray-800">
          {album.name}
        </h3>
        {/* {album.artistName && (
          <p className="text-sm text-gray-600 mb-2 truncate">{album.artistName}</p>
        )} */}
        <p className="text-sm text-gray-500">{album.year}</p>
      </div>
    </Link>
  );
}
