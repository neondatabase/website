import { neon } from '@neondatabase/serverless';

export async function getFunctionTemplateInstalls(templateId) {
  const url = process.env.STATS_DATABASE_URL;
  if (!url) {
    // Contributors run the site without the stats database; every Vercel environment has it.
    if (process.env.VERCEL) throw new Error('STATS_DATABASE_URL is not set');
    return [];
  }
  // The driver's parse error repeats the whole connection string, password included.
  if (!URL.canParse(url)) throw new Error('STATS_DATABASE_URL is not a valid URL');

  const sql = neon(url);
  const rows = await sql`
    SELECT week_start::text AS week_start, installs
    FROM public_stats.function_template_installs_weekly
    WHERE template = ${templateId}
    ORDER BY week_start
  `;
  return rows.map((row) => ({ weekStart: row.week_start, installs: Number(row.installs) }));
}
