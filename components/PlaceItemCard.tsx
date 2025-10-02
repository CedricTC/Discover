'use client';

import React, { useState } from 'react';

type Review = {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url?: string;
  relative_time_description: string;
};

type PlaceDetails = {
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: Review[];
};

type Place = {
  name: string;
  address: string;
  rating: number;
  photoReference?: string;
  place_id?: string;
};

const PlaceItemCard = ({ place }: { place: Place & { place_id?: string } }) => {
  const [imageUrl, setImageUrl] = useState<string>('/placeholder.jpg');
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
                   process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    if (!apiKey) {
      console.error('🚨 Google API Key bulunamadı!');
      return;
    }

    if (!place.photoReference) {
      setImageUrl('/placeholder.jpg');
      return;
    }

    setImageLoading(true);
    setImageError(false);
    
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/photo';
    const fullUrl = `${baseUrl}?maxwidth=600&photo_reference=${place.photoReference}&key=${apiKey}`;
    
    const img = new Image();
    img.onload = () => {
      setImageLoading(false);
      setImageUrl(fullUrl);
    };
    img.onerror = () => {
      setImageLoading(false);
      setImageError(true);
      setImageUrl('/placeholder.jpg');
    };
    img.src = fullUrl;
  }, [place.photoReference]);

  const fetchReviews = async () => {
    if (!place.place_id) {
      alert('Bu yer için place_id bulunamadı');
      return;
    }

    setReviewsLoading(true);
    setShowReviews(true);

    try {
      const response = await fetch(`/api/place-details?placeId=${place.place_id}`);
      
      if (!response.ok) {
        throw new Error('Yorumlar alınamadı');
      }

      const data = await response.json();
      
      if (data.success && data.result) {
        setPlaceDetails(data.result);
        setReviews(data.result.reviews || []);
        console.log('✅ Yorumlar başarıyla alındı:', data.result.reviews?.length || 0);
      } else {
        throw new Error(data.error || 'Veri alınamadı');
      }
    } catch (error) {
      console.error('❌ Yorum alma hatası:', error);
      alert('Yorumlar yüklenemedi: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== '/placeholder.jpg') {
      setImageError(true);
      target.src = '/placeholder.jpg';
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 13.347l-3.39 2.462c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.604 9.384c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.287-3.957z" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <div className="relative">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 13.347l-3.39 2.462c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.604 9.384c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.287-3.957z" />
            </svg>
            <svg className="w-4 h-4 text-yellow-400 absolute inset-0" fill="currentColor" viewBox="0 0 20 20" style={{ clipPath: 'inset(0 50% 0 0)' }}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 13.347l-3.39 2.462c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.604 9.384c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.287-3.957z" />
            </svg>
          </div>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 13.347l-3.39 2.462c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.604 9.384c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.287-3.957z" />
          </svg>
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400 bg-green-900/30';
    if (rating >= 4.0) return 'text-green-500 bg-green-900/20';
    if (rating >= 3.5) return 'text-yellow-400 bg-yellow-900/20';
    if (rating >= 3.0) return 'text-orange-400 bg-orange-900/20';
    return 'text-red-400 bg-red-900/20';
  };

  return (
    <>
      <div className="group bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer w-full max-w-none border border-gray-700/50 backdrop-blur-sm flex flex-col h-[480px]">
        <div className="relative w-full h-100 overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <img
            src={imageUrl}
            alt={place.name}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              imageError ? 'opacity-50' : 'opacity-100'
            }`}
            onError={handleImageError}
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute top-4 right-4">
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md border border-white/20 ${getRatingColor(place.rating)}`}>
              <svg className="w-4 h-4 mr-1.5 text-current" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 13.347l-3.39 2.462c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L3.604 9.384c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.287-3.957z" />
              </svg>
              {place.rating.toFixed(1)}
            </div>
          </div>

          {imageError && (
            <div className="absolute top-4 left-4">
              <div className="inline-flex items-center px-2 py-1 rounded-md bg-red-900/50 text-red-400 text-xs backdrop-blur-sm">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Resim yok
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4 flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
              {place.name}
            </h3>
            
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 flex-1">
                {place.address}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {renderStars(place.rating)}
              <span className="text-gray-400 text-sm font-medium">
                ({place.rating.toFixed(1)})
              </span>
            </div>
          </div>

          {/* Yorumları Gör Butonu */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchReviews();
            }}
            disabled={reviewsLoading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {reviewsLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Yükleniyor...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Yorumları Gör</span>
              </>
            )}
          </button>
        </div>

        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>

      {/* Yorumlar Modal */}
      {showReviews && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReviews(false)}>
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
              <div>
                <h2 className="text-2xl font-bold text-white">{place.name}</h2>
                {placeDetails && (
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(placeDetails.rating)}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {placeDetails.rating.toFixed(1)} - {placeDetails.user_ratings_total} değerlendirme
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowReviews(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Reviews List */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-400 text-lg">Henüz yorum bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition-all">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.profile_photo_url || '/placeholder.jpg'}
                          alt={review.author_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold">{review.author_name}</h4>
                            <span className="text-gray-400 text-sm">{review.relative_time_description}</span>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            {renderStars(review.rating)}
                            <span className="text-yellow-400 text-sm font-medium">{review.rating}.0</span>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceItemCard;