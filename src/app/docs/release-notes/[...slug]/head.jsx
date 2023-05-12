/* eslint-disable react/prop-types */
import SEO from 'components/shared/seo';
import { RELEASE_NOTES_SLUG_REGEX } from 'constants/docs';
import SEO_DATA from 'constants/seo-data';

const Head = ({ params: { slug } }) => {
  let label = '';
  const currentSlug = slug.join('/');
  const isReleaseNotePage = RELEASE_NOTES_SLUG_REGEX.test(currentSlug);

  if (isReleaseNotePage) {
    const note = currentSlug.match(/(\w+)$/)?.[1];
    // Uppercase the first letter of the note
    label = note.charAt(0).toUpperCase() + note.slice(1);
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
