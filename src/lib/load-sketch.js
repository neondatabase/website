import { isSketchPath } from './sketch-path';

const loadSketch = async (src) => {
  if (!isSketchPath(src)) {
    throw new Error(`Invalid sketch path: ${src}`);
  }

  // A bounded import context lets Next.js emit a separate chunk for each sketch.
  const { default: sketch } = await import(`../sketches/${src.slice('/sketches/'.length)}`);
  if (typeof sketch !== 'function') {
    throw new Error(`The sketch at ${src} must default-export a Sketch function.`);
  }

  return sketch;
};

export default loadSketch;
