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
import { getGithubStars, getGithubContributors } from 'utils/get-github-data';
import getMetadata from 'utils/get-metadata';

const AboutUsPage = async () => {
  const [gitHubStars, gitHubContributors] = await Promise.all([
    getGithubStars(),
    getGithubContributors(),
  ]);

  const statistics = [
    {
      number: !gitHubStars ? 13 : Math.floor(gitHubStars / 1000),
      isThousands: true,
      label: 'Stars on GitHub',
    },
    {
      number: !gitHubContributors ? 111 : gitHubContributors,
      label: 'Contributors',
    },
    {
      number: '3000',
      hasPlus: true,
      label: 'Databases created daily',
    },
  ];

  return (
    <Layout>
      <Hero />
      <Timeline />
      <ForDevelopers />
      <OpenSource items={statistics} />
      <Leadership />
      <Investors />
      <Cta
        title="Become a part of our&nbsp;team"
        description="We're looking for people who care deeply about quality to build with us."
        buttonText="View Open Roles"
        buttonUrl={LINKS.careers}
        buttonClassName="mt-9 h-12 w-[174px] xl:mt-[18px] lg:h-11 lg:mt-4 lg:w-[166px] md:mt-5 md:h-10 md:w-[151px] md:text-sm"
      />
    </Layout>
  );
};

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
