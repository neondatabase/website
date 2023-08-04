'use client';

import PropTypes from 'prop-types';
import { useEffect } from 'react';

const EmbedTweet = (props) => {
  const { children, ...rest } = props;
  useEffect(() => {
    window.twttr?.widgets.load();
  }, []);
  return <figure {...rest}>{children}</figure>;
};

EmbedTweet.propTypes = {
  children: PropTypes.node,
};

export default EmbedTweet;
