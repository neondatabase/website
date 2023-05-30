'use client';

import ReactDOM from 'react-dom/client';

export const PreloadResources = () => {
  ReactDOM.preload('/animations/pages/pricing/pricing.riv', {
    as: 'fetch',
    media: '(min-width: 1024px)',
    crossOrigin: 'anonymous',
  });
  return null;
};
