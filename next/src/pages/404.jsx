import Head from 'next/head';

import 'styles/globals.css';

import SEO from 'components/shared/seo';
import Layout from 'components/shared/layout';
import Hero from 'components/pages/404/hero';
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
