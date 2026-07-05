# Backpropagation

Working title:

**Backpropagation: How Neural Networks Learn From Mistakes**

This folder is the source of truth for the video.

The previous direct Motion Canvas attempt should be considered disposable. This version starts from structured Markdown files and only later translates them into Motion Canvas.

## Current scope

Only **Act I** is defined end to end.

The goal is to validate the workflow before expanding the full video.

## Pipeline

```text
00-video.md
  ↓
01-research.md
  ↓
02-treatment.md
  ↓
03-beats.md
  ↓
04-animation-spec.md
  ↓
05-narration.md
  ↓
06-codex-implementation.md
```

## Narration prototype

Use the timeline as a cheap content-debugging layer before generating or revising Motion Canvas animation.

```bash
npm run narration:backpropagation
```

This extracts `Narration:` cues from `04-timeline.md` and writes a macOS `say`-compatible file:

```text
artifacts/narration/backpropagation.say.txt
```

To listen immediately on macOS:

```bash
npm run narration:backpropagation:speak
```

To export an AIFF file for video editing or timing checks:

```bash
npm run narration:backpropagation:audio
```

Generated narration artifacts are written under `artifacts/`, which is ignored by Git.

The converter preserves the existing timeline style:

```md
Narration:
"A perceptron is a very simple artificial neuron."
```

and turns pauses into macOS `say` silence commands:

```text
[[slnc 2000]]
```

## Act I

Act I explains the perceptron:

- who introduced it
- what problem it tried to solve
- how a single artificial neuron works
- how weights affect decisions
- why changing weights is the seed of learning
- why a single perceptron is limited

Act I ends by preparing Act II:

> If one neuron can only draw a line, what happens if we connect many?
