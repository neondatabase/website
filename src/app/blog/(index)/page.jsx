import AppearanceEngineering from 'components/pages/blog/appearance-engineering';
import ChangelogList from 'components/pages/blog/changelog-list';
import FeaturedPostsList from 'components/pages/blog/featured-posts-list';
import PostsList from 'components/pages/blog/posts-list';
import VideoList from 'components/pages/blog/video-list';
import SubscribeForm from 'components/pages/blog-post/subscribe-form';
import { BLOG_BASE_PATH } from 'constants/blog';
import SEO_DATA from 'constants/seo-data';
import { getWpBlogPage } from 'utils/api-posts';
import getMetadata from 'utils/get-metadata';

async function getChangelogData() {
  const res = await fetch(process.env.NEXT_PUBLIC_RELEASE_NOTES_API_URL);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export const metadata = getMetadata({ ...SEO_DATA.blog, rssPathname: `${BLOG_BASE_PATH}rss.xml` });

const BlogPage = async () => {
  const changelogPosts = await getChangelogData();
  const featuredChangelogPosts = changelogPosts.slice(0, 4);
  const {
    featuredPosts,
    workflowsFeaturedPosts,
    companyFeaturedPosts,
    communityFeaturedPosts,
    videos,
    appearances,
    engineeringFeaturedPosts,
    aiFeaturedPosts,
    postgresFeaturedPosts,
  } = await getWpBlogPage();

  return (
    <>
      <h1 className="sr-only">Blog</h1>
      <FeaturedPostsList posts={featuredPosts} />
      <PostsList title="Workflows" posts={workflowsFeaturedPosts} alignment="right" />
      <PostsList title="Community" posts={communityFeaturedPosts} alignment="left" />
      <PostsList title="Postgres" posts={postgresFeaturedPosts} alignment="right" />
      <VideoList videos={videos} />
      <PostsList title="AI" posts={aiFeaturedPosts} alignment="right" />
      <PostsList title="Company" posts={companyFeaturedPosts} alignment="left" />
      <ChangelogList items={featuredChangelogPosts} />
      <SubscribeForm size="md" dataTest="blog-subscribe-form" />
      <AppearanceEngineering
        appearancesPosts={appearances}
        engineeringPosts={engineeringFeaturedPosts}
      />
    </>
  );
};

export const revalidate = 60;

export default BlogPage;
