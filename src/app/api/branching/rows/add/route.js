import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { generateUsername } from 'unique-username-generator';
import * as yup from 'yup';

import { getBranchConnectionString } from '../../utils';

const requestSchema = yup.object({
  branchId: yup.string().required('Branch ID is required'),
});

// eslint-disable-next-line import/prefer-default-export
export async function POST(request) {
  try {
    const body = await request.json();
    const { branchId } = await requestSchema.validate(body);

    const connectionString = await getBranchConnectionString(branchId);
    const sql = neon(connectionString);
    const [newRow] = await sql`
      INSERT INTO playing_with_neon (id, singer, song) 
      VALUES (${Math.floor(Math.random() * 90000) + 50000}, ${generateUsername()}, 'new-song-name')
      RETURNING *
    `;

    if (!newRow) {
      throw new Error('Failed to generate unique ID');
    }

    return NextResponse.json({ success: true, newRow });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
