#!/usr/bin/env node

/**
 * Debug narration audio setup
 * Checks if all audio files exist and are valid
 */

import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

const NARRATIONS_FILE = "./src/videos/containers-toni/narrations.json"
const AUDIO_DIR = "./public/narrations"

async function main() {
  console.log("🔍 Debugging narration audio setup...\n")

  // Check if narrations file exists
  if (!fs.existsSync(NARRATIONS_FILE)) {
    console.error(`❌ Narrations file not found: ${NARRATIONS_FILE}`)
    process.exit(1)
  }

  const narrations = JSON.parse(fs.readFileSync(NARRATIONS_FILE, "utf-8"))
  console.log(`📋 Found ${narrations.length} narrations\n`)

  // Check if audio directory exists
  if (!fs.existsSync(AUDIO_DIR)) {
    console.error(`❌ Audio directory not found: ${AUDIO_DIR}`)
    console.error("   Run: npm run narrate:generate")
    process.exit(1)
  }

  console.log(`📂 Checking audio files in ${AUDIO_DIR}...\n`)

  let totalDuration = 0
  let missingFiles = 0
  let validFiles = 0

  for (const narration of narrations) {
    const filename = `${narration.id}.wav`
    const filepath = path.join(AUDIO_DIR, filename)

    if (!fs.existsSync(filepath)) {
      console.log(`❌ ${filename} - MISSING`)
      missingFiles++
    } else {
      const stats = fs.statSync(filepath)
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2)
      console.log(`✓ ${filename} - ${sizeMB} MB (${narration.duration}s)`)
      totalDuration += narration.duration
      validFiles++
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Valid files: ${validFiles}/${narrations.length}`)
  console.log(`   Missing files: ${missingFiles}`)
  console.log(`   Total audio duration: ${totalDuration}s (${(totalDuration / 60).toFixed(1)} min)`)

  if (missingFiles > 0) {
    console.error(`\n❌ Missing ${missingFiles} audio files!`)
    console.error("   Run: npm run narrate:generate")
    process.exit(1)
  }

  // Test ffmpeg
  console.log(`\n🔧 Checking ffmpeg...`)
  try {
    const { stdout } = await execAsync("ffmpeg -version | head -n 1")
    console.log(`✓ ffmpeg: ${stdout.trim()}`)
  } catch (err) {
    console.error(`❌ ffmpeg not found!`)
    console.error("   Install with: brew install ffmpeg")
    process.exit(1)
  }

  // Try to concatenate audio files
  console.log(`\n📦 Testing audio concatenation...`)
  const concatFile = ".narration-concat-test.txt"
  const concatContent = narrations.map((n) => `file '${path.join(AUDIO_DIR, n.id)}.wav'`).join("\n")
  fs.writeFileSync(concatFile, concatContent)

  try {
    const testAudioFile = ".narration-audio-test.wav"
    const concatCmd = `ffmpeg -f concat -safe 0 -i ${concatFile} -c:a pcm_s16le ${testAudioFile} -y 2>&1 | grep -E "Duration|error"`
    const { stdout, stderr } = await execAsync(concatCmd)
    console.log(`✓ Concatenation successful`)

    if (fs.existsSync(testAudioFile)) {
      const stats = fs.statSync(testAudioFile)
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2)
      console.log(`  Output: ${sizeMB} MB`)
      fs.unlinkSync(testAudioFile)
    }
  } catch (err) {
    console.error(`❌ Concatenation failed!`)
    console.error(`   ${err.message}`)
  }

  fs.unlinkSync(concatFile)

  console.log(`\n✅ Audio setup looks good!`)
  console.log(`\n🚀 To mux with video:`)
  console.log(`   npm run audio:mux output/containers-image-to-running-process-toni.mp4`)
}

main().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})
