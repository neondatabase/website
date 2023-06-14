import AppearanceEngineering from 'components/pages/blog/appearance-engineering';
import FeaturedPostsList from 'components/pages/blog/featured-posts-list';
import PostsList from 'components/pages/blog/posts-list';
import ReleaseNotesList from 'components/pages/blog/release-notes-list';
import VideoList from 'components/pages/blog/video-list';
import SubscribeForm from 'components/pages/blog-post/subscribe-form';
import { BLOG_BASE_PATH } from 'constants/blog';
import SEO_DATA from 'constants/seo-data';
import { getWpBlogPage } from 'utils/api-posts';
import getMetadata from 'utils/get-metadata';

async function getReleaseNotesData() {
  const res = await fetch(process.env.NEXT_PUBLIC_RELEASE_NOTES_API_URL);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export const metadata = getMetadata({ ...SEO_DATA.blog, rssPathname: `${BLOG_BASE_PATH}rss.xml` });

export default async function BlogPage() {
  const releaseNotes = await getReleaseNotesData();
  const featuredReleaseNotes = releaseNotes.slice(0, 4);
  const {
    featuredPosts,
    companyFeaturedPosts,
    communityFeaturedPosts,
    videos,
    appearances,
    engineeringFeaturedPosts,
  } = await getWpBlogPage();

  return (
    <>
      <h1 className="sr-only">Blog</h1>
      <FeaturedPostsList posts={featuredPosts} />
      <PostsList title="Community" posts={communityFeaturedPosts} alignment="right" />
      <ReleaseNotesList items={featuredReleaseNotes} />
      <PostsList title="Company" posts={companyFeaturedPosts} alignment="left" />
      <VideoList videos={videos} />
      <SubscribeForm size="md" />
      <AppearanceEngineering
        appearancesPosts={appearances}
        engineeringPosts={engineeringFeaturedPosts}
      />
    </>
  );
}

export const revalidate = 60;
