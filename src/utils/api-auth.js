import { gql, graphQLClient } from 'lib/graphQLClient';

const getAuthToken = async () => {
  const authQuery = gql`
    mutation RefreshAuthToken($refreshToken: String!) {
      refreshJwtAuthToken(input: { clientMutationId: "uniqueId", jwtRefreshToken: $refreshToken }) {
        authToken
      }
    }
  `;

  return graphQLClient.request(authQuery, { refreshToken: process.env.WP_GRAPHQL_AUTH_TOKEN });
};

export default getAuthToken;
