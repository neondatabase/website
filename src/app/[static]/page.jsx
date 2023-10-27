import { notFound } from 'next/navigation';

import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import { getStaticPageBySlug, getStaticPages } from 'utils/api-pages';
import getMetadata from 'utils/get-metadata';

export default async function StaticPage({ params }) {
  const page = await getStaticPageBySlug(params.static);

  if (!page) return notFound();

  const { title, content } = page;

  return (
    <Layout headerTheme="white" footerWithTopBorder>
      <article className="safe-paddings py-48 3xl:py-44 2xl:py-40 xl:py-32 lg:pb-24 lg:pt-12 md:pb-20 md:pt-6">
        <Container size="xs">
          <h1 className="t-5xl font-semibold">{title}</h1>
        </Container>
        <Container size="xs">
          <Content className="mt-8 2xl:mt-7 xl:mt-6 prose-static" content={content} asHTML />
        </Container>
      </article>
    </Layout>
  );
}

export async function generateStaticParams() {
  const payload = await getStaticPages();

  return payload.map((node) => ({
    static: node.slug,
  }));
}

export async function generateMetadata({ params }) {
  const page = await getStaticPageBySlug(params.static);

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
    pathname: `/${params.static}`,
    imagePath: twitterImage.mediaItemUrl,
  });
}

export const revalidate = 60;
