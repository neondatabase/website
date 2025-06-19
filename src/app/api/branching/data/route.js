import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import * as yup from 'yup';

import { composeConnectionString, getBranchConnectionString } from '../utils';

const requestSchema = yup.object({
  branchId: yup.string().optional(),
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
    const start = performance.now();
    const rows = await sql`SELECT * FROM playing_with_neon ORDER BY id DESC LIMIT 5;`;
    const end = performance.now();
    const executionTime = (end - start).toFixed(2);

    const response = NextResponse.json({
      success: true,
      branch: isMainBranch ? 'main' : branchId,
      data: rows,
      executionTime,
    });

    response.headers.set('Cache-Control', 'private, max-age=0, no-cache');

    return response;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
