import { notFound } from 'next/navigation';

import Hero from 'components/pages/landing/hero';
import SubscribeForm from 'components/pages/landing/subscribe-form';
import CTA from 'components/pages/pricing/cta';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import SplitViewGrid from 'components/shared/split-view-grid';
import replicasIcon from 'icons/landing/replica.svg';
import scaleIcon from 'icons/landing/scalability.svg';
import storageIcon from 'icons/landing/storage.svg';
import timerIcon from 'icons/landing/timer.svg';
import { getLandingPages, getWpPageBySlug, getStaticPages } from 'utils/api-pages';
import getMetadata from 'utils/get-metadata';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const icons = {
  scale: scaleIcon,
  timer: timerIcon,
  storage: storageIcon,
  replicas: replicasIcon,
};

export default async function DynamicPage({ params }) {
  const page = await getWpPageBySlug(params.slug);

  if (!page) return notFound();

  const {
    title,
    content,
    template: { templateName },
  } = page;

  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      landinghero: Hero,
      landingform: SubscribeForm,
      landingfeatures: ({ features, ...restProps }) => {
        const items = features.map((feature) => {
          const icon = icons[feature.iconName];
          return {
            ...feature,
            icon,
          };
        });

        return (
          <SplitViewGrid
            className="mx-auto mb-32 mt-16 max-w-[1265px] lg:my-14"
            {...restProps}
            items={items}
            size="sm"
            isGradientLabel
          />
        );
      },
      landingcta: CTA,
    },
    true
  );

  return (
    <Layout
      className={templateName === 'Landing' ? 'bg-black-new text-white' : ''}
      headerTheme={templateName === 'Landing' ? 'black-new' : 'white'}
      footerTheme={templateName === 'Landing' ? 'black-new' : ''}
      footerWithTopBorder
    >
      {templateName === 'Landing' ? (
        contentWithLazyBlocks
      ) : (
        <article className="safe-paddings py-48 3xl:py-44 2xl:py-40 xl:py-32 lg:pb-24 lg:pt-12 md:pb-20 md:pt-6">
          <Container size="xs">
            <h1 className="t-5xl font-semibold">{title}</h1>
          </Container>
          <Container size="xs">
            <Content className="prose-static mt-8 2xl:mt-7 xl:mt-6" content={content} asHTML />
          </Container>
        </article>
      )}
    </Layout>
  );
}

export async function generateStaticParams() {
  const staticPages = await getStaticPages();
  const landingPages = await getLandingPages();

  return [...staticPages, ...landingPages].map((node) => ({
    slug: node.slug,
  }));
}

export async function generateMetadata({ params }) {
  const page = await getWpPageBySlug(params.slug);

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
    pathname: `/${params.slug}`,
    imagePath: twitterImage.mediaItemUrl,
  });
}

export const revalidate = 60;
