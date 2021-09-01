import React from 'react';
import '../styles/globals.css'
import '../styles/bootstrap_custom.scss';

import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
export default MyApp
