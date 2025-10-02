import { NextResponse } from 'next/server';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?';
const GOOGLE_PLACE_KEY = process.env.GOOGLE_PLACE_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      console.error('🚨 Sorgu parametresi ("q") eksik.');
      return NextResponse.json({ error: 'Sorgu parametresi ("q") eksik' }, { status: 400 });
    }

    if (!GOOGLE_PLACE_KEY) {
      console.error('🚨 GOOGLE_PLACE_KEY çevre değişkeni bulunamadı.');
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası' }, { status: 500 });
    }

    const res = await fetch(`${BASE_URL}query=${encodeURIComponent(query)}&key=${GOOGLE_PLACE_KEY}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.status !== 'OK') {
      console.error(`❌ Google Places API hatası: ${data.error_message || 'Bilinmeyen hata'}`);
      return NextResponse.json({ error: data.error_message || 'API hatası', data }, { status: 400 });
    }

    console.log(`✅ "${query}" için ${data.results.length} sonuç bulundu.`);
    return NextResponse.json({ results: data.results });
  } catch (error: any) {
    console.error(`❌ Beklenmeyen hata: ${error.message || 'Bilinmeyen hata'}`);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}