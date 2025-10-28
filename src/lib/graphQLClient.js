import retry from 'async-retry';
import { GraphQLClient } from 'graphql-request';

export { gql } from 'graphql-request';

// Create a base client for regular queries using GET
export const graphQLClient = new GraphQLClient(process.env.WP_GRAPHQL_URL, {
  method: 'GET', // Use GET for regular queries
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Neon-Next.js/1.0 (Vercel)',
  },
});

// Keep POST for admin operations that need to modify data
export const graphQLClientAdmin = (authToken) =>
  new GraphQLClient(process.env.WP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'User-Agent': 'Neon-Next.js/1.0 (Vercel Admin)',
    },
  });

// Add caching to the fetch function
export const fetchGraphQL = (client, retries = 1) => {
  const request = async (query, variables = {}) =>
    retry(async () => await client.request(query, variables), {
      retries,
      factor: 2,
      minTimeout: 2000,
      onRetry: (error, attempt) => {
        console.log(`Attempt ${attempt} failed. Retrying...`);
      },
    });

  return { request };
};
