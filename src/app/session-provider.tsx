'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import PropTypes from 'prop-types';

interface SessionProviderProps {
  children: ReactNode;
}

const SessionProvider = ({ children }: SessionProviderProps) => (
  <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
);

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SessionProvider;
