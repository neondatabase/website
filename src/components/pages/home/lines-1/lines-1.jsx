import React, { useEffect } from 'react';

import setPositionsForElements from './utils/setPositionsForElements';

import './lines-1.css';

const Lines1 = () => {
  useEffect(() => {
    setPositionsForElements();

    window.addEventListener('resize', setPositionsForElements);

    return () => window.removeEventListener('resize', setPositionsForElements);
  }, []);

  return (
    <div className="lg:hidden" aria-hidden>
      <div id="lines-1-vertical-line-1" className="vertical-line" />
      <div id="lines-1-vertical-line-2" className="vertical-line" />
      <div id="lines-1-vertical-line-3" className="vertical-line" />
      <div id="lines-1-vertical-line-4" className="vertical-line" />
      <div id="lines-1-vertical-line-5" className="vertical-line" />
      <div id="lines-1-vertical-line-6" className="vertical-line" />
      <div id="lines-1-vertical-line-7" className="vertical-line" />
      <div id="lines-1-vertical-line-8" className="vertical-line" />
      <div id="lines-1-vertical-line-9" className="vertical-line" />

      <div id="lines-1-horizontal-line-1" className="horizontal-line" />
      <div id="lines-1-horizontal-line-2" className="horizontal-line" />
      <div id="lines-1-horizontal-line-3" className="horizontal-line" />
      <div id="lines-1-horizontal-line-4" className="horizontal-line" />
      <div id="lines-1-horizontal-line-5" className="horizontal-line" />
      <div id="lines-1-horizontal-line-6" className="horizontal-line" />
      <div id="lines-1-horizontal-line-7" className="horizontal-line" />
      <div id="lines-1-horizontal-line-8" className="horizontal-line" />
      <div id="lines-1-horizontal-line-9" className="horizontal-line" />
      <div id="lines-1-horizontal-line-10" className="horizontal-line" />
      <div id="lines-1-horizontal-line-11" className="horizontal-line" />
      <div id="lines-1-horizontal-line-12" className="horizontal-line" />
      <div id="lines-1-horizontal-line-13" className="horizontal-line" />
      <div id="lines-1-horizontal-line-14" className="horizontal-line" />
      <div id="lines-1-horizontal-line-15" className="horizontal-line" />
      <div id="lines-1-horizontal-line-16" className="horizontal-line" />
      <div id="lines-1-horizontal-line-17" className="horizontal-line" />
      <div id="lines-1-horizontal-line-18" className="horizontal-line" />
      <div id="lines-1-horizontal-line-19" className="horizontal-line" />
      <div id="lines-1-horizontal-line-20" className="horizontal-line" />

      <div id="lines-1-shape-1" className="shape shape-bottom-left" />
      <div id="lines-1-shape-2" className="shape shape-bottom-right" />
      <div id="lines-1-shape-3" className="shape shape-top-left" />
      <div id="lines-1-shape-4" className="shape shape-top-left" />
      <div id="lines-1-shape-5" className="shape shape-top-right" />
      <div id="lines-1-shape-6" className="shape shape-bottom-right" />
      <div id="lines-1-shape-7" className="shape shape-bottom-right" />
      <div id="lines-1-shape-8" className="shape shape-bottom-right" />

      <div id="lines-1-circle-1" className="circle" />
      <div id="lines-1-circle-2" className="circle" />
      <div id="lines-1-circle-3" className="circle" />
      <div id="lines-1-circle-4" className="circle" />
      <div id="lines-1-circle-5" className="circle" />
      <div id="lines-1-circle-6" className="circle" />
      <div id="lines-1-circle-7" className="circle" />

      <div
        id="lines-1-circle-with-text-1"
        className="circle circle-with-text circle-with-text-right"
        data-text="51e3bade-4507-4f44-b960-675a2a272fa6"
      />
      <div
        id="lines-1-circle-with-text-2"
        className="circle circle-with-text circle-with-text-right"
        data-text="fe495254-ff45-4a1e-9207-2f8aa6482547"
      />
      <div
        id="lines-1-circle-with-text-3"
        className="circle circle-with-text circle-with-text-right"
        data-text="3022b5f9-5eab-444c-890a-f63b3caa5d28"
      />
      <div
        id="lines-1-circle-with-text-4"
        className="circle circle-with-text circle-with-text-right"
        data-text="24a9b481-97a0-4316-b27e-d1da09e2992a"
      />

      <div id="lines-1-dotted-vertical-line-1" className="dotted-vertical-line" />
      <div id="lines-1-dotted-vertical-line-2" className="dotted-vertical-line" />
      <div id="lines-1-dotted-vertical-line-3" className="dotted-vertical-line" />

      <div id="lines-1-dotted-horizontal-line-1" className="dotted-horizontal-line" />
    </div>
  );
};

export default Lines1;
