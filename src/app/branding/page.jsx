import Hero from 'components/pages/branding/hero';
import Layout from 'components/shared/layout';
import getMetadata from 'utils/get-metadata';

const BrandingPage = () => (
  <Layout>
    <Hero />
  </Layout>
);

export const metadata = getMetadata({
  title: "Neon's Branding Guidelines",
  description: "Learn about Neon's branding guidelines",
});

export default BrandingPage;
