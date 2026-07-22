---
name: rich-motion-language
description: Physical motion vocabulary for Synesthetic Code Craft videos — how to make Motion Canvas scenes feel materially alive and continuous instead of like slides. Use when enriching any video's motion (containers, backprop, LLMs, git, ...).
---

# Rich Motion Language

A reusable system for giving every video a **coherent physical motion language**. The
job is never "add effects everywhere" — it is to make each animation *mean* something
and to keep objects alive and continuous across transitions. Derived from the containers
video brief (`content/videos/containers-image-to-running-process/08-rich-motion-implementation.md`)
and implemented as reusable helpers in **`src/choreography/richMotion.tsx`**.

The material, shape, physics, and dimensional-rendering experiments live under
**`src/videos/showcase-experiments/`**. Treat their conclusions below as project
defaults, not as a requirement to reuse every experimental implementation.

## The rule that governs everything

> Every rich animation must reinforce a concept. If an effect does not communicate
> meaning, cut it.

Avoid: generic particle clouds, realistic smoke, constant ambient wobble, bloom
everywhere, making every box bounce or turn to jelly, permanent floating on static
elements.

## 1. Give each kind of thing a material identity

Assign every recurring object a consistent physical behaviour, then never break it:

| Thing | Behaves like | Motion signature |
|---|---|---|
| Packaged data (an image, a tensor, a commit) | dense packaged material | falls, squashes, settles with elastic overshoot |
| Storage (registry, repo, memory) | rigid storage under pressure | reacts only when queried; compresses + recoils; never idles |
| Host / runtime surface | a receptive active surface | absorbs impacts (ripple + border flash + shallow depress) |
| Writable / mutable layers | flexible membranes | spread from a bead, overshoot, dimple on contact |
| Processes / live state | living energy | **breathing light** (see below), ignites on start |
| Reads / writes / pulls / gradients | directional flows | curved ribbons and labelled packets |
| The foundation (kernel, base case, main branch) | heavy ground | the least reactive element in the frame |

The metaphors transfer: for backprop, the *loss* is the active surface, *gradients* are
directional flows, *weights* are the packaged material that gets nudged.

## Lessons from the material and shape experiments

### Material identity is behaviour first, surface treatment second

- Viewers read mass, elasticity, adhesion, and responsiveness primarily from motion.
  Texture, gradients, and highlights support that identity but cannot rescue generic
  movement.
- Combine materials inside one coherent object: a structural base plus a membrane,
  coating, inset, illuminated core, or edge treatment. Two unrelated rectangles stacked
  together do not read as a material combination.
- Use a consistent light direction across the visual system. The current default is a
  soft upper-left key, a restrained cool rim, and a darker lower-right falloff.
- Glossy Bubble/Gel surfaces use a broad **curved specular arc**, a small secondary glint,
  and a directional lowlight. Avoid large circular white spots: they look pasted on.
- Keep highlights near a surface edge and away from important copy. Highlights describe
  curvature; they are not decoration and should not become permanent animated sweeps.

### Prefer 2.5D for the project’s illustrated technical language

The rocket comparison established this default order:

1. **2D diagram** — use when topology, labels, and state changes carry the idea.
2. **2.5D vector object** — use when volume helps recognition but the object should remain
   aligned with the rest of the Motion Canvas language.
3. **True 3D hero object** — use only when perspective, occlusion, or spatial rotation is
   itself explanatory and a 2.5D comparison has shown a material benefit.

Three.js produces more realistic volume and lighting, but realism alone is not a reason to
use it. For this project, the 2.5D rocket is more stylistically coherent than the Three.js
rocket. Default to the 2.5D version unless the shot needs to teach spatial construction,
orientation, or hidden geometry.

Build convincing 2.5D objects with:

- one continuous outer silhouette instead of a rectangle plus a detached triangle;
- overlapping front/side planes and clear occlusion order;
- elliptical rims or cross-sections where cylinders must read as round;
- attached fins, pipes, nozzles, and joints that share contours with the main body;
- two or three restrained value bands from the shared light direction;
- small perspective asymmetry rather than arbitrary rotation.

