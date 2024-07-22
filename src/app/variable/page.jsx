import Budget from 'components/pages/variable/budget';
import Efficiency from 'components/pages/variable/efficiency';
import Hero from 'components/pages/variable/hero';
import Load from 'components/pages/variable/load';
import Unique from 'components/pages/variable/unique';
import Cta from 'components/shared/get-started';
import Layout from 'components/shared/layout';
import ViewedArticles from 'components/shared/viewed-articles';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.variable);

const VariablePage = () => (
  <Layout>
    <Hero />
    <Load />
    <Efficiency />
    <Budget />
    <Unique />
    <ViewedArticles />
    <Cta
      title="Try it yourself"
      description="You can experiment with autoscaling for free during 14 days"
      button={{
        title: 'Request a Scale trial',
        url: LINKS.scaleTrial,
      }}
      size="sm"
    />
  </Layout>
);

export default VariablePage;
