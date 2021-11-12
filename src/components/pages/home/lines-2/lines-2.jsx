import React, { useEffect } from 'react';

import setPositionsForElements from './utils/setPositionsForElements';

import './lines-2.css';

const Lines2 = () => {
  useEffect(() => {
    setPositionsForElements();

    window.addEventListener('resize', setPositionsForElements);

    return () => window.removeEventListener('resize', setPositionsForElements);
  }, []);

  return (
    <div className="lg:hidden" aria-hidden>
      <div id="lines-2-vertical-line-1" className="vertical-line" />
      <div id="lines-2-vertical-line-2" className="vertical-line" />
      <div id="lines-2-vertical-line-3" className="vertical-line" />
      <div id="lines-2-vertical-line-4" className="vertical-line" />
      <div id="lines-2-vertical-line-5" className="vertical-line" />
      <div id="lines-2-vertical-line-6" className="vertical-line" />
      <div id="lines-2-vertical-line-7" className="vertical-line" />
      <div id="lines-2-vertical-line-8" className="vertical-line" />
      <div id="lines-2-vertical-line-9" className="vertical-line" />
      <div id="lines-2-vertical-line-10" className="vertical-line" />
      <div id="lines-2-vertical-line-11" className="vertical-line" />

      <div id="lines-2-horizontal-line-1" className="horizontal-line" />
      <div id="lines-2-horizontal-line-2" className="horizontal-line" />
      <div id="lines-2-horizontal-line-3" className="horizontal-line" />
      <div id="lines-2-horizontal-line-4" className="horizontal-line" />
      <div id="lines-2-horizontal-line-5" className="horizontal-line" />
      <div id="lines-2-horizontal-line-6" className="horizontal-line" />
      <div id="lines-2-horizontal-line-7" className="horizontal-line" />
      <div id="lines-2-horizontal-line-8" className="horizontal-line" />
      <div id="lines-2-horizontal-line-9" className="horizontal-line" />
      <div id="lines-2-horizontal-line-10" className="horizontal-line" />
      <div id="lines-2-horizontal-line-11" className="horizontal-line" />
      <div id="lines-2-horizontal-line-12" className="horizontal-line" />
      <div id="lines-2-horizontal-line-13" className="horizontal-line" />
      <div id="lines-2-horizontal-line-14" className="horizontal-line" />
      <div id="lines-2-horizontal-line-15" className="horizontal-line" />
      <div id="lines-2-horizontal-line-16" className="horizontal-line" />

      <div id="lines-2-shape-1" className="shape shape-bottom-right" />
      <div id="lines-2-shape-2" className="shape shape-bottom-right" />
      <div id="lines-2-shape-3" className="shape shape-top-left" />
      <div id="lines-2-shape-4" className="shape shape-bottom-right" />

      <div id="lines-2-circle-1" className="circle" />
      <div id="lines-2-circle-2" className="circle" />

      <div
        id="lines-2-circle-with-text-1"
        className="circle circle-with-text circle-with-text-right"
        data-text="ce3c2e9d-42e6-459e-9af5-cff5d83470f2"
      />
      <div
        id="lines-2-circle-with-text-2"
        className="circle circle-with-text circle-with-text-right"
        data-text="80943a52-b0cd-4451-8db7-24d794eb3d63"
      />
      <div
        id="lines-2-circle-with-text-3"
        className="circle circle-with-text circle-with-text-right"
        data-text="75a3a2b3-9d94-4709-a05a-593d996ab7d7"
      />

      <div id="lines-2-dotted-vertical-line-1" className="dotted-vertical-line" />
    </div>
  );
};

export default Lines2;
