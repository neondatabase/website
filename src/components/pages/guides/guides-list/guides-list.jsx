import { PropTypes } from 'prop-types';

import GuideCard from 'components/pages/guides/guide-card';

const FEATURED_COUNT = 3;

const GuidesList = ({ posts }) => {
  const featuredPosts = posts.slice(0, FEATURED_COUNT);
  const otherPosts = posts.slice(FEATURED_COUNT);

  return (
    <div className="guides">
      <section className="mb-16 lg:mb-14 md:mb-6">
        <h2 className="sr-only">Latest guides</h2>
        <ul className="grid grid-cols-3 gap-6 lg:gap-5 md:grid-cols-1 md:gap-4">
          {featuredPosts.map((post) => (
            <li key={post.slug}>
              <GuideCard {...post} isFeatured />
            </li>
          ))}
        </ul>
      </section>
      {otherPosts.length > 0 && (
        <section>
          <h2 className="sr-only">More guides</h2>
          <ul className="grid grid-cols-3 gap-6 lg:grid-cols-2 lg:gap-5 md:grid-cols-1 md:gap-0">
            {otherPosts.map((post) => (
              <li
                className="md:border-b md:border-gray-new-15/20 md:last:border-b-0 dark:md:border-gray-new-15/80"
                key={post.slug}
              >
                <GuideCard {...post} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

GuidesList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default GuidesList;
