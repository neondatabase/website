import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';

const Hero = ({ title, description, author, date, readingTime }) => (
  <div className="safe-paddings pt-48 3xl:pt-44 2xl:pt-40 xl:pt-32 lg:pt-12 md:pt-6">
    <Container size="sm">
      <h1 className="t-5xl font-semibold">{title}</h1>
      <p className="t-2xl mt-6 xl:mt-5">{description}</p>
      <div className="mt-8 flex items-center justify-between border-b border-b-gray-4 pb-8 2xl:mt-7 2xl:pb-7 xl:mt-6 xl:pb-6 sm:flex-col sm:items-start sm:space-y-6">
        {author && (
          <div className="flex items-center">
            <GatsbyImage
              className="w-10 shrink-0 rounded-full"
              imgClassName="rounded-full"
              image={getImage(author.postAuthor?.image?.localFile)}
              alt={author.title}
              loading="eager"
            />
            <span className="t-lg">
              <span className="ml-3 font-semibold xs:ml-1.5">{author.title}</span>,{' '}
              <span>{author.postAuthor?.role}</span>
            </span>
          </div>
        )}
        <span className="t-base flex items-center text-gray-2">
          <span>{date}</span>
          <span className="relative ml-3 pl-4 before:absolute before:top-1/2 before:left-0 before:inline-flex before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-gray-3">
            {readingTime} min read
          </span>
        </span>
      </div>
    </Container>
  </div>
);

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
    }),
  }).isRequired,
  date: PropTypes.string.isRequired,
  readingTime: PropTypes.number.isRequired,
};

export default Hero;
