'use client';

import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

const TWITTER_WIDGETS_SRC = 'https://platform.twitter.com/widgets.js';

let twitterWidgetsPromise;

function loadTwitterWidgets() {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (window.twttr?.widgets) {
    return Promise.resolve(window.twttr);
  }

  if (twitterWidgetsPromise) {
    return twitterWidgetsPromise;
  }

  twitterWidgetsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${TWITTER_WIDGETS_SRC}"]`);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.twttr ?? null), { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = TWITTER_WIDGETS_SRC;
    script.async = true;
    script.charset = 'utf-8';
    script.addEventListener('load', () => resolve(window.twttr ?? null), { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  }).catch((error) => {
    twitterWidgetsPromise = null;
    throw error;
  });

  return twitterWidgetsPromise;
}

const EmbedTweet = (props) => {
  const { className, url } = props;
  const containerRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    loadTwitterWidgets()
      .then((twttr) => {
        if (!isCancelled && twttr?.widgets && containerRef.current) {
          twttr.widgets.load(containerRef.current);
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [url]);

  if (!url) {
    return null;
  }

  return (
    <figure ref={containerRef} className={className}>
      <blockquote className="twitter-tweet" data-width="500" data-dnt="true" data-theme="dark">
        <a href={url}>{url}</a>
      </blockquote>
    </figure>
  );
};

EmbedTweet.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string,
};

export default EmbedTweet;
