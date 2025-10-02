import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const placeId = searchParams.get('place_id'); // ← BURASI ÖNEMLİ: place_id
  
  if (!placeId) {
    return NextResponse.json(
      { error: 'place_id parametresi gerekli' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
                 process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key bulunamadi' },
      { status: 500 }
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,photos,formatted_address,user_ratings_total&key=${apiKey}&language=tr`;
    
    console.log('Place details cekiliyor:', placeId);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google API hatasi: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google API yanit hatasi:', data.status);
      return NextResponse.json(
        { 
          error: `Google API hatasi: ${data.status}`,
          status: data.status 
        },
        { status: 400 }
      );
    }

    console.log('Place details basariyla alindi');
    
    return NextResponse.json({
      status: 'OK',
      result: data.result
    });

  } catch (error) {
    console.error('Place details hatasi:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        status: 'ERROR'
      },
      { status: 500 }
    );
  }
}