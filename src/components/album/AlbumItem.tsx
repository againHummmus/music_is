import React from 'react';
import { createImgUrl } from '../shared/utils/createUrlFromHash';

export default function AlbumCard ({ album }: {album: any}) {

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
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
    </div>
  );
};

