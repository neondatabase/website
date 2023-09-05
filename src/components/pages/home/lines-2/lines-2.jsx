import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useEffect } from 'react';

import setPositionsForElements from './utils/setPositionsForElements';

import './lines-2.css';

const verticalLines = [...Array(11)];
const horizontalLines = [...Array(16)];
const shapes = ['bottom-right', 'bottom-right', 'top-left', 'bottom-right'];
const circles = [...Array(2)];
const circlesWithText = [
  'ce3c2e9d-42e6-459e-9af5-cff5d83470f2',
  '80943a52-b0cd-4451-8db7-24d794eb3d63',
  '75a3a2b3-9d94-4709-a05a-593d996ab7d7',
];
const dottedVerticalLines = [...Array(1)];

const Lines2 = () => {
  useEffect(() => {
    setPositionsForElements();

    window.addEventListener('resize', setPositionsForElements);

    return () => window.removeEventListener('resize', setPositionsForElements);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <m.div className="lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-hidden>
        {verticalLines.map((_, index) => (
          <div id={`lines-2-vertical-line-${index + 1}`} className="vertical-line" key={index} />
        ))}

        {horizontalLines.map((_, index) => (
          <div
            id={`lines-2-horizontal-line-${index + 1}`}
            className="horizontal-line"
            key={index}
          />
        ))}

        {shapes.map((side, index) => (
          <div id={`lines-2-shape-${index + 1}`} className={`shape shape-${side}`} key={index} />
        ))}

        {circles.map((_, index) => (
          <div id={`lines-2-circle-${index + 1}`} className="circle" key={index} />
        ))}

        {circlesWithText.map((text, index) => (
          <div
            id={`lines-2-circle-with-text-${index + 1}`}
            className="circle circle-with-text circle-with-text-right"
            data-text={text}
            key={index}
          />
        ))}

        {dottedVerticalLines.map((_, index) => (
          <div
            id={`lines-2-dotted-vertical-line-${index + 1}`}
            className="dotted-vertical-line"
            key={index}
          />
        ))}
      </m.div>
    </LazyMotion>
  );
};

export default Lines2;
