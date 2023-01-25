import { notFound } from 'next/navigation';

import Container from 'components/shared/container';
import Content from 'components/shared/content';
import Layout from 'components/shared/layout';
import { getStaticPageBySlug, getStaticPages } from 'utils/api-pages';

export default async function StaticPage({ params }) {
  const page = await getStaticPageBySlug(params.static);

  if (!page) return notFound();

  const { title, content } = page;

  return (
    <Layout headerTheme="white" footerWithTopBorder>
      <article className="safe-paddings py-48 3xl:py-44 2xl:py-40 xl:py-32 lg:pt-12 lg:pb-24 md:pt-6 md:pb-20">
        <Container size="xs">
          <h1 className="t-5xl font-semibold">{title}</h1>
        </Container>
        <Container size="xs">
          <Content className="mt-8 2xl:mt-7 xl:mt-6" content={content} asHTML />
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

export const revalidate = 60;
