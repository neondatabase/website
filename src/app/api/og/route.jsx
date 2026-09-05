import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

export async function GET(request) {
  const [fontDataEsbuild, fontDataInter, logoBuffer, backgroundBuffer] = await Promise.all([
    readFile(join(process.cwd(), 'src', 'fonts', 'esbuild', 'ESBuild-Medium.ttf')),
    readFile(join(process.cwd(), 'src', 'fonts', 'inter', 'Inter-Regular.ttf')),
    readFile(join(process.cwd(), 'public', 'images', 'og-image', 'logo.png')),
    readFile(join(process.cwd(), 'public', 'images', 'og-image', 'background.png')),
  ]);

  const logoData = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  const backgroundData = `data:image/png;base64,${backgroundBuffer.toString('base64')}`;

  try {
    const { searchParams } = request.nextUrl;
    const title = searchParams.get('title');
    const hasTitle = searchParams.has('title');
    const ogTitle = hasTitle && Buffer.from(title, 'base64').toString('utf-8');
    return new ImageResponse(
      <div
        style={{
          fontFamily: '"IBM Plex Sans"',
          fontStyle: 'normal',
          position: 'relative',
          backgroundColor: '#0A0B0D',
          backgroundSize: '150px 150px',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '44px 56px 56px',
        }}
      >
        <img
          width={1200}
          height={630}
          src={backgroundData}
          style={{ position: 'absolute', top: 0, left: 0 }}
          alt=""
        />
        <img width={235} height={64} src={logoData} alt="" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'auto',
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontFamily: 'ESBuild',
              fontWeight: 500,
              color: 'white',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              whiteSpace: 'pre-wrap',
              maxWidth: '90%',
              marginTop: 10,
            }}
          >
            {ogTitle}
          </div>
          <div
            style={{
              fontFamily: 'Inter',
              fontSize: 30,
              lineHeight: 1.25,
              marginTop: 28,
              letterSpacing: '-0.04em',
              color: '#C9CBCF',
              whiteSpace: 'pre-wrap',
            }}
          >
            neon.com
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'ESBuild',
            data: fontDataEsbuild,
            style: 'normal',
            weight: 500,
          },
          {
            name: 'Inter',
            data: fontDataInter,
            style: 'normal',
            weight: 400,
          },
        ],
      }
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
