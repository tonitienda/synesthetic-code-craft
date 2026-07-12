#!/usr/bin/env node

/**
 * Generate narration audio files from narrations.json
 *
 * This script uses the Web Speech API (via a headless browser) or espeak
 * to generate placeholder audio files for the narrations.
 *
 * Usage:
 *   node scripts/generate-narration-audio.mjs [--use-espeak]
 *
 * Output: audio files in public/narrations/
 */

import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

const NARRATIONS_FILE = "./src/videos/containers-toni/narrations.json"
const OUTPUT_DIR = "./public/narrations"

async function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }
}

async function generateAudioWithEspeak(text, filename) {
  const filepath = path.join(OUTPUT_DIR, filename)
  try {
    // Use espeak to generate audio
    const command = `espeak -w "${filepath}" "${text}"`
    await execAsync(command)
    console.log(`✓ Generated ${filename}`)
    return true
  } catch (err) {
    console.error(`✗ Failed to generate ${filename}: ${err.message}`)
    return false
  }
}

async function generateSilence(duration, filename) {
  // Generate silence using ffmpeg if available, otherwise create a simple audio file
  const filepath = path.join(OUTPUT_DIR, filename)
  try {
    const durationMs = Math.ceil(duration * 1000)
    const command = `ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t ${duration} -q:a 9 -acodec libmp3lame "${filepath}" -y`
    await execAsync(command)
    console.log(`✓ Generated silence ${filename}`)
    return true
  } catch (err) {
    // If ffmpeg not available, try with sox
    try {
      const command = `sox -n -r 44100 -b 16 -c 1 "${filepath}" trim 0 ${duration}`
      await execAsync(command)
      console.log(`✓ Generated silence ${filename} (sox)`)
      return true
    } catch (err2) {
      console.warn(`⚠ Could not generate silence for ${filename}, will use placeholder`)
      return false
    }
  }
}

async function main() {
  const useEspeak = process.argv.includes("--use-espeak")

  console.log("📝 Generating narration audio files...")
  console.log(`📂 Output directory: ${OUTPUT_DIR}`)

  if (!fs.existsSync(NARRATIONS_FILE)) {
    console.error(`✗ Narrations file not found: ${NARRATIONS_FILE}`)
    process.exit(1)
  }

  const narrations = JSON.parse(fs.readFileSync(NARRATIONS_FILE, "utf-8"))
  await ensureOutputDir()

  if (useEspeak) {
    console.log("\n🔊 Using espeak for text-to-speech...")
    for (const narration of narrations) {
      const filename = `${narration.id}.mp3`
      await generateAudioWithEspeak(narration.text, filename)
    }
  } else {
    console.log("\n⚠ Generating placeholder audio files...")
    console.log("   Use --use-espeak flag to generate actual audio:")
    console.log("   $ node scripts/generate-narration-audio.mjs --use-espeak")
    console.log("\n   Or install a TTS service and configure it in this script.")
    console.log("   (e.g., Google Cloud TTS, ElevenLabs, etc.)\n")

    // Generate placeholder audio files (silence matching the duration)
    for (const narration of narrations) {
      const filename = `${narration.id}.mp3`
      await generateSilence(narration.duration, filename)
    }
  }

  console.log("\n✓ Done! Audio files ready in " + OUTPUT_DIR)
  console.log("\n📌 Next step: Import the audio in the scene and test sync")
}

main().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})
