'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import PropTypes from 'prop-types';

const SessionProvider = ({ children }) => (
  <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
);

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SessionProvider;
