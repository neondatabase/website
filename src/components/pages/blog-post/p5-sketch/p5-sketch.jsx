'use client';

import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import loadSketch from 'lib/load-sketch';

const SketchLoading = () => (
  <div className="flex min-h-48 items-center justify-center text-sm text-gray-new-50">
    Loading sketch…
  </div>
);

const SketchError = () => (
  <div className="flex min-h-48 items-center justify-center text-sm text-gray-new-50">
    This sketch couldn’t be loaded.
  </div>
);

const P5Sketch = ({ src, caption }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
    fallbackInView: true,
  });
  const canvasRef = useRef(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!inView) return undefined;

    let cancelled = false;
    let instance;

    // Keep p5 and every sketch out of SSR and the initial browser bundle.
    Promise.all([import('p5'), loadSketch(src)])
      .then(([{ default: P5 }, sketch]) => {
        if (cancelled) return;

        instance = new P5(sketch, canvasRef.current);
        setStatus({ src, ready: true });
      })
      .catch((error) => {
        if (!cancelled) {
          instance?.remove();
          console.error(`Failed to load p5 sketch: ${src}`, error);
          setStatus({ src, error: true });
        }
      });

    return () => {
      cancelled = true;
      instance?.remove();
    };
  }, [inView, src]);

  const ready = status?.src === src && status.ready;

  return (
    <figure ref={ref}>
      <div
        aria-hidden="true"
        className="not-prose flex justify-center [&_canvas]:mx-auto [&_canvas]:block [&_canvas]:h-auto! [&_canvas]:max-w-full! [&>div]:max-w-full"
      >
        {status?.src === src && status.error ? <SketchError /> : !ready ? <SketchLoading /> : null}
        <div ref={canvasRef} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
};

P5Sketch.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
};

export default P5Sketch;
