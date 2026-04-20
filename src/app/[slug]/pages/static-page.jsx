/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import { TEMPLATE_PAGES_DIR_PATH } from 'constants/content';
import { getPostBySlug } from 'utils/api-content';
import getMetadata from 'utils/get-metadata';

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

const StaticPage = ({ params }) => {
  const { slug } = params;
  const post = getPostBySlug(slug, TEMPLATE_PAGES_DIR_PATH);
  if (!post) return notFound();

  const { data, content } = post;

  return (
    <Layout>
      <article className="py-48 safe-paddings 3xl:py-44 2xl:py-40 xl:py-32 lg:pt-12 lg:pb-24 md:pt-6 md:pb-20">
        <Container size="xs">
          <h1 className="t-5xl font-title leading-normal font-semibold">{data.title}</h1>
        </Container>
        <Container size="xs">
          <Content className="prose-static mt-8 2xl:mt-7 xl:mt-6" content={content} />
        </Container>
      </article>
    </Layout>
  );
};

export default StaticPage;
