import retry from 'async-retry';
import { GraphQLClient } from 'graphql-request';

export { gql } from 'graphql-request';

const wpGraphqlUrl = process.env.WP_GRAPHQL_URL || 'http://localhost:3000/graphql';

export const graphQLClient = new GraphQLClient(wpGraphqlUrl);

export const graphQLClientAdmin = (authToken) =>
  new GraphQLClient(wpGraphqlUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

export const fetchGraphQL = (client, retries = 3) => {
  const request = async (query, variables = {}) =>
    retry(async () => await client.request(query, variables), {
      retries,
      factor: 2,
      minTimeout: 1000,
      onRetry: (error, attempt) => {
        console.log(`Attempt ${attempt} failed. Retrying...`);
      },
    });

  return { request };
};
