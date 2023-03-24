/* eslint-disable react/prop-types */
import SEO from 'components/shared/seo';
import { RELEASE_NOTES_BASE_PATH } from 'constants/docs';
import SEO_DATA from 'constants/seo-data';
import { DOCS_DIR_PATH, getPostBySlug } from 'utils/api-docs';

const Head = ({ params }) => {
  const currentSlug = params.slug.join('/');

  if (!getPostBySlug(currentSlug, DOCS_DIR_PATH)) return;

  const {
    data: { title, ogImage },
    excerpt,
  } = getPostBySlug(currentSlug, DOCS_DIR_PATH);
  const isReleaseNotes = currentSlug === 'release-notes';

  return (
    <>
      <SEO {...SEO_DATA.doc({ title, description: excerpt })} ogImage={ogImage} />
      {isReleaseNotes && (
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Release Notes RSS feed"
          href={`${RELEASE_NOTES_BASE_PATH}rss.xml`}
        />
      )}
    </>
  );
};

export default Head;
