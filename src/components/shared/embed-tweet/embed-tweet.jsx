'use client';

import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

const EmbedTweet = (props) => {
  const { children, ...rest } = props;
  const ref = useRef();

  useEffect(() => {
    if (ref.current?.querySelector('.twitter-tweet-rendered')) return;
    window.twttr?.widgets.load();
  }, []);

  return (
    <figure {...rest} ref={ref}>
      {children}
    </figure>
  );
};

EmbedTweet.propTypes = {
  children: PropTypes.node,
};

export default EmbedTweet;
