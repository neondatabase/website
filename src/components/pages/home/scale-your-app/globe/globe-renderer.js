import { BAND_RADIUS, LOGO_ASSETS, SCENE_HEIGHT, SPHERE_RADIUS } from './globe-artwork';
import { createGlobeGeometry } from './globe-geometry';

const ORBIT_MS = 1008;
const ORBIT_START_MS = ORBIT_MS - 304;
const LOOP_MS = ORBIT_MS + 3000;
const LOGO_STAGGER_MS = 336;
const STILL_PHASE_MS = 1280;
const ROLL_HEIGHT = 56;

const wrap = (value, period) => ((value % period) + period) % period;

const getLogoPosition = (band, elapsedMs) => {
  const phase = wrap(ORBIT_START_MS + elapsedMs - band.order * LOGO_STAGGER_MS, LOOP_MS);
  if (phase >= ORBIT_MS) return band.position;

  const progress = phase / ORBIT_MS;
  const ease = progress ** 3 * (progress * (progress * 6 - 15) + 10);
  const inertia = Math.max(0, (progress - 0.78) / 0.22);
  const weight = 0.35 * inertia ** 2 * (3 - 2 * inertia);
  const offset = ease * (1 - weight) + (1 - (1 - progress) ** 2) * weight;

  return band.position + offset * 200;
};

const createLogoMask = (context, band, geometry) => {
  const asset = LOGO_ASSETS[band.logo];
  const rasterScale = 4;
  const width = asset.width * rasterScale;
  const height = asset.height * rasterScale;
  context.canvas.width = width;
  context.canvas.height = height;
  context.scale(rasterScale, rasterScale);
  asset.paths.forEach((path) => context.fill(new Path2D(path)));

  const { data } = context.getImageData(0, 0, width, height);
  const alpha = new Uint8Array(width * height);
  for (let index = 0; index < alpha.length; index += 1) alpha[index] = data[index * 4 + 3];

  const rowCount = band.rows.length;
  const logoRows = Math.max(2, Math.min(rowCount, Math.round(rowCount * 0.74)));
  const centerRow = Math.floor((rowCount - logoRows) / 2) + logoRows / 2;
  const columnsPerRow = (band.rowPitch * (asset.width / asset.height)) / geometry.columnPitch;
  const visibleRows = Math.min(
    (logoRows * band.scale) / 100,
    centerRow * 2,
    (rowCount - centerRow) * 2,
    (geometry.columnCount * 0.48) / columnsPerRow
  );
  const firstRow = centerRow - visibleRows / 2;
  const rowOffsets = Int32Array.from(band.rows, (_, row) => {
    const offset = row + 0.5 - firstRow;
    if (offset < 0 || offset >= visibleRows) return -1;
    return Math.min(height - 1, Math.floor((1 - offset / visibleRows) * height)) * width;
  });

  return { alpha, width, rowOffsets, columns: visibleRows * columnsPerRow };
};

const appendDot = (context, x, y, radius) => {
  context.moveTo(x + radius, y);
  context.arc(x, y, radius, 0, Math.PI * 2);
};

const traceLine = (context, points) => {
  context.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index += 1) {
    const [x, y] = points[index];
    context.lineTo(x, y);
  }
};

