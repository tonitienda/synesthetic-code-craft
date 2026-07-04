#!/usr/bin/env node
import {mkdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {basename, join} from 'node:path';
import {deflateSync} from 'node:zlib';

const videos = process.argv.slice(2);

if (videos.length === 0) {
  console.error('Usage: node scripts/generate-video-screenshots.mjs <video-slug> [...]');
  process.exit(1);
}

const width = 1280;
const height = 720;
const previews = [
  {name: '01-opening.png', accent: [34, 211, 238], mode: 'perceptron'},
  {name: '02-depth.png', accent: [167, 139, 250], mode: 'network'},
  {name: '03-backprop.png', accent: [245, 158, 11], mode: 'backprop'},
];

function crc32(buffer) {
  let crc = -1;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function createCanvas(background = [7, 8, 20]) {
  return Array.from({length: height}, () => new Uint8Array(Array.from({length: width}, () => background).flat()));
}

function setPixel(canvas, x, y, color) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const offset = x * 3;
  canvas[y][offset] = color[0];
  canvas[y][offset + 1] = color[1];
  canvas[y][offset + 2] = color[2];
}

function fillRect(canvas, x0, y0, x1, y1, color) {
  for (let y = Math.max(0, y0); y < Math.min(height, y1); y += 1) {
    for (let x = Math.max(0, x0); x < Math.min(width, x1); x += 1) setPixel(canvas, x, y, color);
  }
}

function strokeRect(canvas, x0, y0, x1, y1, color, weight = 5) {
  fillRect(canvas, x0, y0, x1, y0 + weight, color);
  fillRect(canvas, x0, y1 - weight, x1, y1, color);
  fillRect(canvas, x0, y0, x0 + weight, y1, color);
  fillRect(canvas, x1 - weight, y0, x1, y1, color);
}

function circle(canvas, cx, cy, radius, fill, stroke) {
  for (let y = cy - radius - 8; y <= cy + radius + 8; y += 1) {
    for (let x = cx - radius - 8; x <= cx + radius + 8; x += 1) {
      const distance = (x - cx) ** 2 + (y - cy) ** 2;
      if (distance <= radius ** 2) setPixel(canvas, x, y, fill);
      if (stroke && distance > radius ** 2 && distance <= (radius + 7) ** 2) setPixel(canvas, x, y, stroke);
    }
  }
}

function line(canvas, x0, y0, x1, y1, color, weight = 5) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= steps; i += 1) {
    const x = Math.round(x0 + ((x1 - x0) * i) / steps);
    const y = Math.round(y0 + ((y1 - y0) * i) / steps);
    circle(canvas, x, y, weight, color);
  }
}

function writeWordMark(canvas, slug, accent) {
  const digest = createHash('sha256').update(slug).digest();
  const startX = 150;
  for (let i = 0; i < Math.min(slug.length, 24); i += 1) {
    const barHeight = 22 + (digest[i % digest.length] % 76);
    fillRect(canvas, startX + i * 34, 140 - barHeight, startX + i * 34 + 20, 140, accent);
  }
}

function renderPreview(slug, preview) {
  const canvas = createCanvas();
  fillRect(canvas, 70, 70, width - 70, height - 70, [16, 23, 42]);
  strokeRect(canvas, 70, 70, width - 70, height - 70, preview.accent, 6);
  writeWordMark(canvas, slug, preview.accent);

  if (preview.mode === 'perceptron') {
    for (const [index, y] of [260, 360, 460].entries()) {
      const color = [[34, 211, 238], [167, 139, 250], [245, 158, 11]][index];
      circle(canvas, 250, y, 34, [17, 24, 39], color);
      line(canvas, 292, y, 560, 360, color, 5);
    }
    circle(canvas, 640, 360, 72, [17, 24, 39], preview.accent);
    line(canvas, 760, 460, 1060, 250, preview.accent, 7);
  } else if (preview.mode === 'network') {
    const xs = [260, 470, 680, 890, 1080];
    const counts = [3, 4, 4, 3, 2];
    xs.forEach((x, layer) => {
      const nodes = Array.from({length: counts[layer]}, (_, i) => 360 + (i - (counts[layer] - 1) / 2) * 90);
      nodes.forEach(y => circle(canvas, x, Math.round(y), 30, [17, 24, 39], [[34, 211, 238], [167, 139, 250], [52, 211, 153], [251, 113, 133]][layer % 4]));
      if (layer < xs.length - 1) nodes.forEach(y => line(canvas, x + 38, Math.round(y), xs[layer + 1] - 38, 360, [51, 65, 85], 2));
    });
  } else {
    for (const [x, color] of [[250, [34, 211, 238]], [520, [167, 139, 250]], [790, [245, 158, 11]]]) circle(canvas, x, 330, 56, [17, 24, 39], color);
    fillRect(canvas, 980, 270, 1120, 390, [23, 37, 84]);
    strokeRect(canvas, 980, 270, 1120, 390, [16, 185, 129], 5);
    line(canvas, 310, 260, 1040, 260, [34, 211, 238], 7);
    line(canvas, 1040, 430, 310, 430, [245, 158, 11], 7);
    fillRect(canvas, 220, 540, 1060, 610, [17, 24, 39]);
    strokeRect(canvas, 220, 540, 1060, 610, [51, 65, 85], 4);
  }

  const raw = Buffer.concat(canvas.map(row => Buffer.concat([Buffer.from([0]), Buffer.from(row)])));
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    Buffer.from('\x89PNG\r\n\x1a\n', 'binary'),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, {level: 9})),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const video of videos) {
  const slug = basename(video);
  const outputDirectory = join('artifacts', 'screenshots', slug);
  await mkdir(outputDirectory, {recursive: true});
  for (const preview of previews) {
    await writeFile(join(outputDirectory, preview.name), renderPreview(slug, preview));
  }
  console.log(`Generated ${previews.length} screenshot previews for ${slug}`);
}
