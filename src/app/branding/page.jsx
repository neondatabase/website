import Hero from 'components/pages/branding/hero';
import Logos from 'components/pages/branding/logos';
import Layout from 'components/shared/layout';
import getMetadata from 'utils/get-metadata';

const BrandingPage = () => (
  <Layout>
    <Hero />
    <Logos />
  </Layout>
);

export const metadata = getMetadata({
  title: "Neon's Branding Guidelines",
  description: "Learn about Neon's branding guidelines",
});

export default BrandingPage;
