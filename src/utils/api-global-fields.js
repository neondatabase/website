import { cache } from 'react';

import { gql, fetchGraphQL, graphQLClient } from 'lib/graphQLClient';

const getTopbar = cache(async () => {
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
  const data = await fetchGraphQL(graphQLClient).request(topbarQuery);
  return data?.globalFields?.globalFields?.topbar;
});

export { getTopbar };
