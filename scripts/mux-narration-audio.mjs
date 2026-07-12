#!/usr/bin/env node

/**
 * Mux all narration audio files with a Motion Canvas video
 *
 * Usage:
 *   node scripts/mux-narration-audio.mjs input.mp4 [output.mp4]
 *
 * Example:
 *   node scripts/mux-narration-audio.mjs rendered_act01.mp4
 *   # Creates: rendered_act01-with-narration.mp4
 *
 *   node scripts/mux-narration-audio.mjs rendered_act01.mp4 final.mp4
 *   # Creates: final.mp4
 */

import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

const NARRATIONS_FILE = "./src/videos/containers-toni/narrations.json"
const AUDIO_DIR = "./public/narrations"

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error("❌ Usage: node scripts/mux-narration-audio.mjs <input.mp4> [output.mp4]")
    console.error("")
    console.error("Example:")
    console.error("  node scripts/mux-narration-audio.mjs rendered_act01.mp4")
    console.error("  # Creates: rendered_act01-with-narration.mp4")
    process.exit(1)
  }

  const inputVideo = args[0]
  const outputVideo = args[1] || inputVideo.replace(/\.mp4$/, "-with-narration.mp4")

  if (!fs.existsSync(inputVideo)) {
    console.error(`❌ Input video not found: ${inputVideo}`)
    process.exit(1)
  }

  if (!fs.existsSync(NARRATIONS_FILE)) {
    console.error(`❌ Narrations file not found: ${NARRATIONS_FILE}`)
    process.exit(1)
  }

  const narrations = JSON.parse(fs.readFileSync(NARRATIONS_FILE, "utf-8"))

  console.log("🎙️  Concatenating narration audio files...")
  console.log(`📽️  Input video: ${inputVideo}`)
  console.log(`📤 Output: ${outputVideo}`)

  // Create concat file for ffmpeg
  const concatFile = ".narration-concat.txt"
  const concatContent = narrations
    .map((n) => `file '${path.join(AUDIO_DIR, n.id)}.wav'`)
    .join("\n")

  fs.writeFileSync(concatFile, concatContent)

  try {
    // Step 1: Concatenate all audio files (to AAC format for MP4 compatibility)
    console.log("\n⏳ Step 1: Concatenating audio files...")
    const concatAudioFile = ".narration-audio-combined.m4a"
    const concatCmd = `ffmpeg -f concat -safe 0 -i ${concatFile} -c:a aac -q:a 5 ${concatAudioFile} -y`
    console.log(`   Running: ffmpeg -f concat -safe 0 -i <concat.txt> -c:a aac ...`)
    await execAsync(concatCmd)
    console.log("   ✓ Audio concatenated")

    // Step 2: Mux video + audio
    console.log("\n⏳ Step 2: Muxing video + audio...")
    const muxCmd = `ffmpeg -i ${inputVideo} -i ${concatAudioFile} -c:v copy -c:a copy -map 0:v:0 -map 1:a:0 -shortest ${outputVideo} -y`
    console.log(`   Running: ffmpeg -i <video> -i <audio> -c:v copy -c:a copy ...`)
    await execAsync(muxCmd)
    console.log("   ✓ Video muxed with audio")

    // Cleanup
    fs.unlinkSync(concatFile)
    fs.unlinkSync(concatAudioFile)

    console.log(`\n✅ Done! Output: ${outputVideo}`)
    console.log(`\n🎬 Play the video to check audio sync:`)
    console.log(`   open ${outputVideo}`)
  } catch (err) {
    console.error("\n❌ Error:", err.message)
    console.error("\n💡 Make sure you have ffmpeg installed:")
    console.error("   macOS: brew install ffmpeg")
    console.error("   Ubuntu: sudo apt-get install ffmpeg")
    console.error("   Windows: choco install ffmpeg")

    // Cleanup on error
    try {
      fs.unlinkSync(concatFile)
    } catch {}
    try {
      fs.unlinkSync(".narration-audio-combined.wav")
    } catch {}

    process.exit(1)
  }
}

main()
