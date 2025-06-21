import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import * as yup from 'yup';

import { getBranchConnectionString } from '../../utils';

const requestSchema = yup.object({
  rowIds: yup.array().of(yup.number()).min(1, 'At least one row ID is required').required(),
  branchId: yup.string().required('Branch ID is required'),
});

// eslint-disable-next-line import/prefer-default-export
export async function POST(request) {
  try {
    const body = await request.json();
    const { rowIds, branchId } = await requestSchema.validate(body);

    const connectionString = await getBranchConnectionString(branchId);
    const sql = neon(connectionString);

    const MAX_ROWS_TO_DELETE = 100;
    const limitedRowIds = rowIds.slice(0, MAX_ROWS_TO_DELETE);

    const start = performance.now();
    await sql`DELETE FROM playing_with_neon WHERE id = ANY(${limitedRowIds})`;
    const end = performance.now();
    const executionTime = (end - start).toFixed(2);

    return NextResponse.json({
      success: true,
      deletedCount: limitedRowIds.length,
      totalRequested: rowIds.length,
      limited: rowIds.length > MAX_ROWS_TO_DELETE,
      executionTime,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
