import Hero from 'components/pages/brand/hero';
import Logo from 'components/pages/brand/logo';
import Logomark from 'components/pages/brand/logomark';
import Spacing from 'components/pages/brand/spacing';
import Layout from 'components/shared/layout';
import getMetadata from 'utils/get-metadata';

const BrandPage = () => (
  <Layout>
    <Hero />
    <Logo />
    <Logomark />
    <Spacing />
  </Layout>
);

export const metadata = getMetadata({
  title: 'Neon Logo + Brand Guidelines',
  description: 'Download the official Neon Logo and Brand Assets.',
});

export default BrandPage;
