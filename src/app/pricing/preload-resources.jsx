'use client';

import ReactDOM from 'react-dom/client';

const PreloadResources = () => {
  const head = ReactDOM.createRoot(document.head);

  // TODO: use preload instead of render once it's supported by React https://github.com/facebook/react/pull/26237
  head.render(
    <link
      rel="preload"
      crossOrigin="anonymous"
      href="/animations/pages/pricing/pricing.riv"
      as="fetch"
      media="(min-width: 1024px)"
    />
  );
  return null;
};

export default PreloadResources;
