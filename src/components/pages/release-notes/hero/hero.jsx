import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';

const TITLE = 'Release notes';
const DESCRIPTION = 'The latest product updates from Neon';

const Hero = ({ className, withContainer }) => {
  const Tag = withContainer ? Container : 'div';
  return (
    <Tag
      className={clsx('mb-12 border-b border-b-gray-5 pb-12 md:mb-10 sm:mb-7', className)}
      size="sm"
    >
      <h1 className="t-5xl font-semibold">{TITLE}</h1>
      <p className="mt-3 text-xl">{DESCRIPTION}</p>
    </Tag>
  );
};

Hero.propTypes = {
  className: PropTypes.string,
  withContainer: PropTypes.bool,
};

Hero.defaultProps = {
  className: null,
  withContainer: false,
};

export default Hero;
