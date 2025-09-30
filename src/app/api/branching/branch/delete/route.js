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

// Only use QStash verification if the environment variable is available
const POST = (() => {
  if (process.env.QSTASH_CURRENT_SIGNING_KEY) {
    try {
      // Dynamic import to avoid build-time errors when QStash is not configured
      // eslint-disable-next-line import/no-unresolved
      const { verifySignatureAppRouter } = require('@upstash/qstash/dist/nextjs');
      return verifySignatureAppRouter(handler);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('QStash not available, using handler directly:', error.message);
      return handler;
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn('QStash not configured, skipping signature verification for branch deletion');
    return handler;
  }
})();

export { POST };
