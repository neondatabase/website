import PropTypes from 'prop-types';

import BlogPostCard, { BlogPostCardPropTypes } from '../blog-post-card/blog-post-card';

const FeaturedPostsList = ({ posts }) => {
  const primaryPost = posts[0];
  const secondaryPosts = posts.slice(1, 5);

  return (
    <section className="grid grid-cols-12 xl:gap-x-6 md:flex md:flex-col md:gap-y-10">
      <BlogPostCard className="col-span-7 lt:col-span-6" {...primaryPost.post} isPriority />
      <div className="col-span-5 pl-7 xl:pl-6 lt:col-span-6 lt:pl-0">
        <div className="grid grid-cols-2 gap-x-7 gap-y-11 xl:gap-x-6 xl:gap-y-8 md:gap-y-10 xs:grid-cols-1">
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
