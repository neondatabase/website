import { NextResponse } from 'next/server';

import { handleInsertBranchConnection, scheduleBranchDeletion } from '../../utils';

// eslint-disable-next-line import/prefer-default-export
export async function POST() {
  try {
    const start = performance.now();
    const response = await fetch(
      `https://console.neon.tech/api/v2/projects/${process.env.NEON_BRANCHING_DEMO_PROJECT_ID}/branches`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.NEON_BRANCHING_DEMO_API_KEY}`,
        },
        body: JSON.stringify({
          endpoints: [
            {
              type: 'read_write',
              autoscaling_limit_min_cu: 1,
              autoscaling_limit_max_cu: 1,
              suspend_timeout_seconds: -1,
            },
          ],
          branch: {
            parent_id: process.env.NEON_PARENT_ID,
            name: `demos-branching-${new Date().getTime().toString()}`,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create branch: ${errorText}`);
    }

    const end = performance.now();
    const executionTime = (end - start).toFixed(2);

    const data = await response.json();
    const { branch, endpoints } = data;

    if (!branch || !endpoints || !endpoints[0]) {
      throw new Error('Invalid response from Neon API');
    }

    await handleInsertBranchConnection(branch.id, endpoints[0].host);
    await scheduleBranchDeletion(branch.id);

    return NextResponse.json({
      success: true,
      branch: {
        id: branch.id,
        name: branch.name,
      },
      executionTime,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
