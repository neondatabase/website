import { neon } from '@neondatabase/serverless';

async function queryStats(query) {
  const url = process.env.STATS_DATABASE_URL;
  if (!url) {
    // Contributors run the site without the stats database; every Vercel environment has it.
    if (process.env.VERCEL) throw new Error('STATS_DATABASE_URL is not set');
    return [];
  }

  try {
    return await query(neon(url));
  } catch (error) {
    // The driver repeats the connection string, password included, when it can't parse it.
    throw new Error(String(error.message).replaceAll(url, '[STATS_DATABASE_URL]'));
  }
}

export async function getFunctionTemplateInstalls(templateId) {
  const rows = await queryStats(
    (sql) => sql`
      SELECT week_start::text AS week_start, installs
      FROM public_stats.function_template_installs_weekly
      WHERE template = ${templateId}
      ORDER BY week_start
    `
  );
  return rows.map((row) => ({ weekStart: row.week_start, installs: Number(row.installs) }));
}

export async function getFunctionTemplateInstallTotals() {
  const rows = await queryStats(
    (sql) => sql`
      SELECT template, sum(installs) AS installs, min(week_start)::text AS since
      FROM public_stats.function_template_installs_weekly
      GROUP BY template
    `
  );
  return new Map(
    rows.map((row) => [row.template, { installs: Number(row.installs), since: row.since }])
  );
}
