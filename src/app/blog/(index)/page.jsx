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
  const { featuredPosts, companyFeaturedPosts, communityFeaturedPosts, videos } =
    await getWpBlogPage();

  return (
    <div className="col-span-8 col-start-3 -mx-[30px] grid gap-y-20">
      <FeaturedPostsList posts={featuredPosts} />
      <PostsList title="Community" posts={communityFeaturedPosts} alignment="right" />
      <ReleaseNotesList items={featuredReleaseNotes} />
      <PostsList title="Company" posts={companyFeaturedPosts} alignment="left" />
      <SubscribeForm className="rounded-xl bg-black-new p-[70px]" />
      <VideoList videos={videos} />
    </div>
  );
}

export const revalidate = 60;
