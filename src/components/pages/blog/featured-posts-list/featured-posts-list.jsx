import PropTypes from 'prop-types';

import BlogPostCard, { BlogPostCardPropTypes } from '../blog-post-card/blog-post-card';

const FeaturedPostsList = ({ posts }) => {
  const primaryPost = posts[0];
  const secondaryPosts = posts.slice(1, 5);

  return (
    <section className="grid grid-cols-10 gap-x-10 2xl:gap-x-6 md:gap-y-10">
      <BlogPostCard
        className="col-span-6 xl:col-span-5 md:col-span-full"
        {...primaryPost.post}
        isPriority
      />
      <div className="col-span-4 xl:col-span-5 md:col-span-full">
        <div className="grid grid-cols-2 gap-x-10 gap-y-11 2xl:gap-x-6 xl:gap-y-8 md:gap-y-10 xs:grid-cols-1">
          {secondaryPosts.map(({ post }, index) => (
            <BlogPostCard {...post} size="sm" key={index} />
          ))}
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
