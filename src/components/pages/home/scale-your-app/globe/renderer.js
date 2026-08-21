import {
  CRT_STATIC_PHASE_MS,
  SCENE_HEIGHT,
  SCENE_WIDTH,
  SCREEN_RADIUS_RATIO,
  SETTINGS,
} from './constants';
import { LOGO_ASSETS } from './logo-assets';
import {
  applyQuaternion,
  distanceBetween,
  distanceBetweenSquared,
  lerpVectors,
  multiplyVector,
  normalizeVector,
  quaternionBetweenUnitVectors,
} from './math';

const GLOBE_RADIUS = 1;
const LINE_SURFACE_SCALE = 1;
const VISIBLE_HORIZON_Z = 0.02;
const MIN_VISIBLE_SEGMENT_LENGTH = 0.08;
const BAND_SAMPLE_COUNT = 192;
const BAND_CAP_SAMPLE_COUNT = 24;
const BAND_EDGE_PADDING = 0.004;
// The ribbons share a shallow radial cap just outside the globe surface.
const BAND_CAP_RADIUS_RATIO = 1.01;
const BAND_DOT_COLOR = '#FFFFFF';
const LOGO_DOT_COLOR = '#000000';

const BAND_DOT_MAX_ROWS = 72;
const BAND_DOT_MAX_COLUMNS = 720;
const BAND_DOT_MIN_COLUMNS = 48;
const BAND_DOT_MIN_COLUMN_SPACING_PX = 1;
const BAND_DOT_MIN_DIAMETER_PX = 0.8;
const BAND_DOT_ROW_PITCH_RATIO = 1.55;

const LOGO_HEIGHT_ROW_RATIO = 0.74;
const LOGO_MAX_COLUMN_RATIO = 0.48;

const LOGO_LOOP_APPROACH_DURATION_MS = 760;
const LOGO_LOOP_STAGGER_MS = 840;
const LOGO_LOOP_ORBIT_DISTANCE = 200;
const LOGO_LOOP_ORBIT_DURATION_MS = 2520;
const LOGO_LOOP_FINAL_INERTIA_BLEND = 0.35;
const LOGO_LOOP_FINAL_INERTIA_START_PROGRESS = 0.78;

const CRT_SCANLINE_SPACING = 3;
const CRT_SCANLINE_HEIGHT = 0.9;
const CRT_SCANLINE_ALPHA = 0.09;
const CRT_SCANLINE_ALPHA_VARIANCE = 0.035;
const CRT_FLICKER_ALPHA = 0.02;
const CRT_FLICKER_ALPHA_VARIANCE = 0.035;
const CRT_ROLL_HEIGHT = 56;
const CRT_ROLL_ALPHA = 0.05;
const CRT_ROLL_SPEED = 0.032;
const CRT_SCANLINE_STEP_MS = 90;

const ORIENTATION = quaternionBetweenUnitVectors(
  [0, 0, 1],
  normalizeVector(SETTINGS.orientation.position)
);
const VIEW_Z_BASIS = [
  applyQuaternion([1, 0, 0], ORIENTATION)[2],
  applyQuaternion([0, 1, 0], ORIENTATION)[2],
  applyQuaternion([0, 0, 1], ORIENTATION)[2],
];

let logoMaskContext;
const logoPathCache = new Map();

const appendDotToPath = (context, x, y, dotRadius) => {
  context.moveTo(x + dotRadius, y);
  context.arc(x, y, dotRadius, 0, Math.PI * 2);
};

const buildRing = (samples, pointAt) => ({
  points: Array.from({ length: samples + 1 }, (_, index) => pointAt(index / samples)),
});

const createGlobeGeometry = () => {
  const samples = 160;
  const latitudes = Array.from({ length: SETTINGS.latitudeCount }, (_, index) => {
    const progress = (index + 1) / (SETTINGS.latitudeCount + 1);
    const phi = -Math.PI / 2 + progress * Math.PI;
    const y = Math.sin(phi);
    const radius = Math.cos(phi);

    return buildRing(samples, (step) => {
      const theta = step * Math.PI * 2;
      return [Math.cos(theta) * radius, y, Math.sin(theta) * radius];
    });
  });

  const meridians = Array.from({ length: SETTINGS.meridianCount }, (_, index) => {
    const theta = (index / SETTINGS.meridianCount) * Math.PI * 2;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    return buildRing(samples, (step) => {
      const phi = -Math.PI / 2 + step * Math.PI;
      const radius = Math.cos(phi);
      return [cosTheta * radius, Math.sin(phi), sinTheta * radius];
    });
  });

  return { latitudes, meridians };
};

