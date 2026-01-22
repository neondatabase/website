import { neon } from '@neondatabase/serverless';
import { Client } from '@upstash/qstash';

export const composeConnectionString = (host) =>
  `postgresql://${process.env.NEON_BRANCHING_DEMO_DB_PGUSER}:${process.env.NEON_BRANCHING_DEMO_DB_PGPASSWORD}@${host}/${process.env.NEON_BRANCHING_DEMO_DB_PGDATABASE}?sslmode=require`;

export const getBranchConnectionString = async (branchId) => {
  const sql = neon(composeConnectionString(process.env.NEON_BRANCHING_DEMO_DB_PGHOST_DEFAULT));
  const [branch] = await sql`
    SELECT connection_string 
    FROM branches 
    WHERE branch_name = ${branchId}
    LIMIT 1
  `;

  if (!branch) {
    throw new Error('Branch not found');
  }

  return composeConnectionString(branch.connection_string);
};

export const handleInsertBranchConnection = async (branchId, host) => {
  try {
    const sql = neon(composeConnectionString(process.env.NEON_BRANCHING_DEMO_DB_PGHOST_DEFAULT));
    await sql`
      INSERT INTO branches (branch_name, connection_string)
      VALUES (${branchId}, ${host})
    `;
  } catch (error) {
    console.error(`[Database] Failed to store branch connection: ${error.message}`);
  }
};

export const scheduleBranchDeletion = async (branchId) => {
  const qstash = new Client({
    token: process.env.NEON_BRANCHING_DEMO_QSTASH_TOKEN,
  });

  try {
    const baseUrl =
      process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

    await qstash.publishJSON({
      url: new URL('/api/branching/branch/delete', baseUrl).toString(),
      body: {
        branchId,
        retries: 0,
      },
      delay: 3600, // 1 hour in seconds
    });
  } catch (error) {
    console.error(`[QStash] Failed to schedule deletion for branch ${branchId}:`, error);
  }
};
