import clsx from 'clsx';
import PropTypes from 'prop-types';

import BlogPostCard from 'components/pages/blog/blog-post-card';

const MoreArticles = ({ className = null, posts }) => (
  <section className={clsx('more-articles flex flex-col', className)}>
    <h2 className="flex items-center font-title text-xs font-medium uppercase leading-none tracking-[0.02em] text-blue-80">
      <span className="">More from Neon</span>
      <span className="ml-2 h-px grow bg-gray-new-20" />
    </h2>

    <ul className="mt-6 grid grid-cols-3 gap-x-10 xl:gap-x-6 lg:gap-x-4 md:grid-cols-1 md:gap-y-6">
      {posts.map((post, index) => (
        <li key={index} className="flex flex-col">
          <BlogPostCard {...post} imageWidth={380} imageHeight={214} />
        </li>
      ))}
    </ul>
  </section>
);

MoreArticles.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      categories: PropTypes.shape({
        nodes: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            slug: PropTypes.string,
          })
        ),
      }),
      pageBlogPost: PropTypes.shape({
        authors: PropTypes.arrayOf(
          PropTypes.shape({
            author: PropTypes.shape({
              title: PropTypes.string,
              postAuthor: PropTypes.shape({
                image: PropTypes.shape({
                  mediaItemUrl: PropTypes.string,
                }),
              }),
            }),
          })
        ),
      }),
    })
  ),
};

export default MoreArticles;