const drawStaticGlobe = (context, { rings, bands, dotRadius }) => {
  context.strokeStyle = '#fff';
  context.lineWidth = 1.5 / (SCENE_HEIGHT * SPHERE_RADIUS);
  context.lineJoin = 'round';

  context.save();
  context.beginPath();
  context.arc(0, 0, 1, 0, Math.PI * 2);
  context.clip();
  rings.forEach(({ points, closed }) => {
    context.beginPath();
    traceLine(context, points);
    if (closed) context.closePath();
    context.stroke();
  });
  context.restore();

  context.beginPath();
  context.arc(0, 0, 1, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = '#000';
  bands.forEach(({ outlines }) => {
    outlines.forEach((points) => {
      context.beginPath();
      traceLine(context, points);
      context.closePath();
      context.fill();
    });
  });

  context.fillStyle = '#fff';
  bands.forEach(({ rows }) => {
    context.beginPath();
    rows.forEach((row) => {
      for (let index = 0; index < row.length; index += 3) {
        appendDot(context, row[index + 1], row[index + 2], dotRadius);
      }
    });
    context.fill();
  });
};

const drawLogoCutout = (context, { rows, mask }, position, columnCount, radius) => {
  const center = wrap(((100 - position) / 100) * (columnCount / 2), columnCount);
  const halfCircle = columnCount / 2;
  const halfLogo = mask.columns / 2;

  context.beginPath();
  rows.forEach((row, rowIndex) => {
    const offset = mask.rowOffsets[rowIndex];
    if (offset < 0) return;

    for (let index = 0; index < row.length; index += 3) {
      let delta = row[index] - center;
      if (delta > halfCircle) delta -= columnCount;
      else if (delta < -halfCircle) delta += columnCount;
      if (Math.abs(delta) > halfLogo) continue;

      const x = Math.min(mask.width - 1, Math.floor((0.5 - delta / mask.columns) * mask.width));
      if (mask.alpha[offset + x] >= 128) {
        appendDot(context, row[index + 1], row[index + 2], radius);
      }
    }
  });
  context.fill();
};

const sizeCanvas = (context, radius, extent, ratio) => {
  const { canvas } = context;
  const side = 2 * extent;
  const pixels = Math.ceil(side * ratio);
  canvas.width = pixels;
  canvas.height = pixels;
  canvas.style.width = `${side}px`;
  canvas.style.height = `${side}px`;
  const pixelsPerUnit = radius * (pixels / side);
  context.setTransform(pixelsPerUnit, 0, 0, pixelsPerUnit, pixels / 2, pixels / 2);
  return pixelsPerUnit;
};

export const createGlobeRenderer = (container, invalidate) => {
  const { ownerDocument } = container;
  const layer = (tag, style) => {
    const element = ownerDocument.createElement(tag);
    Object.assign(element.style, { position: 'absolute' }, style);
    return element;
  };

  const centered = { inset: '0', margin: 'auto' };
  const backdrop = layer('canvas', centered);
  const cutouts = layer('canvas', centered);
  const maskCanvas = ownerDocument.createElement('canvas');
  const backdropContext = backdrop.getContext('2d', { alpha: false });
  const cutoutContext = cutouts.getContext('2d');
  const maskContext = maskCanvas.getContext('2d', { willReadFrequently: true });
  if (!backdropContext || !cutoutContext || !maskContext) return null;

  const flicker = layer('div', { inset: '0', background: '#000' });
  const scanlines = layer('div', {
    inset: '0',
    backgroundImage: 'repeating-linear-gradient(#000 0 0.9px, transparent 0.9px 3px)',
  });
  const roll = layer('div', {
    top: '0',
    width: '100%',
    height: `${ROLL_HEIGHT}px`,
    opacity: '0.05',
    backgroundImage: 'linear-gradient(transparent, #000 50%, transparent)',
  });
  const canvases = [backdrop, cutouts];
  const layers = [...canvases, flicker, scanlines, roll];

  let scene;
  let raster;
  let frameHeight;
  let lastPositions;
  let lastScanlineOffset;

  const restore = () => {
    raster = null;
    invalidate?.();
  };
  canvases.forEach((canvas) => canvas.addEventListener('contextrestored', restore));

  const prepare = () => {
    const geometry = createGlobeGeometry();
    scene = {
      ...geometry,
      bands: geometry.bands.map((band) => ({
        ...band,
        mask: createLogoMask(maskContext, band, geometry),
      })),
    };
    maskCanvas.width = 0;
    maskCanvas.height = 0;
    container.append(...layers);
  };

  const resize = (width, height, devicePixelRatio) => {
    if (width <= 0 || height <= 0) return;
    if (!scene) prepare();

    const pixelRatio = Math.min(devicePixelRatio, 2);
    const radius = Math.min(width, height) * SPHERE_RADIUS;
    frameHeight = height;
    if (raster?.radius === radius && raster.pixelRatio === pixelRatio) return;

    const extent = Math.ceil(radius * BAND_RADIUS + 3);
    sizeCanvas(backdropContext, radius, extent, pixelRatio * 2);
    const cutoutScale = sizeCanvas(cutoutContext, radius, extent, pixelRatio);
    drawStaticGlobe(backdropContext, scene);
    cutoutContext.fillStyle = '#000';
    // Extend each cutout by a fraction of a pixel to cover the static dot's antialiased edge.
    raster = {
      radius,
      pixelRatio,
      halfSide: extent / radius,
      cutoutRadius: scene.dotRadius + 0.7 / cutoutScale,
    };
    lastPositions = null;
  };

  const draw = (elapsedMs, still) => {
    if (!raster) return;
    const positions = scene.bands.map((band) =>
      still ? band.position : getLogoPosition(band, elapsedMs)
    );

    if (!lastPositions || positions.some((position, index) => position !== lastPositions[index])) {
      const { halfSide, cutoutRadius } = raster;
      cutoutContext.clearRect(-halfSide, -halfSide, halfSide * 2, halfSide * 2);
      scene.bands.forEach((band, index) => {
        drawLogoCutout(cutoutContext, band, positions[index], scene.columnCount, cutoutRadius);
      });
      lastPositions = positions;
    }

    const phase = still ? STILL_PHASE_MS : elapsedMs;
    const wave = 0.5 + 0.5 * Math.sin(phase * 0.031);
    const fastWave = 0.5 + 0.5 * Math.sin(phase * 0.083 + 1.7);
    flicker.style.opacity = String(0.02 + (wave * 0.75 + fastWave * 0.25) * 0.035);
    scanlines.style.opacity = String(0.09 + wave * 0.035);
    const offset = Math.floor(phase / 90) % 3;
    if (offset !== lastScanlineOffset) {
      scanlines.style.backgroundPositionY = `${offset}px`;
      lastScanlineOffset = offset;
    }
    const rollY = ((phase * 0.032) % (frameHeight + ROLL_HEIGHT)) - ROLL_HEIGHT;
    roll.style.transform = `translateY(${rollY}px)`;
  };

  const destroy = () => {
    layers.forEach((element) => element.remove());
    canvases.forEach((canvas) => {
      canvas.removeEventListener('contextrestored', restore);
      canvas.width = 0;
      canvas.height = 0;
    });
  };

  return { resize, draw, destroy };
};
