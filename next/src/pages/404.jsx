import Head from 'next/head';

import 'styles/globals.css';

import Hero from 'components/pages/404/hero';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const GlobalNotFoundPage = () => (
  <>
    <Head>
      <SEO {...SEO_DATA[404]} />
    </Head>
    <Layout headerTheme="white" footerWithTopBorder>
      <Hero />
    </Layout>
  </>
);

export default GlobalNotFoundPage;
