import { neon } from '@neondatabase/serverless';

const toRows = (rows, key) =>
  rows.map((row) => ({
    weekStart: row.week_start,
    key: row[key],
    share: Number(row.user_share_pct),
  }));

async function readMcpStats(sql) {
  const [clients, tools, access, surfaces, customerSize, published] = await Promise.all([
    sql`
      SELECT week_start::text AS week_start, client, user_share_pct
      FROM public_stats.mcp_client_users_weekly
      ORDER BY week_start, client
    `,
    sql`
      SELECT week_start::text AS week_start, tool, user_share_pct
      FROM public_stats.mcp_tool_users_weekly
      ORDER BY week_start, tool
    `,
    sql`
      SELECT dimension, value, user_share_pct,
             window_start::text AS window_start, window_end::text AS window_end
      FROM public_stats.mcp_access_users
    `,
    sql`
      SELECT agent, surface, account_share_pct,
             window_start::text AS window_start, window_end::text AS window_end
      FROM public_stats.agent_surfaces
    `,
    sql`
      SELECT band, surface, account_share_pct,
             window_start::text AS window_start, window_end::text AS window_end
      FROM public_stats.customer_size_surfaces
    `,
    sql`SELECT max(published_at) AS published_at FROM public_stats.mcp_client_users_weekly`,
  ]);
  if (clients.length === 0) throw new Error('public_stats.mcp_client_users_weekly is empty');
  if (tools.length === 0) throw new Error('public_stats.mcp_tool_users_weekly is empty');
  if (access.length === 0) throw new Error('public_stats.mcp_access_users is empty');
  if (surfaces.length === 0) throw new Error('public_stats.agent_surfaces is empty');
  if (customerSize.length === 0) throw new Error('public_stats.customer_size_surfaces is empty');

  return {
    clients: toRows(clients, 'client'),
    tools: toRows(tools, 'tool'),
    access: {
      windowStart: access[0].window_start,
      windowEnd: access[0].window_end,
      rows: access.map((row) => ({
        dimension: row.dimension,
        value: row.value,
        share: Number(row.user_share_pct),
      })),
    },
    surfaces: {
      windowStart: surfaces[0].window_start,
      windowEnd: surfaces[0].window_end,
      rows: surfaces.map((row) => ({
        agent: row.agent,
        surface: row.surface,
        share: Number(row.account_share_pct),
      })),
    },
    customerSize: {
      windowStart: customerSize[0].window_start,
      windowEnd: customerSize[0].window_end,
      rows: customerSize.map((row) => ({
        band: row.band,
        surface: row.surface,
        share: Number(row.account_share_pct),
      })),
    },
    publishedAt: new Date(published[0].published_at).toISOString(),
  };
}

// Returns null outside Production when the database is unset, so the page answers 404.
export async function getMcpStats() {
  const url = process.env.STATS_DATABASE_URL;
  if (!url) {
    if (process.env.VERCEL_ENV === 'production') throw new Error('STATS_DATABASE_URL is not set');
    return null;
  }

  try {
    return await readMcpStats(neon(url));
  } catch (error) {
    // The driver repeats the connection string, password included, when it can't parse it.
    throw new Error(String(error.message).replaceAll(url, '[STATS_DATABASE_URL]'));
  }
}