const toScaledLinePoint = (point) =>
  multiplyVector(normalizeVector(point), GLOBE_RADIUS * LINE_SURFACE_SCALE);

const interpolateHorizonPoint = (from, to) => {
  const zDelta = to.z - from.z;
  const progress = Math.abs(zDelta) < 0.000001 ? 0.5 : (VISIBLE_HORIZON_Z - from.z) / zDelta;

  return toScaledLinePoint(lerpVectors(from.local, to.local, Math.min(1, Math.max(0, progress))));
};

const pathIsClosed = (points) =>
  points.length >= 3 && distanceBetweenSquared(points[0], points[points.length - 1]) < 0.00000001;

const getSegmentLength = (points) => {
  let length = 0;

  for (let index = 1; index < points.length; index += 1) {
    length += distanceBetween(points[index - 1], points[index]);
  }

  return length;
};

const appendVisibleSegment = (segments, points, closed) => {
  if (closed || getSegmentLength(points) >= MIN_VISIBLE_SEGMENT_LENGTH) {
    segments.push({ closed, points });
  }
};

const createVisibleLineSegments = (path) => {
  if (path.length < 2) return [];

  const closed = pathIsClosed(path);
  const basePoints = closed ? path.slice(0, -1) : path;
  const samples = basePoints.map((local) => {
    const z = applyQuaternion(local, ORIENTATION)[2];
    return { local, visible: z >= VISIBLE_HORIZON_Z, z };
  });

  if (samples.length < 2) return [];
  if (samples.every((sample) => sample.visible)) {
    return [{ closed, points: samples.map((sample) => toScaledLinePoint(sample.local)) }];
  }

  const segments = [];
  let current = [];
  const edgeCount = closed ? samples.length : samples.length - 1;

  for (let index = 0; index < edgeCount; index += 1) {
    const from = samples[index];
    const to = samples[(index + 1) % samples.length];

    if (from.visible && current.length === 0) current.push(toScaledLinePoint(from.local));

    if (from.visible && to.visible) {
      current.push(toScaledLinePoint(to.local));
      continue;
    }

    if (from.visible && !to.visible) {
      current.push(interpolateHorizonPoint(from, to));
      if (current.length >= 2) appendVisibleSegment(segments, current, false);
      current = [];
      continue;
    }

    if (!from.visible && to.visible) {
      current = [interpolateHorizonPoint(from, to), toScaledLinePoint(to.local)];
    }
  }

  if (current.length >= 2) appendVisibleSegment(segments, current, false);
  return segments;
};

const GEOMETRY = createGlobeGeometry();
const PROJECTED_LINE_SEGMENTS = [...GEOMETRY.latitudes, ...GEOMETRY.meridians].flatMap((path) =>
  createVisibleLineSegments(path.points).map((segment) => ({
    ...segment,
    points: segment.points.map((point) => applyQuaternion(point, ORIENTATION)),
  }))
);

const getBandEdgeRadius = (outerRadius, y) =>
  Math.sqrt(Math.max(0, outerRadius * outerRadius - y * y));

const getBandBounds = (band) => {
  const outerRadius = GLOBE_RADIUS + SETTINGS.bandDistance / 100;
  const centerY = band.position / 100;
  const halfWidth = band.width / 200;
  const minY = Math.max(-outerRadius + BAND_EDGE_PADDING, centerY - halfWidth);
  const maxY = Math.min(outerRadius - BAND_EDGE_PADDING, centerY + halfWidth);

  return maxY > minY ? { maxY, minY, outerRadius } : null;
};

