import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs';
import { NextResponse } from 'next/server';
import * as yup from 'yup';

const requestSchema = yup.object({
  branchId: yup.string().required('Branch ID is required'),
});

// eslint-disable-next-line import/prefer-default-export
async function handler(request) {
  try {
    const body = await request.json();
    const { branchId } = await requestSchema.validate(body);

    const response = await fetch(
      `https://console.neon.tech/api/v2/projects/${process.env.NEON_BRANCHING_DEMO_PROJECT_ID}/branches/${branchId}`,
      {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.NEON_BRANCHING_DEMO_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete branch: ${errorText}`);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('[Branch Deletion] Error:', error);

    if (error instanceof yup.ValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message,
            code: 'VALIDATION_ERROR',
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
      { status: 500 }
    );
  }
}

export const POST = verifySignatureAppRouter(handler);
