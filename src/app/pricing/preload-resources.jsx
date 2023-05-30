'use client';

import ReactDOM from 'react-dom';

export function PreloadResources() {
  ReactDOM.preload('/animations/pages/pricing/pricing.riv', {
    as: 'fetch',
    crossorigin: 'anonymous',
    media: '(min-width: 1024px)',
  });
}
