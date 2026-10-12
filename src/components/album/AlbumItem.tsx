import React from 'react';
import { createImgUrl } from '@/lib/utils/createUrlFromHash';
import Link from 'next/link';
import type { Album } from '@/types/supabase';

export function AlbumItem({ album }: { album: Album }) {
  return (
    <Link
      className="transform overflow-hidden rounded-lg border border-mainOrange bg-white transition-transform duration-300 hover:-translate-y-[3px]"
      href={`/album/${album.id}`}
    >
      <img
        src={
          album.image_hash
            ? createImgUrl(album.image_hash)
            : '/images/recordersBackground.png'
        }
        alt={album.name ?? ''}
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
