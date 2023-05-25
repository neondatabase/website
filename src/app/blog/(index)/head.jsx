import SEO from 'components/shared/seo';
import { BLOG_BASE_PATH } from 'constants/blog';
import SEO_DATA from 'constants/seo-data';

const Head = () => (
  <>
    <SEO {...SEO_DATA.blog} />{' '}
    <link
      rel="alternate"
      type="application/rss+xml"
      title="Blog RSS feed"
      href={`${BLOG_BASE_PATH}rss.xml`}
    />
  </>
);

export default Head;
