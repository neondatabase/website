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
    // Return empty data instead of 500 error to allow page to render
    return NextResponse.json({ text: '', link: null }, { status: 200 });
  }
}
