# Codex Workflow

This guide explains how Codex should implement videos in this repository.

Keep this process lightweight. The priority is to produce the first usable video and learn from the result.

## Current target

Implement Act I of:

```text
content/videos/backpropagation/
```

## Before implementing

Read these files in order:

```text
AGENTS.md
content/videos/backpropagation/README.md
content/videos/backpropagation/00-video.md
content/videos/backpropagation/04-animation-spec.md
content/videos/backpropagation/05-narration.md
```

## Implementation loop

For each scene:

1. Read the relevant scene in `04-animation-spec.md`.
2. Check the matching narration in `05-narration.md`.
3. Implement the simplest Motion Canvas version that communicates the concept clearly.
4. Prefer reusable components only when a visual pattern appears more than once.
5. Run the relevant build command when practical.
6. Leave TODO comments for genuine ambiguities.

## Do not do this yet

- Do not implement the full backpropagation video.
- Do not implement Acts II–VII.
- Do not build a generic animation compiler.
- Do not create a large DSL parser.
- Do not redesign the repo structure.
- Do not add complex visual systems unless Act I needs them.

## Good first Codex task

```text
Implement Act I of the backpropagation video from the Markdown source files.

Use content/videos/backpropagation/04-animation-spec.md as the source of truth.
Use content/videos/backpropagation/05-narration.md for pacing.
Keep the implementation minimal and readable.
Create reusable components only for repeated concepts such as Neuron, Connection, Signal, and DecisionBoundaryGraph.
Do not implement future acts.
```

## Review mindset

A first pass is successful if the idea is understandable.

Polish can come later.
