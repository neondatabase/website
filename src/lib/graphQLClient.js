const { GraphQLClient } = require('graphql-request');
const { gql } = require('graphql-request');

const requestHeaders = {
  Authorization: `Basic ${Buffer.from(
    `${process.env.WP_HTACCESS_USERNAME}:${process.env.WP_HTACCESS_PASSWORD}`
  ).toString('base64')}`,
};

const graphQLClient = new GraphQLClient(process.env.WP_GRAPHQL_URL, {
  headers: requestHeaders,
});

const graphQLClientAdmin = (authToken) =>
  new GraphQLClient(process.env.WP_GRAPHQL_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

module.exports = {
  gql,
  graphQLClient,
  graphQLClientAdmin,
};
