import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';
import POST_AUTHORS from 'constants/post-authors';
import getBlogPostDateFromSlug from 'utils/get-blog-post-date-from-slug';

const Hero = ({ title, description, author, slug, timeToRead }) => (
  <div className="safe-paddings pt-48 3xl:pt-44 2xl:pt-40 xl:pt-32 lg:pt-12 md:pt-6">
    <Container size="sm">
      <h1 className="t-5xl font-semibold">{title}</h1>
      <p className="t-2xl mt-6 xl:mt-5">{description}</p>
      <div className="mt-8 flex items-center justify-between border-b border-b-gray-4 pb-8 2xl:mt-7 2xl:pb-7 xl:mt-6 xl:pb-6 sm:flex-col sm:items-start sm:space-y-6">
        <div className="flex items-center">
          <img
            className="w-10 shrink-0 rounded-full"
            src={POST_AUTHORS[author]?.photo}
            alt={POST_AUTHORS[author]?.name}
          />
          <span className="t-lg">
            <span className="ml-3 font-semibold xs:ml-1.5">{POST_AUTHORS[author]?.name}</span>,{' '}
            <span>{POST_AUTHORS[author]?.role}</span>
          </span>
        </div>
        <span className="t-base text-gray-2">
          <span>{getBlogPostDateFromSlug(slug)}</span>
          <span className="relative ml-3 pl-4 before:absolute before:top-1/2 before:left-0 before:inline-flex before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-gray-3">
            {timeToRead} min read
          </span>
        </span>
      </div>
    </Container>
  </div>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  author: PropTypes.oneOf(Object.keys(POST_AUTHORS)).isRequired,
  slug: PropTypes.string.isRequired,
  timeToRead: PropTypes.number.isRequired,
};

export default Hero;
