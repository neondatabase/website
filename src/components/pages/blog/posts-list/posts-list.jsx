import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import POST_AUTHORS from 'constants/post-authors';
import getBlogPostDateFromSlug from 'utils/get-blog-post-date-from-slug';
import getBlogPostPath from 'utils/get-blog-post-path';

const PostsList = ({ items }) => (
  <section className="safe-paddings pt-56 3xl:pt-52 2xl:pt-48 xl:pt-44 lg:pt-12 md:pt-6">
    <Container size="sm">
      <div className="space-y-10">
        {items.map(({ slug, frontmatter: { title, description, author } }, index) => (
          <article className="relative border-b border-b-gray-3 pb-10" key={index}>
            <h1 className="t-3xl font-semibold !leading-tight">
              <Link to={getBlogPostPath(slug)} theme="black">
                {title}
              </Link>
            </h1>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="w-10 flex-shrink-0 rounded-full"
                  src={POST_AUTHORS[author]?.photo}
                  alt={POST_AUTHORS[author]?.name}
                />
                <span className="t-lg ml-3 font-semibold">{POST_AUTHORS[author]?.name}</span>
              </div>
              <p className="t-base text-gray-2">{getBlogPostDateFromSlug(slug)}</p>
            </div>
            <p className="t-lg mt-5 !leading-normal">{description}</p>
            <Link
              className="mt-5 font-semibold"
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
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        author: PropTypes.oneOf(Object.keys(POST_AUTHORS)).isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default PostsList;
