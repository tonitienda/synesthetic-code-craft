# OpenAI narration TTS workflow

Use this workflow when narration is split into stable `{id, text}` items and Motion Canvas should play one generated audio file per narration ID.

Generated audio and manifests should live under `artifacts/narration/`, which is ignored by Git.

## Input file

The expected input is a JSON array of narration objects:

```json
[
  {
    "id": "intro_command",
    "text": "If you've spent any time around Docker, you've almost certainly typed something like: docker run nginx."
  }
]
```

An object wrapper is also accepted when you want to keep global settings beside the narration list:

```json
{
  "settings": {
    "model": "gpt-4o-mini-tts",
    "voice": "marin",
    "format": "wav",
    "speed": 0.95,
    "tone": "Calm, precise, friendly technical explainer."
  },
  "narrations": [
    {
      "id": "intro_command",
      "text": "If you've spent any time around Docker, you've almost certainly typed something like: docker run nginx."
    }
  ]
}
```

IDs must be unique. The generated audio filename is based on the ID, for example `intro_command.wav`.

## Generate audio and manifest

```bash
OPENAI_API_KEY=... npm run narration:openai-tts -- path/to/narrations.json --out-dir artifacts/narration/my-video/audio --manifest artifacts/narration/my-video/narrations-audio.json
```

The script writes:

1. a directory of downloaded audio files, and
2. a manifest JSON mapping narration IDs to files and durations.

Example manifest:

```json
[
  {
    "id": "intro_command",
    "text": "If you've spent any time around Docker, you've almost certainly typed something like: docker run nginx.",
    "duration": 1.2,
    "path": "audio/intro_command.wav"
  }
]
```

The `path` value is relative to the manifest file location. This keeps the manifest portable when the containing narration folder moves.

Use `--dry-run` before spending API calls:

```bash
npm run narration:openai-tts -- path/to/narrations.json --dry-run
```

## Global settings

All settings apply to every narration item. You can keep them in `settings` in the JSON file or override them from the command line:

```bash
npm run narration:openai-tts -- path/to/narrations.json --voice marin --speed 0.95 --tone "Calm, precise, friendly." --dry-run
```

Supported command-line settings are `--model`, `--voice`, `--speed`, and `--tone`. The script defaults to WAV output because it reads WAV metadata to write accurate durations into the manifest.

## Cohesive full-pass generation

Use the cohesive generator when you want one more natural narration pass, but still need per-segment files for Motion Canvas timing work:

```bash
OPENAI_API_KEY=... npm run narration:openai-tts:cohesive -- path/to/narrations.json --out-dir artifacts/narration/my-video/audio --manifest artifacts/narration/my-video/narrations-audio.json --master artifacts/narration/my-video/narration-master.wav
```

This mode:

1. stitches all narration text into one multi-paragraph script,
2. generates one master WAV from OpenAI TTS,
3. writes the stitched text beside it,
4. tries to align paragraph boundaries from a transcription pass, and
5. splits the master WAV back into per-ID clips and a standard `narrations-audio.json` manifest.

If transcript alignment fails, the script falls back to duration-based splitting. That fallback works best when your input items already define `totalDuration` values, as in `src/videos/containers-toni/narrations.json`.

Use `--no-transcribe` when you explicitly want duration-only splitting:

```bash
OPENAI_API_KEY=... npm run narration:openai-tts:cohesive -- path/to/narrations.json --no-transcribe
```

Use the original `narration:openai-tts` script when you are still heavily iterating on timing and want each clip to be regenerated independently. Use the cohesive variant once prosody and whole-script flow matter more than per-line speed.
