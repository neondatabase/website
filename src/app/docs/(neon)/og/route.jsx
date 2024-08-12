import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const preferredRegion = 'auto';

export async function GET(request) {
  const fontTitle = fetch(
    new URL('../../../../fonts/esbuild/ESBuild-Medium.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());
  const fontText = fetch(
    new URL('../../../../fonts/inter/Inter-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());
  const logo = fetch(
    new URL('../../../../../public/images/og-image/logo.png', import.meta.url)
  ).then((res) => res.arrayBuffer());
  const background = fetch(
    new URL('../../../../../public/images/og-image/docs-background.jpg', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const [fontDataTitle, fontDataText, logoData, backgroundData] = await Promise.all([
    fontTitle,
    fontText,
    logo,
    background,
  ]);

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
      (
        <div
          style={{
            position: 'relative',
            backgroundColor: '#0A0B0D',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '44px 56px 84px',
          }}
        >
          <img
            width="1200"
            height="630"
            src={backgroundData}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
          {hasLogo && <img width="229" height="64" src={logoData} />}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 'auto',
              maxWidth: '890px',
            }}
          >
            <div
              style={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontSize: 28,
                lineHeight: 1,
                marginBottom: 18,
                letterSpacing: '0.05em',
                color: '#797D86',
                whiteSpace: 'pre-wrap',
              }}
            >
              {ogBreadcrumbs}
            </div>
            <div
              style={{
                fontFamily: 'ESBuild',
                fontStyle: 'normal',
                fontSize: 88,
                fontWeight: 500,
                lineHeight: 1,
                color: 'white',
                letterSpacing: '-0.04em',
                whiteSpace: 'pre-wrap',
                marginTop: 10,
              }}
            >
              {ogTitle}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'ESBuild',
            data: fontDataTitle,
            style: 'normal',
            weight: 500,
          },
          {
            name: 'Inter',
            data: fontDataText,
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
