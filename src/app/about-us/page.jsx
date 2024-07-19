import { notFound } from 'next/navigation';

import ForDevelopers from 'components/pages/about/for-developers';
import Hero from 'components/pages/about/hero';
import Investors from 'components/pages/about/investors';
import Leadership from 'components/pages/about/leadership';
import OpenSource from 'components/pages/about/open-source';
import Timeline from 'components/pages/about/timeline';
import Cta from 'components/shared/cta';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import { getAboutPage } from 'utils/api-pages';
import getMetadata from 'utils/get-metadata';

const AboutUsPage = () => (
  <Layout>
    <Hero />
    <Timeline />
    <ForDevelopers />
    <OpenSource />
    <Leadership />
    <Investors />
    <Cta
      title="Become a part of our team"
      description="We're looking for people who care deeply about quality to build it with us."
      buttonText="View Open Roles"
      buttonUrl={LINKS.careers}
      buttonClassName="mt-9 h-12 w-[174px] lg:h-11 lg:mt-8 lg:w-[166px] md:mt-3.5 md:h-10 md:w-[151px] md:text-sm"
    />
  </Layout>
);

export async function generateMetadata() {
  const page = await getAboutPage();

  if (!page) return notFound();

  const {
    seo: {
      title,
      metaDesc,
      metaKeywords,
      metaRobotsNoindex,
      opengraphTitle,
      opengraphDescription,
      twitterImage,
    },
  } = page;

  return getMetadata({
    title: opengraphTitle || title,
    description: opengraphDescription || metaDesc,
    keywords: metaKeywords,
    robotsNoindex: metaRobotsNoindex,
    pathname: '/about-us',
    imagePath: twitterImage?.mediaItemUrl,
  });
}

export const revalidate = 60;

export default AboutUsPage;