const getBandHorizonRange = (outerRadius, y) => {
  const rowRadius = getBandEdgeRadius(outerRadius, y);
  const xContribution = VIEW_Z_BASIS[0] * rowRadius;
  const zContribution = VIEW_Z_BASIS[2] * rowRadius;
  const magnitude = Math.hypot(xContribution, zContribution);

  if (magnitude < 0.000001) return null;

  const threshold = (VISIBLE_HORIZON_Z - VIEW_Z_BASIS[1] * y) / magnitude;
  if (threshold >= 1) return null;

  const phase = Math.atan2(zContribution, xContribution);
  const alpha = threshold <= -1 ? Math.PI : Math.acos(Math.max(-1, Math.min(1, threshold)));

  return {
    end: phase + alpha,
    start: phase - alpha,
  };
};

const getBandPoint = (outerRadius, y, theta) => {
  const rowRadius = getBandEdgeRadius(outerRadius, y);
  return [Math.cos(theta) * rowRadius, y, Math.sin(theta) * rowRadius];
};

const sampleBandEdge = (outerRadius, y, fromTheta, toTheta) => {
  const sampleCount = Math.max(
    2,
    Math.ceil((BAND_SAMPLE_COUNT * Math.abs(toTheta - fromTheta)) / (Math.PI * 2))
  );

  return Array.from({ length: sampleCount + 1 }, (_, index) => {
    const progress = index / sampleCount;
    return getBandPoint(outerRadius, y, fromTheta + (toTheta - fromTheta) * progress);
  });
};

const sampleBandCap = (outerRadius, fromY, toY, edge) =>
  Array.from({ length: BAND_CAP_SAMPLE_COUNT + 1 }, (_, index) => {
    const progress = index / BAND_CAP_SAMPLE_COUNT;
    const y = fromY + (toY - fromY) * progress;
    const range = getBandHorizonRange(outerRadius, y);

    if (!range) return null;
    return getBandPoint(outerRadius, y, range[edge]);
  }).filter(Boolean);

const createVisibleBandSegments = (band) => {
  const bounds = getBandBounds(band);
  if (!bounds) return [];

  const { maxY, minY, outerRadius } = bounds;
  const topRange = getBandHorizonRange(outerRadius, maxY);
  const bottomRange = getBandHorizonRange(outerRadius, minY);
  if (!topRange || !bottomRange) return [];

  const top = sampleBandEdge(outerRadius, maxY, topRange.start, topRange.end);
  const endCap = sampleBandCap(outerRadius, maxY, minY, 'end');
  const bottom = sampleBandEdge(outerRadius, minY, bottomRange.end, bottomRange.start);
  const startCap = sampleBandCap(outerRadius, minY, maxY, 'start');

  return [{ points: [...top, ...endCap.slice(1), ...bottom.slice(1), ...startCap.slice(1)] }];
};

const PROJECTED_BAND_SEGMENTS = new Map(
  SETTINGS.bands.map((band) => [
    band.id,
    createVisibleBandSegments(band).map((segment) => ({
      points: segment.points.map((point) => applyQuaternion(point, ORIENTATION)),
    })),
  ])
);

const getBandDotMetrics = ({ bandHeight, outerRadius, radius }) => {
  const frameScale = radius / (SCENE_HEIGHT * SCREEN_RADIUS_RATIO);
  const dotDiameter = Math.max(
    BAND_DOT_MIN_DIAMETER_PX * frameScale,
    SETTINGS.bandDotSize * frameScale
  );
  const rowPitch = dotDiameter * BAND_DOT_ROW_PITCH_RATIO;
  const bandHeightPixels = Math.max(0, bandHeight * radius);
  const columnSpacingPixels = Math.max(
    BAND_DOT_MIN_COLUMN_SPACING_PX * frameScale,
    SETTINGS.bandColumnSpacing * frameScale
  );
  const circumferencePixels = Math.max(0, Math.PI * 2 * outerRadius * radius);

  return {
    columnCount: Math.max(
      BAND_DOT_MIN_COLUMNS,
      Math.min(BAND_DOT_MAX_COLUMNS, Math.round(circumferencePixels / columnSpacingPixels))
    ),
    dotRadius: dotDiameter / 2,
    rowCount: Math.max(1, Math.min(BAND_DOT_MAX_ROWS, Math.round(bandHeightPixels / rowPitch))),
  };
};

