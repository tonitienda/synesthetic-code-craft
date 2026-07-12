#!/usr/bin/env node

/**
 * Simple audio generation for narration testing
 *
 * This script generates placeholder audio matching the narration durations.
 * For production, replace with a professional TTS service (ElevenLabs, Google Cloud, AWS Polly, etc.)
 *
 * Quick start options:
 * 1. espeak (free, local) - generates robotic-sounding speech
 * 2. Google Cloud TTS - high quality, free tier available
 * 3. ElevenLabs API - best quality, affordable
 *
 * For now, this creates silent audio files with correct durations for timing tests.
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const NARRATIONS_FILE = path.join(__dirname, "../src/videos/containers-toni/narrations.json")
const OUTPUT_DIR = path.join(__dirname, "../public/narrations")

// Simple WAV file generator for silence (PCM format)
function generateSilenceWav(durationSeconds, sampleRate = 44100) {
  const numSamples = Math.round(durationSeconds * sampleRate)
  const bytesPerSample = 2 // 16-bit
  const numChannels = 1
  const dataSize = numSamples * bytesPerSample * numChannels

  const buffer = Buffer.alloc(44 + dataSize)

  // WAV header
  buffer.write("RIFF", 0)
  buffer.writeUInt32LE(36 + dataSize, 4)
  buffer.write("WAVE", 8)

  // fmt subchunk
  buffer.write("fmt ", 12)
  buffer.writeUInt32LE(16, 16) // Subchunk1Size
  buffer.writeUInt16LE(1, 20) // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22) // NumChannels
  buffer.writeUInt32LE(sampleRate, 24) // SampleRate
  buffer.writeUInt32LE(sampleRate * bytesPerSample * numChannels, 28) // ByteRate
  buffer.writeUInt16LE(bytesPerSample * numChannels, 32) // BlockAlign
  buffer.writeUInt16LE(16, 34) // BitsPerSample

  // data subchunk
  buffer.write("data", 36)
  buffer.writeUInt32LE(dataSize, 40)
  // Data is already silence (all zeros from Buffer.alloc)

  return buffer
}

async function main() {
  console.log("📝 Generating narration audio placeholders...")

  if (!fs.existsSync(NARRATIONS_FILE)) {
    console.error(`✗ Narrations file not found: ${NARRATIONS_FILE}`)
    process.exit(1)
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const narrations = JSON.parse(fs.readFileSync(NARRATIONS_FILE, "utf-8"))

  console.log(`\n📂 Generating ${narrations.length} audio files in ${OUTPUT_DIR}\n`)

  for (const narration of narrations) {
    const filename = `${narration.id}.wav`
    const filepath = path.join(OUTPUT_DIR, filename)

    try {
      const wavBuffer = generateSilenceWav(narration.duration)
      fs.writeFileSync(filepath, wavBuffer)
      console.log(`✓ ${filename} (${narration.duration}s)`)
    } catch (err) {
      console.error(`✗ Failed to generate ${filename}: ${err.message}`)
    }
  }

  console.log(`\n✓ Generated ${narrations.length} audio files`)
  console.log(`\n📋 Next steps:`)
  console.log(`   1. These are silent placeholders for timing tests`)
  console.log(`   2. To add real narration, choose a TTS service:`)
  console.log(`      - espeak: $ npm run narrate:espeak`)
  console.log(`      - Google Cloud: Set GOOGLE_APPLICATION_CREDENTIALS and run with --google-cloud`)
  console.log(`      - ElevenLabs: Set ELEVENLABS_API_KEY and run with --elevenlabs`)
  console.log(`   3. Once audio files are ready, rebuild the video`)
  console.log(`\n🎧 To test audio sync in the browser, modify the scene to load audio files`)
}

main().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})
