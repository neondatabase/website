import PropTypes from 'prop-types';

import BlogPostCard, { BlogPostCardPropTypes } from '../blog-post-card/blog-post-card';

const FeaturedPostsList = ({ posts }) => {
  const primaryPost = posts[0];
  const secondaryPosts = posts.slice(1, 5);

  return (
    <section>
      <h2 className="flex items-center text-xs font-semibold uppercase leading-none tracking-[0.02em] text-blue-80">
        <span>Featured</span>
        <span className="ml-2 h-px grow bg-gray-new-20" />
      </h2>
      <div className="mt-6 grid grid-cols-10 gap-x-10 xl:gap-x-6">
        <BlogPostCard className="col-span-6" {...primaryPost.post} />
        <div className="col-span-4">
          <div className="grid grid-cols-2 gap-x-10 gap-y-11 xl:gap-x-6">
            {secondaryPosts.map(({ post }, index) => (
              <BlogPostCard {...post} size="md" key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

FeaturedPostsList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      post: PropTypes.shape({
        ...BlogPostCardPropTypes,
      }),
    })
  ),
};

export default FeaturedPostsList;