const getLogoMaskContext = () => {
  if (logoMaskContext !== undefined) return logoMaskContext;
  if (typeof document === 'undefined') {
    logoMaskContext = null;
    return logoMaskContext;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  logoMaskContext = canvas.getContext('2d', { willReadFrequently: true });
  return logoMaskContext;
};

const getLogoPaths = (logoId) => {
  const cached = logoPathCache.get(logoId);
  if (cached) return cached;
  if (typeof Path2D === 'undefined') return [];

  try {
    const paths = LOGO_ASSETS[logoId].paths.map((path) => new Path2D(path));
    logoPathCache.set(logoId, paths);
    return paths;
  } catch {
    logoPathCache.set(logoId, []);
    return [];
  }
};

const getCircularColumnDelta = (columnIndex, centerColumn, columnCount) => {
  let delta = columnIndex - centerColumn;
  const halfColumns = columnCount / 2;

  while (delta > halfColumns) delta -= columnCount;
  while (delta < -halfColumns) delta += columnCount;
  return delta;
};

const isDotInsideLogoMask = ({ grid, logo, dot }) => {
  const { columnCount, columnPitchPixels, rowCount, rowPitchPixels } = grid;
  if (!logo || rowCount < 2 || columnCount < 2 || columnPitchPixels <= 0) return false;

  const logoRows = Math.max(2, Math.min(rowCount, Math.round(rowCount * LOGO_HEIGHT_ROW_RATIO)));
  const firstLogoRow = Math.floor((rowCount - logoRows) / 2);
  const rowOffset = dot.rowIndex - firstLogoRow;
  if (rowOffset < 0 || rowOffset >= logoRows) return false;

  const asset = LOGO_ASSETS[logo.logoId];
  const maskContext = getLogoMaskContext();
  if (!asset || !maskContext) return false;

  const logoWidthColumns = Math.max(
    2,
    Math.min(
      columnCount * LOGO_MAX_COLUMN_RATIO,
      (logoRows * rowPitchPixels * asset.aspectRatio) / columnPitchPixels
    )
  );
  const centerColumn = ((100 - logo.position) / 100) * (columnCount / 2);
  const columnDelta = getCircularColumnDelta(dot.columnIndex, centerColumn, columnCount);
  if (Math.abs(columnDelta) > logoWidthColumns / 2) return false;

  const logoX = (0.5 - columnDelta / logoWidthColumns) * asset.width;
  const logoY = (1 - (rowOffset + 0.5) / logoRows) * asset.height;
  return getLogoPaths(logo.logoId).some((path) => maskContext.isPointInPath(path, logoX, logoY));
};

const createBandDotGrid = (band, centerX, centerY, radius) => {
  const bounds = getBandBounds(band);
  if (!bounds) return null;

  const { maxY, minY, outerRadius } = bounds;
  const bandHeight = maxY - minY;
  const { columnCount, dotRadius, rowCount } = getBandDotMetrics({
    bandHeight,
    outerRadius,
    radius,
  });
  const rowPitchPixels = (bandHeight * radius) / rowCount;
  const columnPitchPixels = (Math.PI * 2 * outerRadius * radius) / columnCount;
  const dots = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const y = minY + ((rowIndex + 0.5) / rowCount) * bandHeight;
    const rowRadius = getBandEdgeRadius(outerRadius, y);

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const theta = (columnIndex / columnCount) * Math.PI * 2;
      const projected = applyQuaternion(
        [Math.cos(theta) * rowRadius, y, Math.sin(theta) * rowRadius],
        ORIENTATION
      );

      if (projected[2] < VISIBLE_HORIZON_Z) continue;
      dots.push({
        columnIndex,
        rowIndex,
        x: centerX + projected[0] * radius,
        y: centerY - projected[1] * radius,
      });
    }
  }

  return {
    columnCount,
    columnPitchPixels,
    dotRadius,
    dots,
    rowCount,
    rowPitchPixels,
  };
};

