/* eslint-disable react/prop-types */
import SEO from 'components/shared/seo';
import { RELEASE_NOTES_BASE_PATH } from 'constants/docs';
import SEO_DATA from 'constants/seo-data';
import { getPostBySlug, RELEASE_NOTES_DIR_PATH } from 'utils/api-docs';

const Head = ({ params }) => {
  const currentSlug = params.slug;
  const {
    data: { label },
  } = getPostBySlug(currentSlug, RELEASE_NOTES_DIR_PATH);

  return (
    <>
      <SEO
        {...SEO_DATA.releaseNotePost({
          title: `${label} release`,
        })}
      />
      <link
        rel="alternate"
        type="application/rss+xml"
        title="Release Notes RSS feed"
        href={`${RELEASE_NOTES_BASE_PATH}/rss.xml`}
      />
    </>
  );
};

export default Head;
