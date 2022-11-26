import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';

const TITLE = 'Release notes';
const DESCRIPTION = 'The latest product updates from Neon';

const Hero = ({ className, withContainer }) => {
  const Tag = withContainer ? Container : 'div';
  return (
    <div className={className}>
      <Tag className={clsx('mb-10 sm:mb-7')} size="sm">
        <h1 className="text-[36px] font-semibold xl:text-3xl">{TITLE}</h1>
        <p className="mt-3">{DESCRIPTION}</p>
      </Tag>
    </div>
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
