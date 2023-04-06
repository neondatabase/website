/* eslint-disable react/prop-types */
import SEO from 'components/shared/seo';
import { RELEASE_NOTES_SLUG_REGEX } from 'constants/docs';
import SEO_DATA from 'constants/seo-data';
import { getPostBySlug, RELEASE_NOTES_DIR_PATH } from 'utils/api-docs';

const Head = ({ params: { slug } }) => {
  let label = '';
  const currentSlug = slug.join('/');
  const isReleaseNotePage = RELEASE_NOTES_SLUG_REGEX.test(currentSlug);

  if (isReleaseNotePage) {
    label = getPostBySlug(currentSlug, RELEASE_NOTES_DIR_PATH)?.data?.label;
  }

  return (
    <SEO
      {...SEO_DATA.releaseNotePost({
        title: isReleaseNotePage ? `${label} release` : 'Release notes',
      })}
    />
  );
};

export default Head;
