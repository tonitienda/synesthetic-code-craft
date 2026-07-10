#!/usr/bin/env node
import {mkdir} from 'node:fs/promises';
import {basename, dirname, resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';

const browserCandidates = [
  process.env.CHROME,
  process.env.CHROMIUM,
  'chromium',
  'chromium-browser',
  'google-chrome',
  'google-chrome-stable',
].filter(Boolean);

function usage() {
  console.error('Usage: node scripts/capture-motion-canvas-frame.mjs <project-file> <timestamp-seconds> [output.png]');
  console.error('Example: node scripts/capture-motion-canvas-frame.mjs src/projects/containers-image-to-running-process.ts 35 artifacts/screenshots/containers/035s.png');
}

function run(command, args, options = {}) {
  const child = spawn(command, args, {stdio: ['ignore', 'pipe', 'pipe'], ...options});
  return child;
}

async function findBrowser() {
  for (const candidate of browserCandidates) {
    const result = await new Promise(resolve => {
      const child = spawn(candidate, ['--version'], {stdio: 'ignore'});
      child.once('error', () => resolve(null));
      child.once('exit', code => resolve(code));
    });
    if (result === 0) return candidate;
  }
  return null;
}

async function waitForServer(port) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for Vite on port ${port}`);
}

const [projectFile, timestamp, outputArg] = process.argv.slice(2);
if (!projectFile || !timestamp) {
  usage();
  process.exit(1);
}

const seconds = Number(timestamp);
if (!Number.isFinite(seconds) || seconds < 0) {
  console.error(`Invalid timestamp: ${timestamp}`);
  process.exit(1);
}

const projectSlug = basename(projectFile).replace(/\.[cm]?[tj]s$/, '');
const output = resolve(outputArg ?? `artifacts/screenshots/${projectSlug}/${String(Math.round(seconds)).padStart(3, '0')}s.png`);
const browser = await findBrowser();
if (!browser) {
  console.error('No Chromium-compatible browser found. Install chromium or set CHROME=/path/to/chrome.');
  process.exit(1);
}

await mkdir(dirname(output), {recursive: true});
const port = Number(process.env.MOTION_CANVAS_PREVIEW_PORT ?? 9000);
if (!Number.isInteger(port) || port <= 0) {
  console.error(`Invalid MOTION_CANVAS_PREVIEW_PORT: ${process.env.MOTION_CANVAS_PREVIEW_PORT}`);
  process.exit(1);
}
const server = run('npx', ['vite', '--host', '127.0.0.1', '--port', String(port)], {
  env: {...process.env, MOTION_CANVAS_PROJECT: projectFile},
});
server.stdout.on('data', chunk => process.stdout.write(chunk));
server.stderr.on('data', chunk => process.stderr.write(chunk));

try {
  await waitForServer(port);
  const url = `http://127.0.0.1:${port}/?agentPreview=1&ts=${seconds}`;
  const capture = run(browser, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--window-size=1280,720',
    `--screenshot=${output}`,
    '--run-all-compositor-stages-before-draw',
    '--timeout=10000',
    '--virtual-time-budget=5000',
    url,
  ]);
  capture.stdout.on('data', chunk => process.stdout.write(chunk));
  capture.stderr.on('data', chunk => process.stderr.write(chunk));
  const [code] = await once(capture, 'exit');
  if (code !== 0) process.exit(code ?? 1);
  console.log(`Captured ${url} to ${output}`);
} finally {
  server.kill('SIGTERM');
}
