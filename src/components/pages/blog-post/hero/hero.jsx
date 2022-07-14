import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';

const Hero = ({ title, description, author, date }) => (
  <div className="safe-paddings pt-48 3xl:pt-44 2xl:pt-40 xl:pt-32 lg:pt-12 md:pt-6">
    <Container size="sm">
      <h1 className="t-5xl font-semibold">{title}</h1>
      <p className="t-2xl mt-6 xl:mt-5">{description}</p>
      <div className="mt-8 flex items-center justify-between border-b border-b-gray-4 pb-8 2xl:mt-7 2xl:pb-7 xl:mt-6 xl:pb-6">
        <div className="flex items-center">
          <GatsbyImage
            className="w-10 shrink-0 rounded-full"
            imgClassName="rounded-full"
            image={getImage(author.postAuthor.image.localFile)}
            alt={author.title}
            loading="eager"
          />
          <span className="t-lg ml-3 font-semibold xs:ml-1.5">{author.title}</span>
        </div>
        <p className="t-base text-gray-2">{date}</p>
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
      image: PropTypes.shape({
        localFile: PropTypes.shape({}),
      }),
    }),
  }).isRequired,
  date: PropTypes.string.isRequired,
};

export default Hero;
