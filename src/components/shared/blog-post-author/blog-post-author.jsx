import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Link from 'components/shared/link';

const Author = ({ author, isBlogPost }) => (
  <div className="flex items-center">
    <GatsbyImage
      className="w-10 shrink-0 rounded-full"
      imgClassName="rounded-full"
      image={getImage(author.postAuthor?.image?.localFile)}
      alt={author.title}
    />
    <span className="ml-3 flex flex-col text-lg leading-none transition-colors duration-200 group-hover:text-primary-1 group-active:text-primary-1">
      <span className="font-semibold">{author.title}</span>
      {isBlogPost && <span className="mt-1">{author.postAuthor?.role}</span>}
    </span>
  </div>
);

Author.propTypes = {
  isBlogPost: PropTypes.bool,
  author: PropTypes.shape({
    title: PropTypes.string.isRequired,
    postAuthor: PropTypes.shape({
      role: PropTypes.string,
      image: PropTypes.shape({
        localFile: PropTypes.shape({}).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

Author.defaultProps = {
  isBlogPost: false,
};

const BlogPostAuthors = ({ authors, isBlogPost }) =>
  authors?.map(({ author }, index) => (
    <Fragment key={index}>
      {author.postAuthor.url ? (
        <Link className="group" to={author.postAuthor.url}>
          <Author author={author} isBlogPost={isBlogPost} />
        </Link>
      ) : (
        <Author author={author} isBlogPost={isBlogPost} />
      )}
    </Fragment>
  ));

BlogPostAuthors.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.shape({
        title: PropTypes.string.isRequired,
        postAuthor: PropTypes.shape({
          role: PropTypes.string,
          image: PropTypes.shape({
            localFile: PropTypes.shape({}).isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
};

BlogPostAuthors.defaultProps = {
  isBlogPost: false,
};

export default BlogPostAuthors;
