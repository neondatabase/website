import { ImageResponse } from 'next/server';

export const runtime = 'edge';

const fontMedium = fetch(new URL('./assets/ibm-plex-sans-medium.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer()
);

const fontNormal = fetch(new URL('./assets/ibm-plex-sans-regular.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer()
);

const logo = fetch(new URL('./assets/logo.png', import.meta.url)).then((res) => res.arrayBuffer());

const background = fetch(new URL('./assets/background.png', import.meta.url)).then((res) =>
  res.arrayBuffer()
);

const GET = async (request) => {
  const fontDataMedium = await fontMedium;
  const fontDataNormal = await fontNormal;

  const logoData = await logo;
  const backgroundData = await background;
  try {
    const { searchParams } = new URL(request.url);

    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'Serverless, Fault-Tolerant, Branchable Postgres';

    return new ImageResponse(
      (
        <div
          style={{
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
            width="1200"
            height="630"
            src={backgroundData}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
          <img width="229" height="64" src={logoData} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 'auto',
            }}
          >
            <div
              style={{
                fontSize: 100,
                fontStyle: 'normal',
                fontFamily: '"IBM Plex Sans"',
                fontWeight: 500,
                color: 'white',
                lineHeight: 1.125,
                letterSpacing: '-0.04em',
                whiteSpace: 'pre-wrap',
                maxWidth: '90%',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 30,
                fontFamily: '"IBM Plex Sans"',
                fontStyle: 'normal',
                lineHeight: 1.25,
                marginTop: 28,
                letterSpacing: '-0.04em',
                color: '#C9CBCF',
                whiteSpace: 'pre-wrap',
              }}
            >
              neon.tech
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'IBM Plex Sans',
            data: fontDataMedium,
            style: 'normal',
            weight: 500,
          },
          {
            name: 'IBM Plex Sans',
            data: fontDataNormal,
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
};

export default GET;
