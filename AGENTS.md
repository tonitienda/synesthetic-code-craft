# AGENTS.md

## Project purpose

This repository creates educational, YouTube-ready technical explanations with Motion Canvas.

The current workflow is Markdown-first:

```text
content source files → Motion Canvas implementation → rendered video
```

The goal is to produce useful videos, not to design a perfect framework. Earn every abstraction by using it in the first video.

## Core rule

Do not invent video structure directly in Motion Canvas.

Implement from the Markdown source files under:

```text
content/videos/<video-slug>/
```

For the current first test, use:

```text
content/videos/backpropagation/
```

## Phase gates

Follow the gated phase workflow described in:

```text
docs/phases.md
```

Each phase has one of two statuses:

```text
in-progress
ready
```

Only `ready` phases can be used as dependencies for later phases.

## Source priority

When implementing a scene or act, use ready sources in this order:

1. `06-implementation-plan.md` — concrete implementation plan, files to create/update, and components to reuse
2. `05-scene-timeline.md` — source of truth for visuals, components, timing intent, and narration references
3. `04-narration.md` — parseable narration segments and conceptual pacing
4. `03-beats.md` — story sequence and transitions
5. `02-treatment.md` — tone, audience, and conceptual goals
6. `01-research.md` — factual background
7. `00-specs.md` — overall video scope
8. `content/language/animation-spec-v0.md` — shared vocabulary for scene timeline components

## Implementation scope

Implement only the requested act or scene.

Do not implement future acts unless explicitly asked.

For the first implementation pass, focus on Act I only.

## Ambiguity rule

If the animation specification is ambiguous:

- choose the simplest interpretation that preserves the concept, or
- add a TODO comment explaining the ambiguity.

Do not add major new scenes, concepts, jokes, visual metaphors, or stylistic changes without explicit instruction.

## Working conventions

- Prefer Motion Canvas scenes in `src/scenes/` and project entry points in `src/projects/` unless the existing repo structure clearly uses a different convention.
- For every substantial video, keep a dedicated implementation directory under `src/videos/<video-slug>/`.
- Keep the content source under `content/videos/<video-slug>/` separate from the Motion Canvas implementation under `src/`.
- Add or update npm scripts in `package.json` for serving and building each new project.
- Update `README.md` when adding, renaming, or changing how to run a video.
- Do not commit binary screenshot/video exports; generate them into `artifacts/` and upload them from CI instead.

## Visual style

- dark background
- minimal geometry
- calm motion
- generous spacing
- high contrast
- restrained on-screen copy
- soft glow is acceptable
- avoid neon excess
- avoid crowded screens
- no hype aesthetics
- motion should explain the concept

## Motion implementation quality bar

- Do not collapse a ready scene timeline into static slide/title-card summaries.
- Preserve the approved duration budget unless the user explicitly asks for a shorter cut. A 7–10 minute timeline should remain in that range through scene holds, transitions, and readable diagram evolution.
- Each Motion Canvas scene should contain multiple visible states or transformations tied to the source moments, not just one fully composed diagram.
- Prefer paced reveals, diagram transformations, moving traces/tokens, and intentional holds over hard cuts between static compositions.

## Code style

- Use TypeScript and TSX scenes.
- Use two-space indentation and semicolons.
- Prefer reusable Motion Canvas components.
- Keep scene files readable.
- Keep timings easy to tune.
- Do not over-engineer abstractions before they are used.
- Make the animation understandable even before final TTS/audio is added.

## Testing expectations

Before committing code changes, run at least:

```bash
npm run build
```

If the change adds a video-specific build script, also run that script when practical.

For preview changes, run the relevant `npm run screenshots:<slug>` command or the generic screenshot generator when practical.

## Agent visual preview loop

- Use `docs/agent-motion-canvas-preview.md` when a task requires visual iteration on Motion Canvas scenes.
- While the Vite dev server is running, Motion Canvas Studio accepts `?ts=<seconds>`, `?time=<seconds>`, `?t=<seconds>`, or `?frame=<frame>` and seeks to that point through the repository-local agent preview plugin.
- For frame captures, prefer `npm run screenshot:frame -- <project-file> <seconds> <output.png>` when Chromium is available. Keep generated screenshots under `artifacts/screenshots/` and do not commit them.
