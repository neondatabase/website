import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';

const Head = () => (
  <>
    <SEO {...SEO_DATA.pricing} />
    <link
      rel="preload"
      crossOrigin="anonymous"
      href="/animations/pages/pricing/pricing.riv"
      as="fetch"
      media="(min-width: 1024px)"
    />
  </>
);

export default Head;
