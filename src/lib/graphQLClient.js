import { GraphQLClient } from 'graphql-request';

export { gql } from 'graphql-request';

export const graphQLClient = new GraphQLClient(process.env.WP_GRAPHQL_URL);

export const graphQLClientAdmin = (authToken) =>
  new GraphQLClient(process.env.WP_GRAPHQL_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
