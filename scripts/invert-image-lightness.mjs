// Inverts the lightness of a PNG while preserving hue and saturation, which turns a
// light-background graphic into a dark-background one without shifting brand colors.
// Transparent source pixels flatten to white in JPEG, so --flatten composites the
// result onto an opaque background first.
// Usage: node scripts/invert-image-lightness.mjs <input.png> <output.png> [--flatten RRGGBB]

import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync, deflateSync } from 'node:zlib';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const crcTable = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

const crc32 = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ -1) >>> 0;
};

const readChunks = (buf) => {
  if (!buf.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('not a PNG');
  const chunks = [];
  let offset = 8;
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + length);
    chunks.push({ type, data });
    offset += 12 + length;
  }
  return chunks;
};

const writeChunk = (type, data) => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
};

const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
};

const unfilter = (raw, width, height, bpp) => {
  const stride = width * bpp;
  const out = Buffer.alloc(stride * height);
  let pos = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[pos];
    pos += 1;
    const line = raw.subarray(pos, pos + stride);
    pos += stride;
    const outOffset = y * stride;
    const prevOffset = outOffset - stride;
    for (let x = 0; x < stride; x += 1) {
      const left = x >= bpp ? out[outOffset + x - bpp] : 0;
      const up = y > 0 ? out[prevOffset + x] : 0;
      const upLeft = y > 0 && x >= bpp ? out[prevOffset + x - bpp] : 0;
      let value = line[x];
      if (filter === 1) value += left;
      else if (filter === 2) value += up;
      else if (filter === 3) value += (left + up) >> 1;
      else if (filter === 4) value += paeth(left, up, upLeft);
      else if (filter !== 0) throw new Error(`unsupported filter ${filter}`);
      out[outOffset + x] = value & 0xff;
    }
  }
  return out;
};

const refilter = (pixels, width, height, bpp) => {
  const stride = width * bpp;
  const out = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    out[y * (stride + 1)] = 0;
    pixels.copy(out, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return out;
};

const invertLightness = (r, g, b) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
  }

  const newL = 1 - l;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * newL - 1));
  const c = (1 - Math.abs(2 * newL - 1)) * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = newL - c / 2;

  let rp = 0;
  let gp = 0;
  let bp = 0;
  const sector = Math.floor(((h % 6) + 6) % 6);
  if (sector === 0) [rp, gp, bp] = [c, x, 0];
  else if (sector === 1) [rp, gp, bp] = [x, c, 0];
  else if (sector === 2) [rp, gp, bp] = [0, c, x];
  else if (sector === 3) [rp, gp, bp] = [0, x, c];
  else if (sector === 4) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  const clamp = (v) => Math.max(0, Math.min(255, Math.round((v + m) * 255)));
  return [clamp(rp), clamp(gp), clamp(bp)];
};

const [, , inputPath, outputPath, ...rest] = process.argv;
if (!inputPath || !outputPath) {
  console.error(
    'Usage: node scripts/invert-image-lightness.mjs <input.png> <output.png> [--flatten RRGGBB]'
  );
  process.exit(1);
}

const flattenIndex = rest.indexOf('--flatten');
const flattenTo =
  flattenIndex === -1
    ? null
    : [0, 2, 4].map((i) => parseInt(rest[flattenIndex + 1].slice(i, i + 2), 16));

const chunks = readChunks(readFileSync(inputPath));
const ihdr = chunks.find((c) => c.type === 'IHDR');
const width = ihdr.data.readUInt32BE(0);
const height = ihdr.data.readUInt32BE(4);
const bitDepth = ihdr.data[8];
const colorType = ihdr.data[9];
const interlace = ihdr.data[12];

if (bitDepth !== 8 || ![2, 6].includes(colorType) || interlace !== 0) {
  throw new Error(`unsupported PNG: depth ${bitDepth}, colorType ${colorType}, interlace ${interlace}`);
}

const bpp = colorType === 6 ? 4 : 3;
const idat = Buffer.concat(chunks.filter((c) => c.type === 'IDAT').map((c) => c.data));
const pixels = unfilter(inflateSync(idat), width, height, bpp);

for (let i = 0; i < pixels.length; i += bpp) {
  const [r, g, b] = invertLightness(pixels[i], pixels[i + 1], pixels[i + 2]);
  pixels[i] = r;
  pixels[i + 1] = g;
  pixels[i + 2] = b;
}

let outPixels = pixels;
let outHeader = ihdr.data;
let outBpp = bpp;

if (flattenTo && bpp === 4) {
  outBpp = 3;
  outPixels = Buffer.alloc(width * height * 3);
  for (let p = 0; p < width * height; p += 1) {
    const alpha = pixels[p * 4 + 3] / 255;
    for (let c = 0; c < 3; c += 1) {
      outPixels[p * 3 + c] = Math.round(pixels[p * 4 + c] * alpha + flattenTo[c] * (1 - alpha));
    }
  }
  outHeader = Buffer.from(ihdr.data);
  outHeader[9] = 2;
}

const out = Buffer.concat([
  PNG_SIGNATURE,
  writeChunk('IHDR', outHeader),
  writeChunk('IDAT', deflateSync(refilter(outPixels, width, height, outBpp), { level: 9 })),
  writeChunk('IEND', Buffer.alloc(0)),
]);

writeFileSync(outputPath, out);
console.log(`wrote ${outputPath} (${width}x${height})`);
