import Connections from 'components/pages/about/connections';
import Developers from 'components/pages/about/developers';
import Hero from 'components/pages/about/hero';
import Leadership from 'components/pages/about/leadership';
import Timeline from 'components/pages/about/timeline';
import WhereHeaded from 'components/pages/about/where-headed';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.aboutUs);

const AboutUsPage = () => (
  <Layout>
    <Hero />
    <Timeline />
    <WhereHeaded />
    <Leadership />
    <Developers />
    <Connections />
    <CTANew
      title="Become a part of our&nbsp;team"
      description="We're looking for people who care deeply about quality to build with us."
      buttonText="View Open Roles"
      buttonUrl={LINKS.careers}
    />
  </Layout>
);

export default AboutUsPage;
