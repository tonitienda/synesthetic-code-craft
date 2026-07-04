# Motion Canvas Video Skill

Use this repo-local workflow when creating or extending a Motion Canvas video in this repository.

## Checklist

1. Add scenes in `src/scenes/` with focused names that include the video topic.
2. Add a project entry in `src/projects/` and include all scenes in playback order.
3. Add timestamped narration and visual direction in `src/videos/<slug>/script.md`.
4. Add `src/videos/<slug>/screenshots/README.md`; do not commit generated binary screenshots.
5. Add `start:<slug>`, `build:<slug>`, and when useful `screenshots:<slug>` npm scripts.
6. Update `README.md` with the new video, commands, and preview artifact workflow notes.
7. Run TypeScript/build checks before committing.

## Style notes

- Use high-contrast backgrounds and a small palette per video.
- Prefer visual metaphors and progressive disclosure over dense text.
- Keep scene timing aligned with the script timestamps.