If true 3D is approved, keep it hybrid: render only the hero object in Three.js and retain
Motion Canvas for labels, paths, particles, transitions, and timing. Motion Canvas signals
must drive all Three.js transforms and lights; never start an independent
`requestAnimationFrame` loop.

### Use simulation selectively

- Matter.js is useful for gravity, impacts, collisions, stacking, and rigid-body momentum
  when physical uncertainty reinforces the concept.
- It is not the default for semantic UI motion or exact layout. Simulated rotation and
  rebound can make a component feel careless when the scene needs a precise landing.
- Bubble split/join is authored rather than simulated: stretch, show an adhesion bridge,
  overshoot once, recoil once, then settle at the exact target with zero rotation. This
  reads stickier than an underdamped rigid-body constraint.
- When Matter.js is appropriate, precompute a fixed-step timeline (currently 60 Hz) and
  sample it from Motion Canvas. Matter must not own playback or rendering.
- Curved connectors are the project default. Angular elbows imply routing or circuitry and
  should be used only when that meaning is intentional.

## 2. The five motion families

Compose scenes from these, consistently:

1. **Elastic settling** — entering, assembling, attaching, landing (`easeOutBack`).
2. **Pressure ripples** — one system reacting to another.
3. **Flow paths / ribbons** — pulling, reading, writing, propagating.
4. **Breathing light** — a live thing is alive because its *outline pulses between two
   shades*, never because it scales. (Scaling reads as shimmer and nudges neighbours —
   this is a hard project preference.)
5. **Morphing** — preserve identity between related states instead of fade-out + fade-in.

## 3. Prefer semantic helpers over raw tween chains

Do **not** scatter long `chain(...)` tweens across every scene. Call helpers whose names
say what is happening. The current toolkit (`src/choreography/richMotion.tsx`, exported
from `src/choreography`):

- **`breathe(node, {from, to, period})`** → returns a cancellable loop. A live outline
  pulse. `const h = yield breathe(...)`; later `cancel(h)` and reset the stroke.
- **`impact({overlay, at, color, size?, surface?, settleNode?, depress?})`** → the
  *receiving surface's* half of a landing: one expanding ring + optional border flash +
  optional shallow depress. The moving object's squash/stretch is choreographed by the
  caller. Also reusable as a one-shot "ignition ring."
- **`transferRibbon({overlay, from, to, color, width?, duration?, curve?})`** → a curved
  ribbon that draws on origin→destination, tapers, then dissolves tail→head. The source
  is never touched, so a pull reads as **copy, not move**.
- **`spreadLayer({layer, finalWidth, finalHeight, below?, duration?})`** → a membrane:
  beads at centre, spreads sideways, rises to full height with a small overshoot while
  the layer below is briefly pressed. Lands on **exact** final geometry.
- **`flowSignal({overlay, from, to, label, color, absorb?, releaseSource?, path?,
  morphTo?, morphText?})`** → a directional read/write. Labelled packet travels a thin
  curved path; source releases (brighten), target absorbs (glow-mix + dimple). If
  `morphTo` is set the packet does **not** fade — it morphs into that node.
- **`morphInto({packet, target, color, newText?})`** → reshape a traveling packet into an
  already-placed (opacity-0) target: match its world position/size/colours, swap text at
  the least-disruptive moment, then reveal the target and drop the packet the same frame.
- **`createLabeledPacket(text, color)`** → `{node, label}` monospace packet.

Keep new helpers small, composable, and generator-based. Don't build a speculative
physics framework — add only what the current video needs.

## 4. Object continuity (the highest-value principle)

Transform, move, split, or morph existing objects instead of deleting one and fading in an
unrelated replacement:

