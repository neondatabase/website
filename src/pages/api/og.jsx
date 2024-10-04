import { ImageResponse } from 'next/og';

import { image1, image2, image3, image4 } from 'constants/og-images';

export const config = {
  runtime: 'edge',
};

const colorSchemeMap = {
  1: image1,
  2: image2,
  3: image3,
  4: image4,
};

export default async function handler(req) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('id');
  const handle = searchParams.get('login');
  const image = searchParams.get('image');
  const name = searchParams.get('name') !== 'null' ? searchParams.get('name') : handle;
  const color = searchParams.get('colorSchema') || '1';

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: '0',
          backgroundColor: '#080808',
        }}
      >
        <img width="100%" height="100%" src={colorSchemeMap[color]} alt="Ticket layout" />
        <div
          style={{
            position: 'absolute',
            top: '112px',
            left: '153px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              borderRadius: '100%',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <img
              width="68"
              height="68"
              src={image}
              style={{
                borderRadius: '100%',
              }}
              alt="User avatar"
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '18px',
            }}
          >
            <p
              style={{
                margin: '0',
                color: '#fff',
                fontSize: '32px',
                lineHeight: '32px',
                fontWeight: 500,
              }}
            >
              {name}
            </p>
            <p
              style={{
                margin: '0',
                color: '#fff',
                fontSize: '20px',
                lineHeight: '20px',
                marginTop: '9px',
              }}
            >
              @{handle}
            </p>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: '116px',
            right: '181px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <p
              style={{
                margin: '0',
                color: '#fff',
                fontSize: '44px',
                fontWeight: 300,
              }}
            >
              #{`${id}`.padStart(6, '0')} /
            </p>
            <p
              style={{
                margin: '0 0 0 14px',
                color: '#fff',
                fontSize: '17px',
                display: 'flex',
                flexDirection: 'column',
                textTransform: 'uppercase',
                letterSpacing: '0.01em',
                lineHeight: '1.125',
                fontFamily: 'monospace',
              }}
            >
              <span>10AM PT,</span>
              <span>Oct 30, 2024</span>
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
