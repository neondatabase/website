'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

import Link from 'components/shared/link';

const Author = ({ author, isBlogPost = false }) => (
  <div className="flex items-center">
    <Image
      className="w-10 shrink-0 rounded-full"
      src={author.postAuthor?.image?.mediaItemUrl}
      width={40}
      height={40}
      quality={85}
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
        mediaItemUrl: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

const BlogPostAuthors = ({ authors, isBlogPost = false }) =>
  authors?.map(({ author }, index) => (
    <Fragment key={index}>
      {author.postAuthor.url ? (
        <Link
          className="group"
          to={author.postAuthor.url}
          target="_blank"
          rel="noopener noreferrer"
        >
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
          url: PropTypes.string,
          role: PropTypes.string,
          image: PropTypes.shape({
            mediaItemUrl: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default BlogPostAuthors;
