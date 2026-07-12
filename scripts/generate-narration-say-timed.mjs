#!/usr/bin/env node

/**
 * Generate narration audio using macOS `say` command with proper timing
 *
 * This script:
 * 1. Generates speech for each narration using `say`
 * 2. Pads each audio file with silence to match its specified duration
 * 3. All files are ready to concatenate in order
 *
 * Usage:
 *   node scripts/generate-narration-say-timed.mjs [--voice VOICE] [--rate RATE]
 *
 * Examples:
 *   node scripts/generate-narration-say-timed.mjs
 *   node scripts/generate-narration-say-timed.mjs --voice Victoria
 *   node scripts/generate-narration-say-timed.mjs --rate 140
 */

import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

const NARRATIONS_FILE = "./src/videos/containers-toni/narrations.json"
const OUTPUT_DIR = "./public/narrations"

/**
 * Get audio duration in seconds using ffprobe
 */
async function getAudioDuration(filepath) {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1:noprint_wrappers=1 "${filepath}"`,
    )
    return parseFloat(stdout.trim())
  } catch {
    return 0
  }
}

/**
 * Pad audio file with silence to reach target duration
 */
async function padAudioToLength(inputPath, outputPath, targetDuration) {
  const currentDuration = await getAudioDuration(inputPath)

  if (currentDuration >= targetDuration) {
    // Audio is long enough, just copy it
    fs.copyFileSync(inputPath, outputPath)
    return currentDuration
  }

  // Audio needs padding - use ffmpeg to pad with silence
  const paddingNeeded = targetDuration - currentDuration

  // Create a silent audio stream and concat
  const command = `ffmpeg -i "${inputPath}" -f lavfi -i anullsrc=r=44100:cl=mono:d=${paddingNeeded} -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" -c:a pcm_s16le "${outputPath}" -y 2>/dev/null`

  try {
    await execAsync(command)
    return targetDuration
  } catch (err) {
    console.error(`  Failed to pad audio: ${err.message}`)
    // Fallback: just copy the original
    fs.copyFileSync(inputPath, outputPath)
    return currentDuration
  }
}

async function main() {
  const args = process.argv.slice(2)
  let voice = "Alex"
  let rate = 160

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

  console.log("🎤 Generating narration audio with timing...")
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

  console.log(`Generating ${narrations.length} audio files with proper timing...\n`)

  let successCount = 0
  let failCount = 0
  let totalDuration = 0

  for (const narration of narrations) {
    const filename = `${narration.id}.wav`
    const filepath = path.join(OUTPUT_DIR, filename)
    const aiffPath = filepath.replace(/\.wav$/, ".aiff")
    const tempWavPath = filepath.replace(/\.wav$/, ".temp.wav")

    try {
      // Step 1: Generate speech using macOS say
      const sayCommand = `say -o "${aiffPath}" -v "${voice}" -r ${rate} "${narration.text}"`
      await execAsync(sayCommand)

      // Step 2: Convert AIFF to WAV
      const ffmpegCommand = `ffmpeg -i "${aiffPath}" -c:a pcm_s16le "${tempWavPath}" -y 2>/dev/null`
      await execAsync(ffmpegCommand)

      // Step 3: Check if audio is too long
      const speechDuration = await getAudioDuration(tempWavPath)
      const targetDuration = narration.duration

      if (speechDuration > targetDuration) {
        const overage = (speechDuration - targetDuration).toFixed(2)
        console.log(`⚠️  ${filename} AUDIO TOO LONG: ${speechDuration.toFixed(1)}s > ${targetDuration}s (+${overage}s)`)
        console.log(`     Text: "${narration.text}"`)
        console.log(`     → Consider shortening the text or increasing duration in narrations.json\n`)
      }

      // Pad to target duration
      const actualDuration = await padAudioToLength(tempWavPath, filepath, narration.duration)

      // Cleanup
      if (fs.existsSync(aiffPath)) fs.unlinkSync(aiffPath)
      if (fs.existsSync(tempWavPath)) fs.unlinkSync(tempWavPath)

      // Report
      const stats = fs.statSync(filepath)
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2)
      const durationStr = actualDuration.toFixed(1)

      if (speechDuration > targetDuration) {
        console.log(`✓ ${filename} (${sizeMB} MB, ${durationStr}s) [PADDED, was ${speechDuration.toFixed(1)}s]\n`)
      } else {
        console.log(`✓ ${filename} (${sizeMB} MB, ${durationStr}s)`)
      }

      successCount++
      totalDuration += actualDuration
    } catch (err) {
      // Cleanup on error
      if (fs.existsSync(aiffPath)) fs.unlinkSync(aiffPath)
      if (fs.existsSync(tempWavPath)) fs.unlinkSync(tempWavPath)

      console.log(`✗ ${filename} - Error: ${err.message}`)
      failCount++
    }
  }

  console.log(`\n✅ Generated ${successCount}/${narrations.length} audio files`)
  console.log(`⏱️  Total duration: ${(totalDuration / 60).toFixed(1)} minutes`)

  if (failCount > 0) {
    console.log(`⚠️  ${failCount} files failed`)
  }

  console.log(`\n🎙️  Audio files ready with proper timing!`)
  console.log(`\n📝 Next step: Mux with video`)
  console.log(`   npm run audio:mux output/containers-image-to-running-process-toni.mp4`)
}

main().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})
