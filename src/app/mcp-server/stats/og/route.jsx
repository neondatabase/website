import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { buildClientShares } from 'components/pages/mcp-server-stats/share-series';
import { formatWeekRange } from 'components/pages/mcp-server-stats/weeks';
import { getMcpStats } from 'utils/api-mcp-stats';

export const revalidate = 3600;

const TOP_AGENTS = 5;

const assets = Promise.all([
  readFile(join(process.cwd(), 'src', 'fonts', 'geist-mono', 'GeistMono-Regular.ttf')),
  readFile(join(process.cwd(), 'src', 'fonts', 'inter', 'Inter-Regular.ttf')),
  readFile(join(process.cwd(), 'public', 'images', 'og-image', 'logo.png')),
]);

const toDataUri = (buffer, contentType) =>
  `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`;

export async function GET() {
  const stats = await getMcpStats();
  if (!stats) return new Response('Not found', { status: 404 });

  const { latestWeek, ranked } = buildClientShares(stats.clients);
  const agents = ranked.filter(({ isGrouped }) => !isGrouped).slice(0, TOP_AGENTS);
  const leaderShare = agents[0].share;
  const [fontDataMono, fontDataInter, logoBuffer] = await assets;

  return new ImageResponse(
    <div
      style={{
        backgroundColor: '#0A0B0D',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '56px 64px 56px',
      }}
    >
      <img width={171} height={48} src={toDataUri(logoBuffer, 'image/png')} alt="" />

      <div
        style={{
          marginTop: 44,
          fontFamily: 'Inter',
          fontSize: 64,
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
          color: 'white',
        }}
      >
        Neon MCP Stats
      </div>
      <div style={{ marginTop: 14, fontFamily: 'Inter', fontSize: 28, color: '#94979E' }}>
        {`Top agents by share of weekly active users, ${formatWeekRange(latestWeek)}`}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 'auto' }}>
        {agents.map(({ key, label, color, share }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div
              style={{
                display: 'flex',
                width: 240,
                flexShrink: 0,
                fontFamily: 'Inter',
                fontSize: 28,
                color: 'white',
              }}
            >
              {label}
            </div>
            <div
              style={{
                display: 'flex',
                flexGrow: 1,
                flexShrink: 1,
                height: 16,
                backgroundColor: '#1C1D1F',
              }}
            >
              <div
                style={{
                  width: `${(share / leaderShare) * 100}%`,
                  height: '100%',
                  backgroundColor: color,
                }}
              />
            </div>
            <div
              style={{
                width: 120,
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'flex-end',
                fontFamily: 'Geist Mono',
                fontSize: 28,
                color: 'white',
              }}
            >
              {`${share.toFixed(1)}%`}
            </div>
          </div>
        ))}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Geist Mono', data: fontDataMono, style: 'normal', weight: 400 },
        { name: 'Inter', data: fontDataInter, style: 'normal', weight: 400 },
      ],
    }
  );
}
