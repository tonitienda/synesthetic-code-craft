# Narration Audio Sync Guide

This guide explains how to add audio narration to the Act-01 video and test sync timing.

## Quick Start

### 1. Generate Placeholder Audio (Silent)
Already done! Placeholder WAV files with correct durations are in `public/narrations/`.

These are silent files matching each narration's duration for timing tests only.

### 2. Add Real Audio (Choose One Option)

#### Option A: Use espeak (Free, Local, Fast)
```bash
npm run narrate:espeak
```

Pros:
- Runs instantly on your machine
- No API keys needed
- Generated audio is instant
- Good enough for sync testing

Cons:
- Robotic/synthesized voice quality
- Needs espeak installed (`brew install espeak` on Mac)

#### Option B: Use Google Cloud Text-to-Speech (High Quality, Free Tier)
1. Set up Google Cloud credentials:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/credentials.json"
   ```

2. Generate audio:
   ```bash
   npm run narrate:google-cloud
   ```

Pros:
- High-quality natural voice
- Free tier: 1M characters/month
- Professional sound

Cons:
- Requires Google Cloud setup
- Small latency for API calls

#### Option C: Use ElevenLabs (Best Quality, Affordable)
1. Sign up at https://elevenlabs.io and get API key

2. Set API key:
   ```bash
   export ELEVENLABS_API_KEY="your-api-key"
   ```

3. Generate audio:
   ```bash
   npm run narrate:elevenlabs
   ```

Pros:
- Best voice quality
- Multiple voice options
- Affordable ($5-100/month depending on usage)

Cons:
- Paid service
- Requires API key

### 3. Test Audio Sync

#### In Motion Canvas Preview
The preview doesn't play audio natively, but you can:

1. **Quick test**: Export one scene to MP4
2. **Use ffmpeg to add audio**:
   ```bash
   ffmpeg -i rendered_video.mp4 -i public/narrations/intro_command.wav \
     -c:v copy -c:a aac -shortest output.mp4
   ```

#### Full Video with Audio
1. Export the entire Act-01 video from Motion Canvas
2. Use this script to add all narration:
   ```bash
   npm run audio:mux-video -- input.mp4 output.mp4
   ```

### 4. Iterate

Once you have audio and video:
1. Watch the output video
2. If timing is off, adjust durations in `src/videos/containers-toni/narrations.json`
3. Re-generate audio if you changed text
4. Re-mux the video
5. Re-check

## File Structure

```
src/videos/containers-toni/
├── narrations.json           # All narration text + durations
└── scenes/
    └── Act-01-the-familiar-command.tsx
public/narrations/
├── intro_command.wav         # Generated audio files
├── pull_success.wav
└── ... (36 total)
scripts/
├── generate-narration-simple.mjs   # Generate placeholder audio
└── generate-narration-audio.mjs    # Generate real audio (espeak)
```

## Narration Timing Rules

Each narration has:
- **id**: Unique identifier
- **text**: The narration text to say
- **duration**: How long it should play (in seconds)

The duration is used for:
1. **Visual text fade**: How long the narration text appears on screen
2. **Audio length**: Target length for generated audio
3. **Timeline sync**: Motion Canvas waits for this duration

## Troubleshooting

### Audio too fast/slow
- Adjust `duration` in `narrations.json`
- Regenerate audio
- Re-test

### Audio cuts off mid-word
- Increase `duration` slightly
- Some TTS services add extra time at the end

### Audio doesn't play
- Check file exists in `public/narrations/`
- Check browser console for errors
- Verify file is valid WAV format

### espeak not found
```bash
# macOS
brew install espeak

# Ubuntu/Debian
sudo apt-get install espeak

# Windows
# Download from: https://espeak.sourceforge.net/
```

## For Production

When you're happy with the sync:
1. Export final video from Motion Canvas at full quality
2. Generate final audio with your chosen TTS service
3. Mux video + audio with ffmpeg
4. Upload to YouTube

## Next Steps

1. Choose a TTS option above
2. Generate audio: `npm run narrate:espeak` (or your choice)
3. Export video from Motion Canvas
4. Mux with ffmpeg and watch for sync
5. Iterate until happy
6. Upload final video with proper audio

Happy narrating! 🎙️
