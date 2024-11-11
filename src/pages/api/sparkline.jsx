import { ImageResponse } from 'next/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = req.nextUrl;
  const series = searchParams.get('series')?.split(',') || [1, 1];
  const w = searchParams.get('w') || 140;
  const h = searchParams.get('h') || 32;
  const normalizer = Math.max(...series);

  const fade = 10;
  let alpha = 1;
  const paths = [];
  for (let i = 0; i < fade; i++) {
    paths.push(
      <path
        key={i}
        stroke={`rgba(0,191,131,${alpha})`}
        strokeWidth={i === 0 ? 1 : 2}
        d={series.reduce((acc, v, k) => (
            `${acc 
            }${k == 0 ? 'M' : 'L'}${k * (w / (series.length - 1))} ${h + i * 2 - (v / normalizer) * h} `
          ), '')}
      />
    );
    alpha = i === 0 ? 0.25 : alpha / 1.25;
  }

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: '0',
          backgroundColor: 'transparent',
        }}
      >
        <svg stroke="red" fill="none" viewBox="0 0 320 80">
          {paths}
        </svg>
      </div>
    ),
    {
      width: w,
      height: h,
    }
  );
}
