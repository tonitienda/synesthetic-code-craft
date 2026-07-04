# AGENTS.md

## Project purpose

This repository contains Motion Canvas videos for educational, YouTube-ready technical explanations. Keep each video self-contained enough that future humans and agents can find the scene entry point, supporting script, and preview assets quickly.

## Working conventions

- Prefer Motion Canvas scenes in `src/scenes/` and project entry points in `src/projects/`.
- For every new video, create a dedicated directory under `src/videos/<video-slug>/` with at least:
  - `script.md` containing timestamped narration and visual beats.
  - `screenshots/README.md` explaining where generated screenshot artifacts are produced.
  - optional notes/assets that are specific to that video.
- Add or update npm scripts in `package.json` for serving and building each new project.
- Update `README.md` when adding, renaming, or changing how to run a video.
- Do not commit binary screenshot/video exports; generate them into `artifacts/` and upload them from CI instead.
- Keep visuals legible at 16:9 presentation size: large text, high contrast, and restrained on-screen copy.
- Use consistent formatting with the existing codebase: TypeScript, TSX scenes, two-space indentation, and semicolons.
- Keep GitHub Actions on Node.js 24-compatible action/runtime versions; avoid reintroducing Node.js 20 action-runtime warnings.

## Testing expectations

Before committing code changes, run at least:

```bash
npm run build
```

If the change adds a video-specific build script, also run that script when practical. For preview changes, run the relevant `npm run screenshots:<slug>` command or the generic screenshot generator.
