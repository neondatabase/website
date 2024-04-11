import { notFound } from 'next/navigation';

import CTA from 'components/pages/about/cta';
import Team from 'components/pages/about/team';
import Layout from 'components/shared/layout';
import { getAboutPage } from 'utils/api-pages';
import getMetadata from 'utils/get-metadata';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

export default async function StaticPage() {
  const page = await getAboutPage();

  if (!page) return notFound();

  const { content } = page;

  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      aboutusteam: Team,
      aboutuscta: CTA,
    },
    true
  );

  return <Layout headerTheme="white">{contentWithLazyBlocks}</Layout>;
}

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
