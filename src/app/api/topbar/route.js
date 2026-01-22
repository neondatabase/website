import { NextResponse } from 'next/server';

import { gql, graphQLClient } from 'lib/graphQLClient';

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  const topbarQuery = gql`
    query GlobalFields {
      globalFields {
        globalFields {
          topbar {
            text
            link {
              title
              target
              url
            }
          }
        }
      }
    }
  `;

  try {
    const data = await graphQLClient.request(topbarQuery);
    const topbarData = data?.globalFields?.globalFields?.topbar || { text: '', link: null };
    const response = NextResponse.json(topbarData, { status: 200 });
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch topbar data', error);
    return NextResponse.json({ error: 'Failed to fetch topbar data' }, { status: 500 });
  }
}
