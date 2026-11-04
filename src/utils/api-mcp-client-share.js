import { neon } from '@neondatabase/serverless';

// The table holds weekly percentages only, written by a daily job. The role in
// PUBLIC_STATS_DATABASE_URL can only SELECT this one table.
export async function getMcpClientShare() {
  const url = process.env.PUBLIC_STATS_DATABASE_URL;
  if (!url) throw new Error('PUBLIC_STATS_DATABASE_URL is not set');

  const sql = neon(url);
  const rows = await sql`
    SELECT week_start::text AS week_start, client, session_share_pct
    FROM public_stats.mcp_client_share_weekly
    ORDER BY week_start, client
  `;
  if (rows.length === 0) throw new Error('public_stats.mcp_client_share_weekly is empty');

  return rows.map((row) => ({
    weekStart: row.week_start,
    client: row.client,
    share: Number(row.session_share_pct),
  }));
}
