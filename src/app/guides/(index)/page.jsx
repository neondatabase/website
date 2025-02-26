/* eslint-disable react/prop-types */

import GuideCard from 'components/pages/guides/guide-card';
import { GUIDES_BASE_PATH } from 'constants/guides';
import { getAllGuides } from 'utils/api-guides';
import getMetadata from 'utils/get-metadata';

export async function generateMetadata() {
  // TO-DO: Update real data here
  return getMetadata({
    title: 'Neon guides',
    // description: '',
    // type: '',
    rssPathname: `${GUIDES_BASE_PATH}rss.xml`,
  });
}

const GuidesPage = async () => {
  const posts = await getAllGuides();

  // TO-DO: Update text here
  if (!posts) return <div className="w-full text-center text-lg">No guides yet</div>;

  return (
    <div className="guides">
      {posts.map((post) => (
        <GuideCard key={post.slug} {...post} />
      ))}
    </div>
  );
};

export default GuidesPage;
