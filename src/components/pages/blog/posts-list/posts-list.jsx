import PropTypes from 'prop-types';

import BlogPostAuthors from 'components/shared/blog-post-author';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import getBlogPostPath from 'utils/get-blog-post-path';

const PostsList = ({ items }) => (
  <section className="safe-paddings pt-48 3xl:pt-44 2xl:pt-40 xl:pt-32 lg:pt-12 md:pt-6">
    <Container size="xs">
      <div className="space-y-10 2xl:space-y-8 xl:space-y-7 md:space-y-6">
        {items.map(({ slug, title, pageBlogPost: { authors, description } }, index) => (
          <article
            className="relative border-b border-b-gray-7 pb-10 2xl:pb-8 xl:pb-7 md:pb-6"
            key={index}
          >
            <h1 className="text-[32px] font-semibold !leading-tight xl:text-3xl md:text-[28px]">
              <Link to={getBlogPostPath(slug)} theme="black">
                {title}
              </Link>
            </h1>
            <div className="mt-5 flex items-center space-x-7 2xl:mt-4">
              <BlogPostAuthors authors={authors} />
            </div>
            <p className="t-lg mt-5 !leading-normal 2xl:mt-4">{description}</p>
            <Link
              className="mt-5 font-semibold 2xl:mt-4"
              to={getBlogPostPath(slug)}
              size="sm"
              theme="black-primary-1"
            >
              Read more
            </Link>
          </article>
        ))}
      </div>
    </Container>
  </section>
);

PostsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      pageBlogPost: PropTypes.shape({
        description: PropTypes.string.isRequired,
        authors: PropTypes.arrayOf(
          PropTypes.shape({
            author: PropTypes.shape({
              title: PropTypes.string.isRequired,
              postAuthor: PropTypes.shape({
                role: PropTypes.string,
                image: PropTypes.shape({
                  mediaItemUrl: PropTypes.string.isRequired,
                }).isRequired,
              }).isRequired,
            }).isRequired,
          })
        ).isRequired,
      }),
    })
  ).isRequired,
};

export default PostsList;
