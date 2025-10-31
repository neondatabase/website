import { gql, GraphQLClient } from 'graphql-request';

const getAuthToken = async () => {
  const authQuery = gql`
    mutation RefreshAuthToken($refreshToken: String!) {
      refreshJwtAuthToken(input: { clientMutationId: "uniqueId", jwtRefreshToken: $refreshToken }) {
        authToken
      }
    }
  `;

  // Use POST for mutations instead of GET
  const authClient = new GraphQLClient(process.env.WP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': process.env.WP_GRAPHQL_USER_AGENT,
    },
  });

  return authClient.request(authQuery, { refreshToken: process.env.WP_GRAPHQL_AUTH_TOKEN });
};

export default getAuthToken;
