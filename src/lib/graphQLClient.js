import retry from 'async-retry';
import { GraphQLClient } from 'graphql-request';

export { gql } from 'graphql-request';

export const graphQLClient = new GraphQLClient(process.env.WP_GRAPHQL_URL);

export const graphQLClientAdmin = (authToken) =>
  new GraphQLClient(process.env.WP_GRAPHQL_URL, {
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
