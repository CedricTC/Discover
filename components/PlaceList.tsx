'use client';

import React, { useState, useEffect } from 'react';

type Place = {
  name: string;
  address: string;
  rating: number;
  photoReference?: string;
};

const PlaceItemCard = ({ place }: { place: Place }) => {
  const [imageUrl, setImageUrl] = useState('/placeholder.jpg');

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    if (!apiKey) {
      console.error('🚨 GOOGLE API KEY not found in .env.local. Please set NEXT_PUBLIC_GOOGLE_API_KEY.');
      return;
    }

    if (!place.photoReference) {
      console.warn('ℹ️ No photoReference provided. Using placeholder image.');
      setImageUrl('/placeholder.jpg');
      return;
    }

    const baseUrl = 'https://maps.googleapis.com/maps/api/place/photo';
    const fullUrl = `${baseUrl}?maxwidth=600&photo_reference=${place.photoReference}&key=${apiKey}`;
    setImageUrl(fullUrl);
  }, [place.photoReference]);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer max-w-md">
      <div className="relative w-full h-56 sm:h-64">
        <img
          src={imageUrl}
          alt={place.name}
          className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
          style={{ height: 'auto' }} // Uyarıyı susturmak için eklenen satır
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== '/placeholder.jpg') {
              console.error('❌ Image failed to load. Fallback to placeholder.');
              target.src = '/placeholder.jpg';
            }
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl"></div>
      </div>

      <div className="p-5 space-y-2">
        <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">{place.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{place.address}</p>

        <div className="mt-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 13.347l-3.39 2.462c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.604 9.384c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.287-3.957z" />
            </svg>
            {place.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlaceItemCard;
