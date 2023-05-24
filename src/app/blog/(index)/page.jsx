import AppearanceEngineering from 'components/pages/blog/appearance-engineering';
import FeaturedPostsList from 'components/pages/blog/featured-posts-list';
import PostsList from 'components/pages/blog/posts-list';
import ReleaseNotesList from 'components/pages/blog/release-notes-list';
import VideoList from 'components/pages/blog/video-list';
import SubscribeForm from 'components/pages/blog-post/subscribe-form';
import { getAllReleaseNotes } from 'utils/api-docs';
import { getWpBlogPage } from 'utils/api-posts';

export default async function BlogPage() {
  const releaseNotes = await getAllReleaseNotes();
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
      <FeaturedPostsList posts={featuredPosts} />
      <PostsList title="Community" posts={communityFeaturedPosts} alignment="right" />
      <ReleaseNotesList items={featuredReleaseNotes} />
      <PostsList title="Company" posts={companyFeaturedPosts} alignment="left" />
      <SubscribeForm
        className="-mx-4 rounded-xl bg-black-new p-[70px] 2xl:px-10 2xl:pb-16 2xl:pt-10 md:px-8"
        size="md"
      />
      <VideoList videos={videos} />
      <AppearanceEngineering
        appearancesPosts={appearances}
        engineeringPosts={engineeringFeaturedPosts}
      />
    </>
  );
}

export const revalidate = 60;
