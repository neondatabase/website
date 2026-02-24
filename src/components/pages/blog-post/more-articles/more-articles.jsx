import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import BlogPostCard from 'components/pages/blog/blog-post-card';
import triangleIcon from 'icons/triangle.svg';

const MoreArticles = ({ className = null, posts }) => (
  <section className={clsx('more-articles flex flex-col', className)}>
    <h2 className="flex items-center gap-x-2 font-mono text-xs uppercase leading-none -tracking-extra-tight text-gray-new-80">
      <Image className="" src={triangleIcon} alt="" width={12} height={14} aria-hidden="true" />
      <span className="">More from Neon</span>
      <span className="ml-2.5 h-px grow bg-gray-new-20" />
    </h2>

    <div className="mt-8 flex flex-col">
      {posts.map((post, index) => (
        <BlogPostCard key={index} {...post} imageWidth={260} imageHeight={146} isSmart />
      ))}
    </div>
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
