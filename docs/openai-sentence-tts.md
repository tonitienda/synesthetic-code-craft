# OpenAI sentence TTS workflow

Use this workflow when you have narration split into sentences and want one generated audio file per sentence. Motion Canvas can then play each file at the right moment.

Generated audio should live under `artifacts/narration/`, which is ignored by Git.

## Input file

Create a JSON file with either a plain list of sentences:

```json
[
  "Backpropagation starts with a prediction.",
  "Then it measures how wrong that prediction was."
]
```

Or use an object when you want one global set of voice settings in the same file:

```json
{
  "settings": {
    "model": "gpt-4o-mini-tts",
    "voice": "marin",
    "format": "mp3",
    "speed": 0.95,
    "tone": "Calm, precise, friendly technical explainer."
  },
  "sentences": [
    "Backpropagation starts with a prediction.",
    "Then it measures how wrong that prediction was."
  ]
}
```

Sentence objects are also accepted when you want stable output names:

```json
{
  "sentences": [
    {"id": "act1-001", "text": "Backpropagation starts with a prediction."}
  ]
}
```

## Generate audio

```bash
OPENAI_API_KEY=... npm run narration:openai-tts -- path/to/sentences.json --out-dir artifacts/narration/my-video
```

The script writes one file per sentence, for example:

```text
artifacts/narration/my-video/001-sentence-001.mp3
artifacts/narration/my-video/002-sentence-002.mp3
```

Use `--dry-run` before spending API calls:

```bash
npm run narration:openai-tts -- path/to/sentences.json --dry-run
```

## Global settings

All settings apply to every sentence. You can keep them in `settings` in the JSON file or override them from the command line:

```bash
npm run narration:openai-tts -- path/to/sentences.json --voice marin --speed 0.95 --tone "Calm, precise, friendly." --dry-run
```

Supported command-line settings are `--model`, `--voice`, `--format`, `--speed`, and `--tone`. The OpenAI speech API accepts `speed` values from `0.25` to `4.0`.
