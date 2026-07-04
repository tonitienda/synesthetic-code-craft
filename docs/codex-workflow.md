# Codex Workflow

This guide explains how Codex should implement videos in this repository.

Keep this process lightweight. The priority is to produce usable videos and learn from real implementation feedback.

## Before implementing a video or act

Read these files in order:

```text
AGENTS.md
content/README.md
content/language/animation-spec-v0.md
content/videos/<video-slug>/README.md
content/videos/<video-slug>/00-video.md
content/videos/<video-slug>/04-animation-spec.md
content/videos/<video-slug>/05-narration.md
```

If a video or act has a local implementation guide, read that too.

Example:

```text
content/videos/<video-slug>/act1-implementation.md
```

## Implementation loop

For each scene:

1. Read the relevant scene in `04-animation-spec.md`.
2. Check the matching narration in `05-narration.md`.
3. Implement the simplest Motion Canvas version that communicates the concept clearly.
4. Prefer reusable components only when a visual pattern appears more than once.
5. Run the relevant build command when practical.
6. Leave TODO comments for genuine ambiguities.

## Avoid premature framework work

Do not build generic infrastructure unless it directly helps the requested scene or act.

In particular, do not automatically:

- implement future acts
- build a generic animation compiler
- create a large DSL parser
- redesign the repo structure
- add complex visual systems before they are needed

## Review mindset

A first pass is successful if the idea is understandable.

Polish can come later.
