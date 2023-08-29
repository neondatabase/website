import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useEffect } from 'react';

import setPositionsForElements from './utils/setPositionsForElements';

import './lines-1.css';

const verticalLines = [...Array(9)];
const horizontalLines = [...Array(20)];
const shapes = [
  'bottom-left',
  'bottom-right',
  'top-left',
  'top-left',
  'top-right',
  'bottom-right',
  'bottom-right',
  'bottom-right',
];
const circles = [...Array(7)];
const circlesWithText = [
  '51e3bade-4507-4f44-b960-675a2a272fa6',
  'fe495254-ff45-4a1e-9207-2f8aa6482547',
  '3022b5f9-5eab-444c-890a-f63b3caa5d28',
  '24a9b481-97a0-4316-b27e-d1da09e2992a',
];
const dottedVerticalLines = [...Array(3)];
const dottedHorizontalLines = [...Array(1)];

const Lines1 = () => {
  useEffect(() => {
    setPositionsForElements();

    window.addEventListener('resize', setPositionsForElements);

    return () => window.removeEventListener('resize', setPositionsForElements);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <m.div className="lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-hidden>
        {verticalLines.map((_, index) => (
          <div id={`lines-1-vertical-line-${index + 1}`} className="vertical-line" key={index} />
        ))}

        {horizontalLines.map((_, index) => (
          <div
            id={`lines-1-horizontal-line-${index + 1}`}
            className="horizontal-line"
            key={index}
          />
        ))}

        {shapes.map((side, index) => (
          <div id={`lines-1-shape-${index + 1}`} className={`shape shape-${side}`} key={index} />
        ))}

        {circles.map((_, index) => (
          <div id={`lines-1-circle-${index + 1}`} className="circle" key={index} />
        ))}

        {circlesWithText.map((text, index) => (
          <div
            id={`lines-1-circle-with-text-${index + 1}`}
            className="circle circle-with-text circle-with-text-right"
            data-text={text}
            key={index}
          />
        ))}

        {dottedVerticalLines.map((_, index) => (
          <div
            id={`lines-1-dotted-vertical-line-${index + 1}`}
            className="dotted-vertical-line"
            key={index}
          />
        ))}

        {dottedHorizontalLines.map((_, index) => (
          <div
            id={`lines-1-dotted-horizontal-line-${index + 1}`}
            className="dotted-horizontal-line"
            key={index}
          />
        ))}
      </m.div>
    </LazyMotion>
  );
};

export default Lines1;
