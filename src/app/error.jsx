'use client';

import PropTypes from 'prop-types';
import { useEffect } from 'react';

import Hero from 'components/pages/error/hero';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';

/* 
  NOTE: 
  This page is needed to handle unexpected errors and display fallback UI.
*/
const ErrorPage = ({ error, reset }) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <>
      <title>{SEO_DATA.error.title}</title>

      <Layout isClient>
        <Hero
          title="Page is broken..."
          text="Sorry, the page you are looking for is broken. Please try again later, we'll fix it soon!"
          reset={reset}
        />
      </Layout>
    </>
  );
};

ErrorPage.propTypes = {
  error: PropTypes.object,
  reset: PropTypes.func,
};

export default ErrorPage;