const drawBandSegment = (context, segment, centerX, centerY, radius) => {
  context.beginPath();
  segment.points.forEach((point, index) => {
    const x = centerX + point[0] * radius;
    const y = centerY - point[1] * radius;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.closePath();
  context.fill();
};

const drawBandDots = (context, grid, logo) => {
  const logoDots = [];
  let hasWhiteDots = false;

  context.fillStyle = BAND_DOT_COLOR;
  context.beginPath();
  grid.dots.forEach((dot) => {
    if (isDotInsideLogoMask({ dot, grid, logo })) {
      logoDots.push(dot);
    } else {
      hasWhiteDots = true;
      appendDotToPath(context, dot.x, dot.y, grid.dotRadius);
    }
  });
  if (hasWhiteDots) context.fill();

  if (logoDots.length > 0) {
    context.fillStyle = LOGO_DOT_COLOR;
    context.beginPath();
    logoDots.forEach((dot) => appendDotToPath(context, dot.x, dot.y, grid.dotRadius));
    context.fill();
  }
};

const easeDefaultPositionSlowdown = (progress) => {
  const clamped = Math.min(1, Math.max(0, progress));
  const smoother = clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
  const inertiaProgress = Math.min(
    1,
    Math.max(
      0,
      (clamped - LOGO_LOOP_FINAL_INERTIA_START_PROGRESS) /
        (1 - LOGO_LOOP_FINAL_INERTIA_START_PROGRESS)
    )
  );
  const inertiaWeight =
    LOGO_LOOP_FINAL_INERTIA_BLEND * inertiaProgress * inertiaProgress * (3 - 2 * inertiaProgress);
  const lateInertia = 1 - (1 - clamped) * (1 - clamped);

  return smoother * (1 - inertiaWeight) + lateInertia * inertiaWeight;
};

const positiveModulo = (value, divisor) => ((value % divisor) + divisor) % divisor;

const getLogoLoopTiming = () => ({
  approachDurationMs: LOGO_LOOP_APPROACH_DURATION_MS / SETTINGS.logoSpeed,
  orbitDurationMs: LOGO_LOOP_ORBIT_DURATION_MS / SETTINGS.logoSpeed,
  staggerMs: LOGO_LOOP_STAGGER_MS / SETTINGS.logoSpeed,
});

const getLogoLoopPositionOffset = (cyclePhaseMs, orbitDurationMs) => {
  if (cyclePhaseMs >= orbitDurationMs) return 0;
  return easeDefaultPositionSlowdown(cyclePhaseMs / orbitDurationMs) * LOGO_LOOP_ORBIT_DISTANCE;
};

const getLoopingLogos = (elapsedMs) => {
  const timing = getLogoLoopTiming();
  const resetStartPhaseMs = timing.orbitDurationMs - timing.approachDurationMs;
  const cycleDurationMs = timing.orbitDurationMs + SETTINGS.logoHoldSeconds * 1000;

  return SETTINGS.logos.map((logo, index) => {
    const delayedElapsedMs = elapsedMs - Math.max(0, index) * timing.staggerMs;
    const cyclePhaseMs = positiveModulo(resetStartPhaseMs + delayedElapsedMs, cycleDurationMs);

    return {
      ...logo,
      position: logo.position + getLogoLoopPositionOffset(cyclePhaseMs, timing.orbitDurationMs),
    };
  });
};

const applyCrtEffect = (context, frameWidth, frameHeight, phaseMs) => {
  const phase = Number.isFinite(phaseMs) ? Math.max(0, phaseMs) : 0;
  const strength = SETTINGS.crtIntensity / 100;
  const softWave = 0.5 + 0.5 * Math.sin(phase * 0.031);
  const fastWave = 0.5 + 0.5 * Math.sin(phase * 0.083 + 1.7);
  const flickerWave = softWave * 0.75 + fastWave * 0.25;
  const flickerAlpha = (CRT_FLICKER_ALPHA + flickerWave * CRT_FLICKER_ALPHA_VARIANCE) * strength;
  const scanlineAlpha = (CRT_SCANLINE_ALPHA + softWave * CRT_SCANLINE_ALPHA_VARIANCE) * strength;
  const rollAlpha = CRT_ROLL_ALPHA * strength;
  const rollY = ((phase * CRT_ROLL_SPEED) % (frameHeight + CRT_ROLL_HEIGHT)) - CRT_ROLL_HEIGHT;
  const scanlineOffset = Math.floor(phase / CRT_SCANLINE_STEP_MS) % CRT_SCANLINE_SPACING;

  context.save();
  context.globalCompositeOperation = 'source-atop';
  context.fillStyle = `rgba(0, 0, 0, ${flickerAlpha})`;
  context.fillRect(0, 0, frameWidth, frameHeight);

  context.fillStyle = `rgba(0, 0, 0, ${scanlineAlpha})`;
  for (let y = scanlineOffset; y < frameHeight; y += CRT_SCANLINE_SPACING) {
    context.fillRect(0, y, frameWidth, CRT_SCANLINE_HEIGHT);
  }

  const rollEnd = rollY + CRT_ROLL_HEIGHT;
  if (rollEnd > 0 && rollY < frameHeight) {
    const gradient = context.createLinearGradient(0, rollY, 0, rollEnd);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.5, `rgba(0, 0, 0, ${rollAlpha})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(
      0,
      Math.max(0, rollY),
      frameWidth,
      Math.min(CRT_ROLL_HEIGHT, frameHeight - rollY)
    );
  }

  context.restore();
};

export const createGlobeRenderer = () => {
  let gridCache = null;

  return (context, frameWidth, frameHeight, { elapsedMs = 0, staticFrame = false } = {}) => {
    if (frameWidth <= 0 || frameHeight <= 0) return;

    const centerX = frameWidth / 2;
    const centerY = frameHeight / 2;
    const radius = Math.min(frameWidth, frameHeight) * SCREEN_RADIUS_RATIO;
    const cacheKey = `${frameWidth}:${frameHeight}`;

    if (gridCache?.key !== cacheKey) {
      gridCache = {
        grids: new Map(
          SETTINGS.bands.map((band) => [band.id, createBandDotGrid(band, centerX, centerY, radius)])
        ),
        key: cacheKey,
      };
    }

    const logos = staticFrame ? SETTINGS.logos : getLoopingLogos(elapsedMs);

    context.save();
    context.clearRect(0, 0, frameWidth, frameHeight);
    context.fillStyle = SETTINGS.background;
    context.fillRect(0, 0, frameWidth, frameHeight);

    context.fillStyle = SETTINGS.sphereColor;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fill();

    context.save();
    context.clip();
    context.strokeStyle = SETTINGS.lineColor;
    context.lineWidth = SETTINGS.lineWidth * (frameWidth / SCENE_WIDTH);
    context.lineCap = 'butt';
    context.lineJoin = 'round';

    PROJECTED_LINE_SEGMENTS.forEach((segment) => {
      context.beginPath();
      segment.points.forEach((point, index) => {
        const x = centerX + point[0] * radius;
        const y = centerY - point[1] * radius;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      if (segment.closed) context.closePath();
      context.stroke();
    });
    context.restore();

    if (SETTINGS.outline) {
      context.strokeStyle = SETTINGS.lineColor;
      context.lineWidth = SETTINGS.lineWidth * (frameWidth / SCENE_WIDTH);
      context.lineCap = 'butt';
      context.lineJoin = 'round';
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.stroke();
    }

    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius * BAND_CAP_RADIUS_RATIO, 0, Math.PI * 2);
    context.clip();

    context.fillStyle = SETTINGS.sphereColor;
    SETTINGS.bands.forEach((band) => {
      PROJECTED_BAND_SEGMENTS.get(band.id).forEach((segment) =>
        drawBandSegment(context, segment, centerX, centerY, radius)
      );
    });

    SETTINGS.bands.forEach((band) => {
      const grid = gridCache.grids.get(band.id);
      const logo = logos.find((candidate) => candidate.bandId === band.id);
      if (grid) drawBandDots(context, grid, logo);
    });
    context.restore();

    applyCrtEffect(context, frameWidth, frameHeight, staticFrame ? CRT_STATIC_PHASE_MS : elapsedMs);
    context.restore();
  };
};
