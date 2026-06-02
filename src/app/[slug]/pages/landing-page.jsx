/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import Benefits from 'components/pages/landing/benefits';
import Hero from 'components/pages/landing/hero';
import CTAGasStation from 'components/shared/cta-gas-station';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import SplitViewGrid from 'components/shared/split-view-grid';
import { TEMPLATE_PAGES_DIR_PATH } from 'constants/content';
import benefitsCommunityIcon from 'icons/landing/benefits/community.svg';
import benefitsGrowthIcon from 'icons/landing/benefits/growth.svg';
import benefitsPerksIcon from 'icons/landing/benefits/perks.svg';
import featuresReplicasIcon from 'icons/landing/features/replica.svg';
import featuresScaleIcon from 'icons/landing/features/scalability.svg';
import featuresStorageIcon from 'icons/landing/features/storage.svg';
import featuresTimerIcon from 'icons/landing/features/timer.svg';
import { getPostBySlug } from 'utils/api-content';
import { cn } from 'utils/cn';
import { getHubspotFormData } from 'utils/forms';
import getMetadata from 'utils/get-metadata';

const featureIcons = {
  scale: featuresScaleIcon,
  timer: featuresTimerIcon,
  storage: featuresStorageIcon,
  replicas: featuresReplicasIcon,
};

const benefitIcons = {
  growth: benefitsGrowthIcon,
  perks: benefitsPerksIcon,
  community: benefitsCommunityIcon,
};

const LandingHero = async ({ hubspotFormId, ...restProps }) => {
  const formData = hubspotFormId ? await getHubspotFormData(hubspotFormId) : null;
  return <Hero formData={formData} hubspotFormId={hubspotFormId} {...restProps} />;
};

const LandingFormCopy = async ({ hubspotFormId, ...restProps }) => {
  const formData = hubspotFormId ? await getHubspotFormData(hubspotFormId) : null;
  return (
    <Hero theme="form-copy" formData={formData} hubspotFormId={hubspotFormId} {...restProps} />
  );
};

const LandingFeatures = ({ features = [], ...restProps }) => {
  const items = features.map((f) => ({ ...f, icon: featureIcons[f.iconName] }));
  return (
    <SplitViewGrid
      className={cn('mx-auto mt-16 mb-32 max-w-[1265px]', 'lg:my-14')}
      {...restProps}
      items={items}
      size="sm"
      isGradientLabel
    />
  );
};

const LandingBenefits = ({ benefits = [], ...restProps }) => {
  const items = benefits.map((b) => ({ ...b, icon: benefitIcons[b.iconName] }));
  return <Benefits items={items} {...restProps} />;
};

const LandingCta = (props) => <CTAGasStation {...props} />;

const LandingCtaNew = (props) => (
  <CTANew
    className="mt-[70px] py-[250px] xl:mt-14 xl:py-[184px] lg:mt-12 lg:py-[130px] md:mt-8 md:py-[105px]"
    copyWrapperClassName="xl:max-w-[704px] lg:max-w-lg md:max-w-md"
    {...props}
  />
);

const mdxComponents = {
  LandingHero,
  LandingFormCopy,
  LandingFeatures,
  LandingBenefits,
  LandingCta,
  LandingCtaNew,
};

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug, TEMPLATE_PAGES_DIR_PATH);
  if (!post) return null;

  const { data } = post;
  const seo = data.seo || {};

  return getMetadata({
    title: seo.opengraphTitle || seo.title || data.title,
    description: seo.opengraphDescription || seo.metaDesc,
    keywords: seo.metaKeywords,
    robotsNoindex: seo.metaRobotsNoindex,
    pathname: `/${slug}`,
    imagePath: seo.twitterImage || undefined,
  });
}

const LandingPage = ({ params }) => {
  const { slug } = params;
  const post = getPostBySlug(slug, TEMPLATE_PAGES_DIR_PATH);
  if (!post) return notFound();

  const { content } = post;

  return (
    <Layout>
      <MDXRemote source={content} components={mdxComponents} />
    </Layout>
  );
};

export default LandingPage;
