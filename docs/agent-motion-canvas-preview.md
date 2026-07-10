# Agent Motion Canvas preview loop

Motion Canvas Studio in this repository includes a small agent-preview plugin loaded by `vite.config.ts`.
It makes timestamp-based visual inspection possible without manually dragging the Studio timeline.

## URL timestamp navigation

When the dev server is running, open any project with one of these query parameters:

```text
http://localhost:9000/?ts=35
http://localhost:9000/?time=35
http://localhost:9000/?t=35
http://localhost:9000/?frame=2100
```

The plugin pauses playback, seeks the Motion Canvas player, renders the requested position, and keeps the URL updated with the current `frame` and `ts` as the timeline changes.

## Browser console helper

The plugin also exposes a small helper for debugging from the browser console:

```js
window.motionCanvasAgent.seek(35);
window.motionCanvasAgent.time();
window.motionCanvasAgent.frame();
window.motionCanvasAgent.duration();
```

This is intentionally lightweight and repository-local. It does not patch Motion Canvas packages in `node_modules`.

## CLI frame capture

Use the frame capture helper when a Chromium-compatible browser is installed locally:

```bash
npm run screenshot:frame -- src/projects/containers-image-to-running-process.ts 35 artifacts/screenshots/containers/035s.png
```

The helper starts Vite with `MOTION_CANVAS_PROJECT`, opens the Studio URL with `?ts=<seconds>`, and asks headless Chromium to write a PNG screenshot. If Chromium is not on `PATH`, set `CHROME=/path/to/chrome` or `CHROMIUM=/path/to/chromium`.

Screenshots belong under `artifacts/screenshots/` and should not be committed.

## Recommended agent loop

1. Start the relevant project with `npm run start:<video>` or let `npm run screenshot:frame -- ...` start Vite for a single capture.
2. Inspect the exact moment with `?ts=<seconds>` in Studio.
3. Capture before/after PNGs under `artifacts/screenshots/<slug>/` for visual review.
4. Adjust scene code, then repeat on the specific timestamp that changed.
