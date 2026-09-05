import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

export async function GET(request) {
  const [fontDataBreadcrumbs, fontDataTitle, logoBuffer, backgroundBuffer] = await Promise.all([
    readFile(join(process.cwd(), 'src', 'fonts', 'geist-mono', 'GeistMono-Regular.ttf')),
    readFile(join(process.cwd(), 'src', 'fonts', 'inter', 'Inter-Regular.ttf')),
    readFile(join(process.cwd(), 'public', 'images', 'og-image', 'logo.png')),
    readFile(join(process.cwd(), 'public', 'images', 'og-image', 'docs-background.jpg')),
  ]);

  const logoData = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  const backgroundData = `data:image/jpeg;base64,${backgroundBuffer.toString('base64')}`;

  try {
    const { searchParams } = request.nextUrl;

    const hasLogo = searchParams.get('show-logo') !== 'false';

    const hasTitle = searchParams.has('title');
    const title = searchParams.get('title');
    const ogTitle = hasTitle && Buffer.from(title, 'base64').toString('utf-8');

    const hasBreadcrumb = searchParams.has('breadcrumb');
    const breadcrumb = searchParams.get('breadcrumb');
    const hasCategory = searchParams.has('category');
    const category = searchParams.get('category');
    const ogCategory = hasCategory && Buffer.from(category, 'base64').toString('utf-8');
    const ogBreadcrumbs = hasBreadcrumb
      ? Buffer.from(breadcrumb, 'base64').toString('utf-8')
      : hasCategory && `Docs${ogCategory ? ` / ${ogCategory}` : ''}`;

    return new ImageResponse(
      <div
        style={{
          position: 'relative',
          backgroundColor: '#0A0B0D',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 80px 80px 48px',
        }}
      >
        <img
          width={1200}
          height={630}
          src={backgroundData}
          style={{ position: 'absolute', top: 0, left: 0 }}
          alt=""
        />
        {hasLogo && <img width={199} height={56} src={logoData} alt="" />}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'auto',
            maxWidth: '720px',
          }}
        >
          <div
            style={{
              fontFamily: 'Geist Mono',
              fontStyle: 'normal',
              fontSize: 24,
              lineHeight: 1,
              marginBottom: 24,
              letterSpacing: '0.02em',
              color: '#797D86',
            }}
          >
            {ogBreadcrumbs}
          </div>
          <div
            style={{
              display: '-webkit-box',
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: 80,
              lineHeight: 1.125,
              letterSpacing: '-0.04em',
              color: 'white',
              textWrap: 'pretty',
            }}
          >
            {ogTitle}
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Geist Mono',
            data: fontDataBreadcrumbs,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Inter',
            data: fontDataTitle,
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
