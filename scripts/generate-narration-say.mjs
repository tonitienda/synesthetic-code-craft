#!/usr/bin/env node

/**
 * Generate narration audio using macOS `say` command
 *
 * Usage:
 *   node scripts/generate-narration-say.mjs [--voice VOICE] [--rate RATE]
 *
 * Available voices: Alex, Victoria, Zara, etc.
 * Rate: 100-400 (default 150)
 *
 * Examples:
 *   node scripts/generate-narration-say.mjs
 *   node scripts/generate-narration-say.mjs --voice Victoria
 *   node scripts/generate-narration-say.mjs --rate 140
 */

import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

const NARRATIONS_FILE = "./src/videos/containers-toni/narrations.json"
const OUTPUT_DIR = "./public/narrations"

async function main() {
  const args = process.argv.slice(2)
  let voice = "Samantha" // Default voice
  let rate = 150 // Words per minute

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--voice" && i + 1 < args.length) {
      voice = args[i + 1]
      i++
    }
    if (args[i] === "--rate" && i + 1 < args.length) {
      rate = parseInt(args[i + 1])
      i++
    }
  }

  // Check if we're on macOS
  try {
    await execAsync("which say")
  } catch {
    console.error("❌ macOS 'say' command not found")
    console.error("   This script only works on macOS")
    process.exit(1)
  }

  console.log("🎤 Generating narration audio using macOS 'say'...")
  console.log(`📂 Output directory: ${OUTPUT_DIR}`)
  console.log(`🗣️  Voice: ${voice}`)
  console.log(`🎯 Rate: ${rate} wpm\n`)

  if (!fs.existsSync(NARRATIONS_FILE)) {
    console.error(`❌ Narrations file not found: ${NARRATIONS_FILE}`)
    process.exit(1)
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const narrations = JSON.parse(fs.readFileSync(NARRATIONS_FILE, "utf-8"))

  console.log(`Generating ${narrations.length} audio files...\n`)

  let successCount = 0
  let failCount = 0

  for (const narration of narrations) {
    const filename = `${narration.id}.wav`
    const filepath = path.join(OUTPUT_DIR, filename)
    const aiffPath = filepath.replace(/\.wav$/, ".aiff")

    try {
      // Use macOS say command to generate speech to AIFF (native format)
      // -o: output file
      // -v: voice
      // -r: speech rate (words per minute)
      const sayCommand = `say -o "${aiffPath}" -v "${voice}" -r ${rate} "${narration.text}"`
      await execAsync(sayCommand)

      // Convert AIFF to WAV using ffmpeg
      const ffmpegCommand = `ffmpeg -i "${aiffPath}" -c:a pcm_s16le "${filepath}" -y 2>/dev/null`
      await execAsync(ffmpegCommand)

      // Clean up AIFF file
      if (fs.existsSync(aiffPath)) {
        fs.unlinkSync(aiffPath)
      }

      // Verify WAV file was created
      if (fs.existsSync(filepath)) {
        const stats = fs.statSync(filepath)
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2)
        console.log(`✓ ${filename} (${sizeMB} MB)`)
        successCount++
      } else {
        console.log(`✗ ${filename} - Failed to create file`)
        failCount++
      }
    } catch (err) {
      // Clean up AIFF on error
      if (fs.existsSync(aiffPath)) {
        fs.unlinkSync(aiffPath)
      }
      console.log(`✗ ${filename} - Error: ${err.message}`)
      failCount++
    }
  }

  console.log(`\n✅ Generated ${successCount}/${narrations.length} audio files`)

  if (failCount > 0) {
    console.log(`⚠️  ${failCount} files failed`)
  }

  console.log(`\n🎙️  Audio files ready!`)
  console.log(`\n📝 Next step: Mux with video`)
  console.log(`   npm run audio:mux output/containers-image-to-running-process-toni.mp4`)
}

main().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})
