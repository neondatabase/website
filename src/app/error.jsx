'use client';

import Hero from 'components/pages/error/hero';
import Footer from 'components/shared/footer';
import Topbar from 'components/shared/topbar';
import SEO_DATA from 'constants/seo-data';

const ErrorPage = () => (
  <>
    <title>{SEO_DATA.error.title}</title>
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

export default ErrorPage;
