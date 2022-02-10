import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import postAuthors from 'constants/post-authors';

const PostsList = ({ items }) => (
  <section className="safe-paddings pt-56 3xl:pt-52 2xl:pt-48 xl:pt-44 lg:pt-12 md:pt-6">
    <Container size="sm">
      <div className="space-y-10">
        {items.map(({ frontmatter: { title, description, author, date, path } }, index) => (
          <article className="relative border-b border-b-gray-3 pb-10" key={index}>
            <h1 className="t-3xl font-semibold !leading-tight">
              <Link to={path} theme="black">
                {title}
              </Link>
            </h1>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="w-10 flex-shrink-0 rounded-full"
                  src={postAuthors[author].photo}
                  alt={postAuthors[author].name}
                />
                <span className="t-lg ml-3 font-semibold">{postAuthors[author].name}</span>
              </div>
              <p className="t-base text-gray-2">{date}</p>
            </div>
            <p className="t-lg mt-5 !leading-normal">{description}</p>
            <Link className="mt-5 font-semibold" to={path} size="sm" theme="black-primary-1">
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
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        author: PropTypes.oneOf(Object.keys(postAuthors)).isRequired,
        date: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default PostsList;