- A write packet **becomes** the resulting file chip (`flowSignal({morphTo})`).
- A pulled artifact stays visually connected to its source (`transferRibbon`, source kept).
- A closing formula is **assembled from objects already shown**, then recombined — a
  reversible visual argument (`whole ⇄ term + term + term`).

When two nodes live under different parents, morph via the overlay and match world-space
position, size, colour, and timing (see coordinate rule below).

## 5. Keep looping effects cancellable

Any `Infinity` loop must return/store a handle and be cancelled (and its property reset)
before the node changes semantic state or leaves the scene. Never leave a loop attached to
a removed node. Idle "breathing" resets **colour**, not scale.

## Technical constraints (learned the hard way)

- **Coordinate spaces.** Overlay panels are non-layout, center-origin. `absolutePosition()`
  returns a *different* space (~+(halfW, halfH)). For overlay transfers, pass
  `node.absolutePosition()` in and pin temporary nodes with `absolutePosition` — never feed
  absolute values into a layout child's local `position()`/`.x()`. Pick one space per
  parent and stay in it. (All `richMotion` helpers already do this.)
- **Recompute positions at animation time** when the destination is animating concurrently;
  don't capture its coordinates too early.
- **Layout safety.** Land membranes/layers on the exact final width/height later scenes
  expect. Scale-based dimples are post-layout transforms (safe); animating a layout child's
  own width/height reflows siblings (intended for growth, avoid for jitter).
- **Cleanup.** Remove every temporary overlay node before the helper returns, so scrubbing
  never accumulates orphans.
- **Restraint numbers.** Ambient displacement 1–4px; boundary flex 2–4px; destination
  depression 6–10px; scale overshoot < 8% (except an intentional headline impact); most
  micro-reactions 0.1–0.5s. Avoid many simultaneous continuous loops.
- **Timing.** Replace a plain tween with a *richer tween of similar duration*; don't extend
  the video without a narration reason. Narration runs on its own concurrent timeline, so
  keep each scene's net duration roughly constant (trim a trailing `waitFor` to pay for a
  new effect).
- **Three.js bounds.** A WebGL-backed Motion Canvas component needs explicit width and
  height (for example, extend `Rect`, not an unbounded `Node`). Otherwise parent caching
  can clip part of the 3D canvas even though Three.js rendered it correctly.
- **Three.js compositing.** Render to a transparent WebGL canvas, draw it during the Motion
  Canvas node's `draw()` call, and let Motion Canvas signals control camera, mesh, light,
  and thrust values. This preserves deterministic seeking and frame export.
- **WebGL preview.** Headless Chromium must have WebGL enabled; the repository screenshot
  helper uses software WebGL for deterministic local captures. A build can pass even when
  a browser cannot create a WebGL context, so inspect at least one runtime frame.
- **Cost of 3D.** Three.js substantially increases the project bundle and introduces a
  second rendering vocabulary. Keep the bridge reusable, but keep the number of 3D shots
  small.

## Verifying (important gotcha)

`npm run build` / `npx tsc --noEmit` is the reliable structural check. **Watch the total
scene duration**: Motion Canvas simulates every generator to completion, so if the full
timeline still reports its expected frame count after your edits, none of your generators
threw.

Frame inspection via `?ts=` / `agentPreviewPlugin` is **audio-gated**: once a video adds
narration/soundtrack, the preview clock waits on audio readiness and will not advance past
frame 0 without a real user gesture — so headless/agent seeking renders only frame 0 for
audio-bearing videos. Inspect specific frames in an interactive Studio session (click once
to satisfy autoplay), or temporarily render a copy of the scene without the audio tracks.
See `docs/agent-motion-canvas-preview.md` and the `motion-canvas-video` skill.

## Non-goals

Don't rewrite narration, change the educational sequence, replace the design system
wholesale, add realistic smoke or dense particles, default to 3D for visual polish,
jelly-ify every box, or leave permanent wobble on static elements. A bounded 3D hero shot
is acceptable only under the decision ladder above. Human review controls phase
transitions — never mark a video phase "ready".
