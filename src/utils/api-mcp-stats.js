import { neon } from '@neondatabase/serverless';

const toRows = (rows, key) =>
  rows.map((row) => ({
    weekStart: row.week_start,
    key: row[key],
    share: Number(row.user_share_pct),
  }));

export async function getMcpStats() {
  const url = process.env.STATS_DATABASE_URL;
  if (!url) throw new Error('STATS_DATABASE_URL is not set');

  const sql = neon(url);
  const [clients, tools, published] = await Promise.all([
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
    sql`SELECT max(published_at) AS published_at FROM public_stats.mcp_client_users_weekly`,
  ]);
  if (clients.length === 0) throw new Error('public_stats.mcp_client_users_weekly is empty');
  if (tools.length === 0) throw new Error('public_stats.mcp_tool_users_weekly is empty');

  return {
    clients: toRows(clients, 'client'),
    tools: toRows(tools, 'tool'),
    publishedAt: new Date(published[0].published_at).toISOString(),
  };
}
