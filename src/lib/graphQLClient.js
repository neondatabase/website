import { GraphQLClient } from 'graphql-request';

export { gql } from 'graphql-request';

const requestHeaders = {
  Authorization: `Basic ${btoa(
    `${process.env.WP_HTACCESS_USERNAME}:${process.env.WP_HTACCESS_PASSWORD}`
  )}`,
};

export const graphQLClient = new GraphQLClient(process.env.WP_GRAPHQL_URL, {
  headers: requestHeaders,
});

export const graphQLClientAdmin = (authToken) =>
  new GraphQLClient(process.env.WP_GRAPHQL_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
