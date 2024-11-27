'use client';

import PropTypes from 'prop-types';
import { useEffect } from 'react';

import Hero from 'components/pages/error/hero';
import Footer from 'components/shared/footer';
import Topbar from 'components/shared/topbar';
import SEO_DATA from 'constants/seo-data';

const ErrorPage = ({ error }) => {
  useEffect(() => {
    console.log(error.message);
  }, [error]);

  return (
    <>
      <title>{SEO_DATA.error.title}</title>
      {/* <p>Error: {error.message || 'Something went wrong'}</p> */}
      <Topbar />
      <div className="relative flex min-h-[calc(100vh-36px)] flex-col pt-safe">
        <main className="flex flex-1 flex-col">
          <Hero
            title="Page is broken..."
            text="Sorry, the page you are looking for is broken. Please try again later, we'll fix it soon!"
          />
        </main>
        <Footer />
      </div>
    </>
  );
};

ErrorPage.propTypes = {
  error: PropTypes.object,
};

export default ErrorPage;
