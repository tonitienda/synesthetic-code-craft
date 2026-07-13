# Synesthetic Code Craft — Content Pipeline

This folder contains the source material used to generate educational videos.

The goal is to keep the creative structure separate from Motion Canvas implementation details.

## Pipeline

```text
Specs
  ↓
Research
  ↓
Treatment
  ↓
Beats
  ↓
Narration
  ↓
Scene Timeline
  ↓
Implementation Plan
  ↓
Motion Canvas Implementation
  ↓
Rendered Video
```

Each content phase is gated by human approval. See:

```text
docs/phases.md
```

## Idea backlog

Potential future topics are collected in [`future-video-ideas.md`](future-video-ideas.md). Treat this file as an idea backlog only: before implementation, promote a selected idea into its own `content/videos/<video-slug>/` folder and move it through the phase gates.

## Active early-stage videos

- [`videos/rocket-science-really-is-rocket-science/`](videos/rocket-science-really-is-rocket-science/) — specs and research for a beginner launch-physics video focused on escape velocity, the rocket equation, payload mass cascade, engine impulse, gravity turn, and staging.

## Folder structure

```text
content/
├── language/
│   └── animation-spec-v0.md
└── videos/
    └── <video-slug>/
        ├── 00-specs.md
        ├── 01-research.md
        ├── 02-treatment.md
        ├── 03-beats.md
        ├── 04-narration.md
        ├── 05-scene-timeline.md
        └── 06-implementation-plan.md
```

## Philosophy

The scene timeline is intentionally human-readable.

It should be detailed enough for an LLM or developer to translate into Motion Canvas, but not so rigid that writing it feels like programming.

The shared animation language should prefer reusable high-level components such as `SplashScreen`, `TitleCard`, `Perceptron`, `NeuralNet`, and `Graph2D` before falling back to low-level shape commands.
