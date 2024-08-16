/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import clsx from 'clsx';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

import PreviewWarning from 'components/pages/blog-post/preview-warning';
import Azure from 'components/pages/landing/azure';
import Hero from 'components/pages/landing/hero';
import PricingCTA from 'components/pages/pricing/cta';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import SharedCTA from 'components/shared/cta';
import Layout from 'components/shared/layout';
import SplitViewGrid from 'components/shared/split-view-grid';
import replicasIcon from 'icons/landing/replica.svg';
import scaleIcon from 'icons/landing/scalability.svg';
import storageIcon from 'icons/landing/storage.svg';
import timerIcon from 'icons/landing/timer.svg';
import {
  getLandingPages,
  getWpPageBySlug,
  getStaticPages,
  getWpPreviewPageData,
} from 'utils/api-pages';
import { getHubspotFormData } from 'utils/forms';
import getMetadata from 'utils/get-metadata';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const icons = {
  scale: scaleIcon,
  timer: timerIcon,
  storage: storageIcon,
  replicas: replicasIcon,
};

const DynamicPage = async ({ params, searchParams }) => {
  const { isEnabled: isDraftModeEnabled } = draftMode();

  let pageResult;

  // TODO: this is a temporary fix for a known problem with accessing serachParams on the Vercel side - https://github.com/vercel/next.js/issues/54507
  await Promise.resolve(JSON.stringify(searchParams));

  if (isDraftModeEnabled) {
    pageResult = await getWpPreviewPageData(searchParams?.id, searchParams?.status);
  } else {
    pageResult = await getWpPageBySlug(params.slug);
  }

  const page = pageResult;

  if (!page) return notFound();

  const isAzurePage = params.slug === 'neon-on-azure';

  const {
    title,
    content,
    template: { templateName },
  } = page;

  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      landinghero: async ({ hubspotFormId, ...restProps }) => {
        const formData = await getHubspotFormData(hubspotFormId);
        if (isAzurePage) {
          return <Azure formData={formData} hubspotFormId={hubspotFormId} {...restProps} />;
        }
        return <Hero formData={formData} hubspotFormId={hubspotFormId} {...restProps} />;
      },
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
            className={clsx(
              'mx-auto mt-16 max-w-[1265px]',
              isAzurePage ? 'mb-14' : 'mb-32',
              'lg:my-14'
            )}
            {...restProps}
            items={items}
            size="sm"
            isGradientLabel
          />
        );
      },
      landingcta: ({ ...props }) => {
        if (isAzurePage) {
          return (
            <SharedCTA
              className="mt-[70px] py-[250px] xl:mt-14 xl:py-[184px] lg:mt-12 lg:py-[130px] md:mt-8 md:py-[105px]"
              {...props}
            />
          );
        }
        return <PricingCTA {...props} />;
      },
    },
    true
  );

  return (
    <Layout>
      {templateName === 'Landing' ? (
        contentWithLazyBlocks
      ) : (
        <article className="safe-paddings py-48 3xl:py-44 2xl:py-40 xl:py-32 lg:pb-24 lg:pt-12 md:pb-20 md:pt-6">
          <Container size="xs">
            <h1 className="t-5xl font-title font-semibold">{title}</h1>
          </Container>
          <Container size="xs">
            <Content className="prose-static mt-8 2xl:mt-7 xl:mt-6" content={content} asHTML />
          </Container>
        </article>
      )}
      {isDraftModeEnabled && <PreviewWarning />}
    </Layout>
  );
};

export async function generateViewport({ params }) {
  const page = await getWpPageBySlug(params.slug);

  if (!page) return notFound();

  const {
    template: { templateName },
  } = page;

  return {
    themeColor: templateName === 'Landing' ? '#000000' : '#ffffff',
  };
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
    imagePath: twitterImage?.mediaItemUrl,
  });
}

export const revalidate = 60;

export default DynamicPage;
