#!/usr/bin/env node

import fs from "fs";
import path from "path";
import {spawnSync} from "child_process";

function printUsage() {
  console.error(
    "Usage: node scripts/extract-narration-segment.mjs <json-file> <wav-file> <id> [output-dir]",
  );
  console.error("");
  console.error("Example:");
  console.error(
    "  node scripts/extract-narration-segment.mjs artifacts/narration/openai-cohesive/narrations-audio.json artifacts/narration/openai-cohesive/narration-master.wav intro_command",
  );
}

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function resolveOutputFile(segment, outputDir) {
  const configuredPath = typeof segment.path === "string" && segment.path.length > 0
    ? segment.path
    : `${segment.id}.wav`;

  return path.join(outputDir, path.basename(configuredPath));
}

function runFfmpeg(inputFile, outputFile, startMs, durationMs) {
  const args = [
    "-y",
    "-v",
    "error",
    "-ss",
    (startMs / 1000).toFixed(3),
    "-i",
    inputFile,
    "-t",
    (durationMs / 1000).toFixed(3),
    outputFile,
  ];

  const result = spawnSync("ffmpeg", args, {stdio: "inherit"});

  if (result.error) {
    fail(`failed to run ffmpeg: ${result.error.message}`);
  }

  if (result.status !== 0) {
    fail(`ffmpeg exited with status ${result.status}`);
  }
}

function main() {
  const [jsonFile, wavFile, segmentId, outputDirArg] = process.argv.slice(2);

  if (!jsonFile || !wavFile || !segmentId) {
    printUsage();
    process.exit(1);
  }

  if (!fs.existsSync(jsonFile)) {
    fail(`JSON file not found: ${jsonFile}`);
  }

  if (!fs.existsSync(wavFile)) {
    fail(`WAV file not found: ${wavFile}`);
  }

  let segments;
  try {
    segments = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
  } catch (error) {
    fail(`could not parse JSON file: ${error.message}`);
  }

  if (!Array.isArray(segments)) {
    fail("JSON file must contain an array of narration segments");
  }

  const segment = segments.find((entry) => entry?.id === segmentId);

  if (!segment) {
    fail(`no segment found for id: ${segmentId}`);
  }

  if (typeof segment.start !== "number" || Number.isNaN(segment.start)) {
    fail(`segment "${segmentId}" is missing a numeric start`);
  }

  if (typeof segment.duration !== "number" || Number.isNaN(segment.duration)) {
    fail(`segment "${segmentId}" is missing a numeric duration`);
  }

  if (segment.duration <= 0) {
    fail(`segment "${segmentId}" has duration ${segment.duration}; nothing to extract`);
  }

  const outputDir = outputDirArg || path.join(path.dirname(wavFile), "audio-manual");
  fs.mkdirSync(outputDir, {recursive: true});

  const outputFile = resolveOutputFile(segment, outputDir);
  runFfmpeg(wavFile, outputFile, segment.start, segment.duration);

  console.log(outputFile);
}

main();
