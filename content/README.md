# Synesthetic Code Craft — Content Pipeline

This folder contains the source material used to generate educational videos.

The goal is to keep the creative structure separate from Motion Canvas implementation details.

## Pipeline

```text
Research
  ↓
Treatment
  ↓
Beat Sheet
  ↓
Animation Specification
  ↓
Narration
  ↓
Motion Canvas Implementation
  ↓
Rendered Video
```

## Folder structure

```text
content/
├── language/
│   └── animation-spec-v0.md
└── videos/
    └── backpropagation-basics/
        ├── README.md
        ├── 01-research.md
        ├── 02-treatment.md
        ├── 03-beats.md
        ├── 04-animation-spec.md
        ├── 05-narration.md
        └── 06-motion-canvas.md
```

## Philosophy

The animation specification is intentionally human-readable.

It should be detailed enough for an LLM or developer to translate into Motion Canvas, but not so rigid that writing it feels like programming.
