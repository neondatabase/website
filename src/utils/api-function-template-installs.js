import { neon } from '@neondatabase/serverless';

export async function getFunctionTemplateInstalls(templateId) {
  const url = process.env.STATS_DATABASE_URL;
  if (!url) {
    // Contributors run the site without the stats database; every Vercel environment has it.
    if (process.env.VERCEL) throw new Error('STATS_DATABASE_URL is not set');
    return [];
  }

  const sql = neon(url);
  let rows;
  try {
    rows = await sql`
      SELECT week_start::text AS week_start, installs
      FROM public_stats.function_template_installs_weekly
      WHERE template = ${templateId}
      ORDER BY week_start
    `;
  } catch (error) {
    // The driver repeats the connection string, password included, when it can't parse it.
    throw new Error(String(error.message).replaceAll(url, '[STATS_DATABASE_URL]'));
  }
  return rows.map((row) => ({ weekStart: row.week_start, installs: Number(row.installs) }));
}
