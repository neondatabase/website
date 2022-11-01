import clsx from 'clsx';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';

const Hero = ({ title, description, author, date, readingTime, className }) => {
  const postAuthor = author && (
    <div className="flex items-center">
      <GatsbyImage
        className="w-10 shrink-0 rounded-full"
        imgClassName="rounded-full"
        image={getImage(author.postAuthor?.image?.localFile)}
        alt={author.title}
        loading="eager"
      />
      <span className="t-lg ml-3 transition-colors duration-200 group-hover:text-primary-1 xs:ml-1.5">
        <span className="font-semibold">{author.title}</span>,{' '}
        <span>{author.postAuthor?.role}</span>
      </span>
    </div>
  );

  return (
    <div className={clsx('safe-paddings', className)}>
      <h1 className="t-5xl font-semibold leading-tight">{title}</h1>
      <p className="t-2xl mt-6 xl:mt-5">{description}</p>
      <div className="mt-8 flex items-center justify-between border-b border-b-gray-6 pb-8 leading-none 2xl:mt-7 2xl:pb-7 xl:mt-6 xl:pb-6 sm:flex-col sm:items-start sm:space-y-6 xs:leading-tight">
        {postAuthor && author.postAuthor.url ? (
          <Link className="group" to={author.postAuthor.url}>
            {postAuthor}
          </Link>
        ) : (
          postAuthor
        )}
        <span className="t-base flex items-center text-gray-2">
          <span>{date}</span>
          <span className="relative ml-3 pl-4 before:absolute before:top-1/2 before:left-0 before:inline-flex before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-gray-5">
            {readingTime} min read
          </span>
        </span>
      </div>
    </div>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  author: PropTypes.shape({
    title: PropTypes.string.isRequired,
    postAuthor: PropTypes.shape({
      role: PropTypes.string.isRequired,
      image: PropTypes.shape({
        localFile: PropTypes.shape({}),
      }),
      url: PropTypes.string,
    }),
  }).isRequired,
  date: PropTypes.string.isRequired,
  readingTime: PropTypes.number.isRequired,
  className: PropTypes.string,
};

Hero.defaultProps = {
  className: null,
};
export default Hero;
