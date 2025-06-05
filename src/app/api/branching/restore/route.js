import { NextResponse } from 'next/server';
import * as yup from 'yup';

const requestSchema = yup.object({
  branchId: yup.string().required('Branch ID is required'),
});

// eslint-disable-next-line import/prefer-default-export
export async function POST(request) {
  try {
    const body = await request.json();
    const { branchId } = await requestSchema.validate(body);

    const response = await fetch(
      `https://console.neon.tech/api/v2/projects/${process.env.NEON_BRANCHIND_DEMO_PROJECT_ID}/branches/${branchId}/restore`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.NEON_BRANCHIND_DEMO_API_KEY}`,
        },
        body: JSON.stringify({
          source_branch_id: process.env.NEON_BRANCHIND_DEMO_PARENT_ID,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to restore branch: ${errorText}`);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
