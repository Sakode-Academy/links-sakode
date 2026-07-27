import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sakode Academy - Masa Depan Digital, Dimulai Dari Sini';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
          padding: '40px 60px',
        }}
      >
        {/* Border Grid Background Frame */}
        <div
          style={{
            position: 'absolute',
            inset: 20,
            border: '2px solid #27272a',
            borderRadius: 32,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            background: '#121215',
          }}
        >
          {/* Header Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 20px',
              borderRadius: 50,
              background: '#18181b',
              border: '1px solid #27272a',
              color: '#10b981',
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#10b981',
              }}
            />
            Official Link Hub • link.sakode.com
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            Sakode Academy
          </div>

          {/* Subtitle / Tagline */}
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: '#34d399',
              textAlign: 'center',
              maxWidth: 750,
              lineHeight: 1.4,
              marginBottom: 40,
            }}
          >
            Masa Depan Digital, Dimulai Dari Sini
          </div>

          {/* Links Pills Showcase */}
          <div
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 14,
                background: '#18181b',
                border: '1px solid #27272a',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              WhatsApp Official
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 14,
                background: '#18181b',
                border: '1px solid #27272a',
                color: '#f472b6',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Instagram @sakodeacademy
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 14,
                background: '#18181b',
                border: '1px solid #27272a',
                color: '#22d3ee',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Website Portal v2.0
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 14,
                background: '#18181b',
                border: '1px solid #27272a',
                color: '#38bdf8',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              TikTok Content
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
