import clsx from 'clsx';
import PropTypes from 'prop-types';

import { CATEGORY_COLORS } from 'constants/blog';

import BlogPostCard, { BlogPostCardPropTypes } from '../blog-post-card/blog-post-card';

// Alignment left is the default, it's when the large post is on the left and the small ones on the right
const PostsList = ({ title, posts, alignment = 'left' }) => {
  const lowerCaseTitle = title.toLocaleLowerCase();
  const primaryPost = posts[0];
  const secondaryPosts = posts.slice(1, 6);
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
      <div className="mt-6 grid grid-cols-10 gap-x-10 gap-y-5 2xl:gap-x-6 lt:grid-cols-12 lg:mt-5 md:gap-y-10">
        <BlogPostCard
          className={clsx(
            alignment === 'left'
              ? 'col-span-6 col-start-1 xl:col-span-5 lt:col-span-6'
              : 'col-span-6 col-start-5 xl:col-span-5 xl:col-start-6 lt:col-span-7 lt:col-start-6 lg:col-span-6 lg:col-start-7',
            'sm:col-span-full'
          )}
          {...primaryPost.post}
        />
        <div
          className={clsx(
            alignment === 'left'
              ? 'col-span-4 col-start-7 xl:col-span-5 xl:col-start-6 lt:col-span-6 lt:col-start-7'
              : 'col-start-1 col-end-5 row-start-1 divide-y divide-gray-new-15 xl:col-end-6 lt:col-end-6 lg:col-end-7 sm:order-1 sm:row-start-2',
            'sm:col-span-full'
          )}
        >
          {alignment === 'right' &&
            secondaryPosts
              .slice(0, 3)
              .map(({ post }, index) => (
                <BlogPostCard
                  className="py-[18px] first:pt-0 last:pb-0 md:py-4"
                  {...post}
                  size={index === 0 ? 'md' : 'xs'}
                  key={index}
                />
              ))}
          {alignment === 'left' && (
            <>
              <div className="grid grid-cols-2 gap-x-10 pb-[18px] 2xl:gap-x-6 lg:pb-5 xs:grid-cols-1 xs:gap-y-10">
                {secondaryPosts.slice(0, 2).map(({ post }, index) => (
                  <BlogPostCard {...post} size="sm" key={index} />
                ))}
              </div>
              <div>
                {secondaryPosts.slice(2, 6).map(({ post }, index) => (
                  <BlogPostCard
                    className="border-t border-gray-new-15 py-[18px] last:pb-0 lg:py-4"
                    {...post}
                    size="xs"
                    key={index}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

PostsList.propTypes = {
  title: PropTypes.string.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      post: PropTypes.shape({
        ...BlogPostCardPropTypes,
      }),
    })
  ),
  alignment: PropTypes.oneOf(['left', 'right']),
};

export default PostsList;
