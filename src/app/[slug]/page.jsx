/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';
import * as yup from 'yup';

import Hero from 'components/pages/landing/hero';
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
import { getHubspotFormData } from 'utils/forms';
import getMetadata from 'utils/get-metadata';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const icons = {
  scale: scaleIcon,
  timer: timerIcon,
  storage: storageIcon,
  replicas: replicasIcon,
};

const getFormData = async ({ hubspotFormId, successMessage }) => {
  const formData = {};
  formData.hubspotFormId = hubspotFormId;
  formData.successMessage = successMessage;

  const data = await getHubspotFormData(hubspotFormId);
  if (!data) return formData;

  formData.data = data;
  const { formFieldGroups } = data;
  const yupObject = {};

  formFieldGroups.forEach((group) => {
    group.fields.forEach((field) => {
      if (field.required) {
        if (field.name === 'email') {
          yupObject[field.name] = yup
            .string()
            .email('Please enter a valid email')
            .required('Email address is a required field');
        } else {
          yupObject[field.name] = yup.string().required('Please complete this required field.');
        }
      }
    });
  });
  formData.yupSchema = yup.object(yupObject).required();

  if (formFieldGroups.length === 1) {
    formData.isSimpleMode = true;
    formData.simpleField = formFieldGroups[0].fields[0];
  } else {
    formData.isSimpleMode = false;
    formData.formFieldGroups = formFieldGroups;
  }
  formData.buttonText = data.submitText;

  return formData;
};

const DynamicPage = async ({ params }) => {
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
      landinghero: async ({ hubspotFormId, successMessage, ...restProps }) => {
        const formData = await getFormData(hubspotFormId, successMessage);

        return <Hero formData={formData} {...restProps} />;
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
      headerTheme={templateName === 'Landing' ? 'black-pure' : 'white'}
      footerTheme={templateName === 'Landing' ? 'black-pure' : ''}
    >
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
    </Layout>
  );
};

export async function generateViewport({ params }) {
  const page = await getWpPageBySlug(params.slug);

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
    imagePath: twitterImage.mediaItemUrl,
  });
}

export const revalidate = 60;

export default DynamicPage;
