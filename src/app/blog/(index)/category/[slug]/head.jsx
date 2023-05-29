import SEO from 'components/shared/seo';
import SEO_DATA, { getBlogCategoryDescription } from 'constants/seo-data';

const getCategoryName = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export default async function Head({ params: { slug } }) {
  return (
    <SEO
      {...SEO_DATA.category({
        title: getCategoryName(slug),
        description: getBlogCategoryDescription(slug),
      })}
    />
  );
}
