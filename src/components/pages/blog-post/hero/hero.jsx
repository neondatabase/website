import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';
import POST_AUTHORS from 'constants/post-authors';
import getBlogPostDateFromSlug from 'utils/get-blog-post-date-from-slug';

const Hero = ({ title, description, author, slug }) => (
  <div className="safe-paddings pt-48 3xl:pt-44 2xl:pt-40 xl:pt-32 lg:pt-12 md:pt-6">
    <Container size="sm">
      <h1 className="t-5xl font-semibold">{title}</h1>
      <p className="t-2xl mt-6 xl:mt-5">{description}</p>
      <div className="mt-8 flex items-center justify-between border-b border-b-gray-4 pb-8 2xl:mt-7 2xl:pb-7 xl:mt-6 xl:pb-6">
        <div className="flex items-center">
          <img
            className="w-10 shrink-0 rounded-full"
            src={POST_AUTHORS[author]?.photo}
            alt={POST_AUTHORS[author]?.name}
          />
          <span className="t-lg ml-3 font-semibold xs:ml-1.5">{POST_AUTHORS[author]?.name}</span>
        </div>
        <p className="t-base text-gray-2">{getBlogPostDateFromSlug(slug)}</p>
      </div>
    </Container>
  </div>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  author: PropTypes.oneOf(Object.keys(POST_AUTHORS)).isRequired,
  slug: PropTypes.string.isRequired,
};

export default Hero;
