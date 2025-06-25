import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import * as yup from 'yup';

import { composeConnectionString, getBranchConnectionString } from '../utils';

const requestSchema = yup.object({
  branchId: yup.string().required('Branch ID is required'),
});

// eslint-disable-next-line import/prefer-default-export
export async function POST(request) {
  try {
    const body = await request.json();
    const { branchId } = await requestSchema.validate(body);

    const isMainBranch = !branchId || branchId === 'main';

    const connectionString = isMainBranch
      ? composeConnectionString(process.env.NEON_BRANCHING_DEMO_DB_PGHOST_DEFAULT)
      : await getBranchConnectionString(branchId);

    const sql = neon(connectionString);
    const [result] = await sql`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
      FROM pg_database
      WHERE datname = current_database()
    `;

    if (!result?.size) {
      throw new Error('Failed to get database size');
    }

    return NextResponse.json({ success: true, size: result.size });
  } catch (error) {
    const status = error.name === 'ValidationError' ? 400 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
