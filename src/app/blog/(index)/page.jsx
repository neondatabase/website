import FeaturedPostsList from 'components/pages/blog/featured-posts-list';
import PostsList from 'components/pages/blog/posts-list';
import ReleaseNotesList from 'components/pages/blog/release-notes-list';
import SubscribeForm from 'components/pages/blog-post/subscribe-form';
import { getAllReleaseNotes } from 'utils/api-docs';
import { getAllWpPosts } from 'utils/api-posts';

export default async function BlogPage() {
  const nodes = await getAllWpPosts();
  const releaseNotes = await getAllReleaseNotes();
  const featuredPosts = nodes.slice(0, 5);
  const featuredReleaseNotes = releaseNotes.slice(0, 4);

  return (
    <div className="col-span-8 col-start-3 -mx-[30px] grid gap-y-20">
      <FeaturedPostsList posts={featuredPosts} />
      <PostsList title="Community" posts={nodes} alignment="right" />
      <ReleaseNotesList items={featuredReleaseNotes} />
      <PostsList title="Company" posts={nodes} alignment="left" />
      <SubscribeForm className="rounded-xl bg-black-new p-[70px]" />
    </div>
  );
}

export const revalidate = 60;
