import {
  BAND_RADIUS,
  BANDS,
  DOT_COLUMN_SPACING,
  DOT_DIAMETER,
  ORIENTATION,
  SCENE_HEIGHT,
  SPHERE_RADIUS,
} from './globe-artwork';

const HORIZON = 0.02;
const RING_SAMPLES = 160;
const BAND_SAMPLES = 192;
const DESIGN_RADIUS = SCENE_HEIGHT * SPHERE_RADIUS;
const DOT_RADIUS = DOT_DIAMETER / DESIGN_RADIUS / 2;
const COLUMN_COUNT = Math.round((2 * Math.PI * BAND_RADIUS * DESIGN_RADIUS) / DOT_COLUMN_SPACING);

const normalize = (point) => {
  const length = Math.hypot(...point);
  return point.map((coordinate) => coordinate / length);
};

// Rotate the positive Z axis to the artwork's fixed camera direction.
const [cameraX, cameraY, cameraZ] = normalize(ORIENTATION);
const quaternionScale = Math.sqrt(2 * (1 + cameraZ));
const qx = -cameraY / quaternionScale;
const qy = cameraX / quaternionScale;
const qw = quaternionScale / 2;

const project = ([x, y, z]) => {
  const tx = 2 * qy * z;
  const ty = -2 * qx * z;
  const tz = 2 * (qx * y - qy * x);

  return [x + qw * tx + qy * tz, -(y + qw * ty - qx * tz), z + qw * tz + qx * ty - qy * tx];
};

const interpolate = (from, to, progress) =>
  from.map((coordinate, index) => coordinate + (to[index] - coordinate) * progress);

const clipToHorizon = (samples, closed, interpolatePoint) => {
  if (samples.every(({ depth }) => depth >= HORIZON)) {
    return [{ closed, points: samples.map(({ point }) => point) }];
  }

  const segments = [];
  let points = [];
  const edgeCount = closed ? samples.length : samples.length - 1;

  for (let index = 0; index < edgeCount; index += 1) {
    const from = samples[index];
    const to = samples[(index + 1) % samples.length];
    const fromVisible = from.depth >= HORIZON;
    const toVisible = to.depth >= HORIZON;

    if (fromVisible && !points.length) points.push(from.point);
    if (fromVisible && toVisible) {
      points.push(to.point);
    } else if (fromVisible !== toVisible) {
      const progress = (HORIZON - from.depth) / (to.depth - from.depth);
      const boundary = interpolatePoint(from.point, to.point, progress);
      if (fromVisible) {
        points.push(boundary);
        segments.push({ closed: false, points });
        points = [];
      } else {
        points = [boundary, to.point];
      }
    }
  }

  if (points.length >= 2) segments.push({ closed: false, points });
  return segments;
};

const ringLength = (points) =>
  points.reduce((length, [x, y, z], index) => {
    if (index === 0) return length;
    const [previousX, previousY, previousZ] = points[index - 1];
    return length + Math.hypot(x - previousX, y - previousY, z - previousZ);
  }, 0);

const sampleRing = (pointAt, closed) => {
  const sampleCount = closed ? RING_SAMPLES : RING_SAMPLES + 1;
  const samples = Array.from({ length: sampleCount }, (_, index) => {
    const point = project(pointAt(index / RING_SAMPLES));
    return { point, depth: point[2] };
  });

  return clipToHorizon(samples, closed, (from, to, progress) =>
    normalize(interpolate(from, to, progress))
  ).filter((ring) => ring.closed || ringLength(ring.points) >= 0.08);
};

const createRings = () => {
  const latitudeCount = 8;
  const latitudes = Array.from({ length: latitudeCount }, (_, index) => {
    const angle = ((index + 1) / (latitudeCount + 1) - 0.5) * Math.PI;
    const y = Math.sin(angle);
    const radius = Math.cos(angle);

    return sampleRing((progress) => {
      const longitude = progress * 2 * Math.PI;
      return [Math.cos(longitude) * radius, y, Math.sin(longitude) * radius];
    }, true);
  });

  const meridianCount = 16;
  const meridians = Array.from({ length: meridianCount }, (_, index) => {
    const angle = (index / meridianCount) * 2 * Math.PI;
    const x = Math.cos(angle);
    const z = Math.sin(angle);

    return sampleRing((progress) => {
      const latitude = (progress - 0.5) * Math.PI;
      const radius = Math.cos(latitude);
      return [x * radius, Math.sin(latitude), z * radius];
    }, false);
  });

  return [...latitudes, ...meridians].flat();
};

const getRowRadius = (y) => Math.sqrt(BAND_RADIUS * BAND_RADIUS - y * y);

const circularSamples = (count) =>
  Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * 2 * Math.PI;
    return [Math.cos(angle), Math.sin(angle)];
  });

const createBandOutlines = (minY, maxY, circle) => {
  const topRadius = getRowRadius(maxY);
  const bottomRadius = getRowRadius(minY);
  const samples = circle.map(([x, z]) => {
    const top = project([x * topRadius, maxY, z * topRadius]);
    const bottom = project([x * bottomRadius, minY, z * bottomRadius]);

    return { point: { top, bottom }, depth: (top[2] + bottom[2]) / 2 };
  });

  return clipToHorizon(samples, true, (from, to, progress) => ({
    top: interpolate(from.top, to.top, progress),
    bottom: interpolate(from.bottom, to.bottom, progress),
  })).map(({ points }) => [
    ...points.map(({ top }) => top),
    ...points.map(({ bottom }) => bottom).reverse(),
  ]);
};

const xAxis = project([1, 0, 0]);
const yAxis = project([0, 1, 0]);
const zAxis = project([0, 0, 1]);

const createDotRow = (y, circle) => {
  const rowRadius = getRowRadius(y);
  const dots = [];

  circle.forEach(([cosine, sine], column) => {
    const x = cosine * rowRadius;
    const z = sine * rowRadius;
    const depth = xAxis[2] * x + yAxis[2] * y + zAxis[2] * z;
    if (depth < HORIZON) return;

    // Each visible dot stores its logo-mask column and projected canvas coordinates.
    dots.push(
      column,
      xAxis[0] * x + yAxis[0] * y + zAxis[0] * z,
      xAxis[1] * x + yAxis[1] * y + zAxis[1] * z
    );
  });

  return new Float32Array(dots);
};

export const createGlobeGeometry = () => {
  const dotCircle = circularSamples(COLUMN_COUNT);
  const outlineCircle = circularSamples(BAND_SAMPLES);
  const columnPitch = (2 * Math.PI * BAND_RADIUS) / COLUMN_COUNT;

  const bands = BANDS.map((band) => {
    const minY = (band.latitude - band.width / 2) / 100;
    const maxY = (band.latitude + band.width / 2) / 100;
    const span = maxY - minY;
    const rowCount = Math.round(span / (DOT_RADIUS * 2 * 1.55));
    const rowPitch = span / rowCount;

    return {
      ...band,
      outlines: createBandOutlines(minY, maxY, outlineCircle),
      rows: Array.from({ length: rowCount }, (_, row) =>
        createDotRow(minY + (row + 0.5) * rowPitch, dotCircle)
      ),
      rowPitch,
    };
  });

  return {
    bands,
    rings: createRings(),
    columnCount: COLUMN_COUNT,
    columnPitch,
    dotRadius: DOT_RADIUS,
  };
};
