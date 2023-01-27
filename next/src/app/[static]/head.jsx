import SEO from 'components/shared/seo';
import { getStaticPages, getStaticPageBySlug } from 'utils/api-pages';

const Head = async ({ params }) => {
  const page = await getStaticPageBySlug(params.static);

  if (!page) return null;

  const {
    seo: { title },
  } = page;

  return <SEO title={title} />;
};

export async function generateStaticParams() {
  const payload = await getStaticPages();

  return payload.map((node) => ({
    static: node.slug,
  }));
}

export default Head;
