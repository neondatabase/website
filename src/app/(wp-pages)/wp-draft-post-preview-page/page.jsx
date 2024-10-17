/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import PreviewWarning from 'components/pages/blog-post/preview-warning';
import Hero from 'components/pages/landing/hero';
import CTA from 'components/pages/pricing/cta';
import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import SplitViewGrid from 'components/shared/split-view-grid';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import benefitsCommunityIcon from 'icons/landing/benefits/community.svg';
import benefitsGrowthIcon from 'icons/landing/benefits/growth.svg';
import benefitsPerksIcon from 'icons/landing/benefits/perks.svg';
import featuresReplicasIcon from 'icons/landing/features/replica.svg';
import featuresScaleIcon from 'icons/landing/features/scalability.svg';
import featuresStorageIcon from 'icons/landing/features/storage.svg';
import featuresTimerIcon from 'icons/landing/features/timer.svg';
import { getWpPreviewPageData } from 'utils/api-pages';
import { getHubspotFormData } from 'utils/forms';
import getMetadata from 'utils/get-metadata';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const icons = {
  features: {
    scale: featuresScaleIcon,
    timer: featuresTimerIcon,
    storage: featuresStorageIcon,
    replicas: featuresReplicasIcon,
  },
  benefits: {
    growth: benefitsGrowthIcon,
    perks: benefitsPerksIcon,
    community: benefitsCommunityIcon,
  },
};

/*
  NOTE:
  This page is only needed to show previews for the drafts.
  Its code is identical to the wp-pages page template, except for the data fetching.
  If you need to change something here, сhange it first in the wp-pages page
  and then copy the changes here.
*/
/*
  WARNING:
  You can't have a page in Wordpress with the "wp-draft-post-preview-page" slug. Please be careful.
*/
const WpPageDraft = async ({ searchParams }) => {
  // TODO: this is a temporary fix for a known problem with accessing serachParams on the Vercel side - https://github.com/vercel/next.js/issues/54507
  await Promise.resolve(JSON.stringify(searchParams));

  if (!searchParams?.id || !searchParams?.status) {
    return notFound();
  }

  const page = await getWpPreviewPageData(searchParams?.id, searchParams?.status);

  if (!page) return notFound();

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
        return <Hero formData={formData} hubspotFormId={hubspotFormId} {...restProps} />;
      },
      landingfeatures: ({ features, ...restProps }) => {
        const items = features.map((feature) => {
          const icon = icons.features[feature.iconName];
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
      landingbenefits: ({ benefits, ...restProps }) => {
        const items = benefits.map((benefit) => {
          const icon = icons.benefits[benefit.iconName];
          return {
            ...benefits,
            icon,
          };
        });

        return <Benefits items={items} {...restProps} />;
      },
      landingcta: CTA,
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
      <PreviewWarning />
    </Layout>
  );
};

export async function generateMetadata() {
  const { title, description, imagePath } = SEO_DATA.blog;

  return getMetadata({
    title,
    description,
    keywords: '',
    robotsNoindex: 'noindex',
    pathname: `${LINKS.blog}/wp-draft-post-preview-page`,
    imagePath,
  });
}

export default WpPageDraft;
