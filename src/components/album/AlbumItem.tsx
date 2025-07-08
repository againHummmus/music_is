import React from 'react';
import { createImgUrl } from '../shared/utils/createUrlFromHash';
import Link from 'next/link';

export default function AlbumCard ({ album }: {album: any}) {

  return (
    <Link className="bg-white rounded-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-[3px] border border-mainOrange" href={`/album/${album.id}`}>
      <img 
        src={createImgUrl(album.image_hash)} 
        alt={album.name} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">{album.name}</h3>
        {/* {album.artistName && (
          <p className="text-sm text-gray-600 mb-2 truncate">{album.artistName}</p>
        )} */}
        <p className="text-sm text-gray-500">{album.year}</p>
      </div>
    </Link>
  );
};

