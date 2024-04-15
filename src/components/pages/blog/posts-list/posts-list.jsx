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
      <h2 className={clsx('flex items-center', CATEGORY_COLORS[lowerCaseTitle] || 'text-green-45')}>
        <span className="text-[11px] font-semibold uppercase leading-none -tracking-extra-tight">
          {title}
        </span>
        <span className="ml-2 h-px grow bg-gray-new-20" />
      </h2>
      <div className="mt-6 grid grid-cols-12 gap-y-5 lt:gap-x-6 lg:mt-5 md:gap-y-10">
        <BlogPostCard
          className={clsx(
            alignment === 'left'
              ? 'col-span-7 col-start-1 lt:col-span-6'
              : 'col-span-7 col-start-6 lt:col-span-7 lt:col-start-6 lg:col-span-6 lg:col-start-7',
            'sm:col-span-full'
          )}
          {...primaryPost.post}
        />
        <div
          className={clsx(
            alignment === 'left'
              ? 'col-span-5 col-start-8 pl-7 xl:pl-6 lt:col-span-6 lt:col-start-7 lt:pl-0'
              : 'col-start-1 col-end-6 row-start-1 divide-y divide-gray-new-15 pr-7 xl:pr-6 lt:col-end-6 lt:pr-0 lg:col-end-7 sm:order-1 sm:row-start-2',
            'sm:col-span-full'
          )}
        >
          {alignment === 'right' &&
            secondaryPosts
              .slice(0, 3)
              .map(({ post }, index) => (
                <BlogPostCard
                  className="py-4 first:pt-0 last:pb-0"
                  {...post}
                  size={index === 0 ? 'md' : 'xs'}
                  key={index}
                />
              ))}
          {alignment === 'left' && (
            <>
              <div className="grid grid-cols-2 gap-x-7 pb-6 2xl:gap-x-6 lg:pb-5 xs:grid-cols-1 xs:gap-y-10">
                {secondaryPosts.slice(0, 2).map(({ post }, index) => (
                  <BlogPostCard {...post} size="sm" key={index} />
                ))}
              </div>
              <div>
                {secondaryPosts.slice(2, 6).map(({ post }, index) => (
                  <BlogPostCard
                    className="border-t border-gray-new-15 py-4 last:pb-0"
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
