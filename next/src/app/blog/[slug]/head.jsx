import SEO from 'components/shared/seo';
import { getWpPostBySlug } from 'utils/api-posts';

const Head = async ({ params }) => {
  const { post } = await getWpPostBySlug(params?.slug);

  if (!post) return null;

  const {
    seo: { title, opengraphDescription, twitterImage },
  } = post;

  return (
    <SEO title={title} description={opengraphDescription} imagePath={twitterImage?.mediaItemUrl} />
  );
};

export default Head;
