import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import { CATEGORY_COLORS } from 'constants/blog';

import BlogPostCard, { BlogPostCardPropTypes } from '../blog-post-card/blog-post-card';

// Alignment left is the default, it's when the large post is on the left and the small ones on the right
const PostsList = ({ title, posts, alignment = 'left' }) => {
  const lowerCaseTitle = title.toLocaleLowerCase();
  const primaryPost = posts[0];
  const secondaryPosts = posts.slice(1, 5);
  return (
    <section className="posts-list flex flex-col">
      <h2
        className={clsx(
          'flex items-center text-xs font-semibold uppercase leading-none tracking-[0.02em]',
          CATEGORY_COLORS[lowerCaseTitle] || 'text-green-45'
        )}
      >
        <span>{title}</span>
        <span className="ml-2 h-px grow bg-gray-new-20" />
      </h2>
      <div className="mt-6 grid grid-cols-10 gap-x-10">
        <BlogPostCard
          className={clsx(
            alignment === 'left' ? 'col-span-6 col-start-1' : 'col-span-6 col-start-5'
          )}
          {...primaryPost}
        />
        <div
          className={clsx(
            alignment === 'left'
              ? 'col-span-4 col-start-7'
              : 'col-start-1 col-end-5 row-start-1 divide-y divide-gray-new-15'
          )}
        >
          {alignment === 'right' &&
            secondaryPosts
              .slice(0, 3)
              .map((post, index) => (
                <BlogPostCard
                  className="py-[18px] first:pt-0 last:pb-0"
                  {...post}
                  size={index === 0 ? 'md' : 'sm'}
                  key={index}
                />
              ))}
          {alignment === 'left' && (
            <>
              <div className="grid grid-cols-2 gap-x-10 pb-[18px]">
                {secondaryPosts.slice(0, 2).map((post, index) => (
                  <BlogPostCard {...post} size="md" key={index} />
                ))}
              </div>
              <div>
                {secondaryPosts.slice(2, 5).map((post, index) => (
                  <BlogPostCard
                    className="border-t border-gray-new-15 py-[18px] last:pb-0"
                    {...post}
                    size="sm"
                    key={index}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Link
        className={clsx(
          'ml-auto inline-flex items-center text-sm font-medium leading-none tracking-[-0.02em]',
          CATEGORY_COLORS[lowerCaseTitle]
        )}
        to={`/blog/category/${lowerCaseTitle}`}
        withArrow
      >
        All {lowerCaseTitle} articles
      </Link>
    </section>
  );
};

PostsList.propTypes = {
  title: PropTypes.string.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      ...BlogPostCardPropTypes,
    })
  ),
  alignment: PropTypes.oneOf(['left', 'right']),
};

export default PostsList;
