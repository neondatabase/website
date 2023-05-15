/* eslint-disable react/prop-types */
import SEO from 'components/shared/seo';
import { RELEASE_NOTES_SLUG_REGEX } from 'constants/docs';
import SEO_DATA from 'constants/seo-data';
import getReleaseNotesCategoryFromSlug from 'utils/get-release-notes-category-from-slug';

const Head = ({ params: { slug } }) => {
  let label = '';
  const currentSlug = slug.join('/');
  const isReleaseNotePage = RELEASE_NOTES_SLUG_REGEX.test(currentSlug);

  if (isReleaseNotePage) {
    const { capitalisedCategory } = getReleaseNotesCategoryFromSlug(currentSlug);
    label = capitalisedCategory;
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
