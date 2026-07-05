# Docker containers: from image to running process

This folder contains the Markdown-first content phases for the video explaining how a Docker image becomes a running container process.

## Current phase status

| Phase | File | Status | Notes |
| --- | --- | --- | --- |
| Specs | `00-specs.md` | `ready` | Defines scope, audience, required concepts, and non-goals. |
| Research | `01-research.md` | `ready` | Collects source-backed concepts and accuracy guardrails. |
| Treatment | `02-treatment.md` | `ready` | Defines the seven-act explanatory arc. |
| Beats | `03-beats.md` | `ready` | Breaks the treatment into stable beat IDs for narration and scene-timeline references. |
| Narration | `04-narration.md` | `ready` | Parseable narration segments based on the ready beats. |
| Scene timeline | `05-scene-timeline.md` | `ready` | Visual timeline based on ready beats and narration. |
| Implementation plan | `06-implementation-plan.md` | `in-progress` | Draft Motion Canvas implementation plan based on the ready scene timeline. |

## Working notes for humans and agents

- Preserve the phase gate in `docs/phases.md`: later phases should only depend on files whose status is `ready`.
- Keep Docker as the audience-facing doorway, but do not turn the video into Docker Engine or OCI internals.
- Preserve the core mental model: `image -> runtime setup -> process with boundaries`.
- Preserve the final memory: `container = process + filesystem view + namespaces + cgroups`.
- Treat `docker commit` as optional and secondary; do not make it the final memory or imply it is the normal image-building workflow.
- When writing or revising narration, reference beat IDs from `03-beats.md` and preserve stable narration IDs from `04-narration.md` once downstream files reference them.
- When revising the scene timeline, keep acts as story-level containers and scenes as implementation units inside acts; scene groupings should remain tied to narration IDs and avoid Motion Canvas-only story structure.
