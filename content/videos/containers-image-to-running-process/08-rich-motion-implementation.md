---
status: ready
phase: implementation-guidance
video: containers-image-to-running-process
---

# Rich Motion Implementation Brief

This document is an implementation brief for improving the existing Motion Canvas video under:

- `src/videos/containers-to-running-process/`

The goal is **not** to redesign the video, rewrite the narration, or add effects everywhere. The goal is to enrich the current scenes with a coherent physical motion language while preserving the existing scene structure, object continuity, timing intent, and technical meaning.

## Core visual language

Use one consistent material system throughout the video:

- **Images** behave like dense, packaged material.
- **Registries** behave like rigid storage under pressure.
- **The host/runtime** behaves like a receptive active surface.
- **Writable layers** behave like flexible membranes.
- **Processes** behave like living energy.
- **Reads, writes, and pulls** behave like directional flows.
- **The kernel** behaves like heavy ground that anchors the scene.

Every rich animation must reinforce a concept. Avoid decoration that does not communicate meaning.

## Primary motion families

Use these five families consistently:

1. **Elastic settling** — entering, assembling, attaching, and landing.
2. **Pressure ripples** — one system reacting to another.
3. **Flow paths or ribbons** — pulling, reading, and writing.
4. **Breathing light** — a live running process.
5. **Morphing** — preserving identity between related visual states.

Avoid generic particle clouds, realistic smoke, constant ambient wobble, strong bloom everywhere, and making every component bounce.

---

# Implementation strategy

## Prefer semantic choreography helpers

Do not scatter long chains of raw tweens across every scene. Introduce reusable helpers whose names describe what is happening conceptually.

Suggested API direction:

```ts
yield *
  impact({
    node: localImage.node,
    surface: localSystem.slot(),
    intensity: 0.7,
  })

yield *
  transferRibbon({
    from: registryImage.node,
    to: localImage.node,
    tone: "image",
    preservesSource: true,
  })

yield *
  spreadLayer({
    layer: writable.node,
    over: readonlyNode,
    origin: "center",
  })

yield *
  flowSignal({
    from: readonlyNode,
    to: process.node,
    label: "read /etc/nginx/nginx.conf",
    tone: "readonly",
    absorb: true,
  })

yield *
  morphInto({
    source: writePacket,
    target: accessLogChip,
  })

const breathing = breathe(process.node, {
  property: "stroke",
  amplitude: 0.15,
  period: 1.8,
})
```

These exact signatures are suggestions, not mandatory contracts. Keep the helpers small, composable, and compatible with Motion Canvas generators.

## Preserve object continuity

Prefer transforming, moving, splitting, or morphing existing visual objects over removing them and introducing unrelated replacements.

Examples:

- The command lifted from the terminal remains the same command object.
- The pulled image remains visually connected to the registry copy and the local copy.
- A write packet becomes the resulting `access.log` file chip.
- The final formula is assembled from objects already present in the scene.

## Keep effects cancellable

Any looping animation must return or store a cancellation handle. Stop loops before objects leave the scene or change semantic state.

Examples:

- process breathing;
- subtle floating after impact;
- active registry response;
- host glow.

Do not leave infinite loops attached to removed nodes.

---

# Scene-by-scene changes

## 1. Intro terminal and command

Primary file:

- `src/videos/containers-to-running-process/scenes/01-playIntro.tsx`

### Keep

- Existing terminal entrance and focus.
- Typing `docker run nginx`.
- Existing pull output.
- Existing `liftCommandPhrase` transition.

### Add

#### Enter-key pressure ripple

When `terminal.run()` executes:

- send a subtle horizontal ripple through the terminal surface or border;
- briefly compress the focused command row by approximately 2–4%;
- settle immediately without a large bounce.

This should communicate that the command has entered the system.

#### Pull completion accumulation

As each `Pull complete` line appears:

- briefly pulse that line or a small cyan indicator;
- accumulate a restrained visual mass near the terminal edge or destination side;
- on the final status line, compress the accumulated visual material into the image concept used later.

Do not add arbitrary sparks. The accumulated material should resemble image layers, compressed bars, or a cyan transfer mass.

#### Secondary motion during command lift

Enhance the existing command lift:

- lift the phrase as one object;
- let individual tokens lag by roughly 50–100 ms;
- slightly stretch the terminal toward the departing phrase;
- keep a thin elastic connection for a fraction of a second;
- release it and let the terminal settle downward;
- spread the command tokens using spring-like spacing rather than a flat interpolation.

Keep this restrained. It should feel viscous, not cartoonish.

### Acceptance criteria

- The terminal remains readable during all effects.
- The lift still clearly originates from the typed terminal command.
- No effect delays the narration-dependent timing significantly.
- The terminal is not permanently wobbling.

---

## 2. Registry response and image release

Relevant files may include the scene that introduces the registry and:

- `src/videos/containers-to-running-process/components.tsx`
- registry/image component factories under `src/components/`

### Registry behavior

Treat the registry as rigid storage:

1. A pulse arrives from the active `run`/`pull` phase.
2. The shelf or registry frame compresses inward slightly.
3. The selected nginx image moves forward.
4. Neighboring stored elements shift back or sideways by a few pixels.
5. The image is released.
6. The registry recoils and settles.

Do not apply continuous breathing to the registry. It should react only while queried or transferring.

### Image stack behavior

Treat image layers like a compressed stack of rubber sheets:

- compress vertically when selected;
- separate by a few pixels with delayed motion during transfer;
- recompress when placed locally;
- give lower layers slightly more delay than upper layers.

The stack must remain clearly legible as layers.

### Acceptance criteria

- The registry still reads as storage, not a living object.
- The image remains visibly present in the registry after a pull, reinforcing copy rather than move.
- Neighbor motion is subtle and does not distract from the selected image.

---

## 3. Pulling the image into the host

Primary file:

- `src/videos/containers-to-running-process/scenes/playPullImage.tsx`

The current fall, overshoot, squash, rebound, and settle are a good foundation. Keep them.

### Add a transfer ribbon

During transfer from the registry image to the local image:

- draw a soft cyan ribbon or curved flow path between origin and destination;
- keep the registry copy visible;
- narrow the ribbon as transfer completes;
- let its final segment gently snap into the local image;
- dissolve the ribbon from origin to destination or retract it cleanly.

Prefer a ribbon over loose particles. The transfer should read as copying a coherent artifact.

### Make the host absorb the impact

When the image lands:

- depress the destination slot by approximately 6–10 px;
- expand one soft rectangular or rounded ripple through the host panel;
- briefly brighten the host border;
- displace nearby host contents by approximately 1–3 px;
- settle image layers at slightly different delays.

The moving object and receiving surface must both react.

### Optional post-impact float

A very subtle bob may continue briefly after landing:

- amplitude: approximately 2–4 px;
- slow period;
- stop before the next semantic transformation.

Do not leave the image floating indefinitely.

### Acceptance criteria

- The destination reaction is visible but not exaggerated.
- The original registry image remains visible.
- The local image ends exactly at the existing intended resting position.
- Transfer cleanup leaves no orphan path nodes.

---

## 4. `pull`, `create`, and `start` as distinct motion phases

The three phases should not only differ by labels. Give each phase a specific motion grammar.

### Pull = flow

Use:

- directional ribbons;
- travelling waves;
- delayed trailing motion;
- transfer between locations.

### Create = assembly and membrane growth

Primary file:

- `src/videos/containers-to-running-process/scenes/playWhatIsAContainer.tsx`

The writable layer currently grows from zero height. Replace or enrich this with a membrane-spread effect:

1. Begin as a thin amber bead or horizontal line above the read-only layers.
2. Spread laterally from the center or another explicit origin.
3. Increase height while spreading.
4. Slightly compress the read-only layers below it.
5. Overshoot width or height by a few percent.
6. Settle into the existing writable-layer geometry.

The effect must communicate “a thin writable layer is added on top of the image.”

Do not make the writable layer look like liquid pouring through the read-only layers.

### Start = ignition

When the main process starts:

- create one concentrated green pulse inside the container;
- send a brief wave through the layer stack;
- inflate the process pill from its center;
- trigger one strong status-dot pulse;
- expand one subtle ring from the process toward the container boundary;
- then transition to the existing restrained breathing outline.

Avoid smoke. The process should feel activated, not combusted.

### Acceptance criteria

- `pull`, `create`, and `start` can be distinguished even without reading the phase label.
- Create preserves the layer ordering.
- Start clearly marks the transition from inert artifact to running process.

---

## 5. Container boundary as a responsive membrane

Relevant components:

- `BoundaryFrame`
- `ContainerInstance`
- corresponding current container factories in `src/components/`

### Behavior

When the process starts:

- grow the boundary around the process rather than simply fading it in;
- let corners or edges follow with tiny delays;
- flex the boundary outward by approximately 2–4 px on the first process pulse;
- settle to a mostly stable state.

The boundary must not continuously wobble.

### Semantic variants

Use different response styles where the video distinguishes mechanisms:

- **Namespace:** reshapes or reorganizes the view inside the boundary, like a lens.
- **Cgroup:** constrains pulses or resource flows; excess pressure stops or queues at the boundary.
- **Filesystem view:** redirects reads and writes to the correct layer.

Do not use one generic “jelly box” effect for all three concepts.

---

## 6. Read and write flows

Primary file:

- `src/videos/containers-to-running-process/scenes/playWhatIsAContainer.tsx`

The current `flow()` helper moves a labelled packet between nodes. Replace or extend it with a reusable curved flow path.

### Read flow

For `read /etc/nginx/nginx.conf`:

- grow a thin cyan curved path from the read-only layer to the process;
- send one labelled pulse along it;
- slightly depress or brighten the source layer as data is released;
- let the process absorb the pulse;
- briefly mix cyan into the process glow;
- dissolve the path from tail to head.

The process should not only scale uniformly.

### Write flow

For `write /var/log/nginx/access.log`:

- emit an amber pulse or droplet from the process;
- let the writable layer attract it;
- dimple the writable layer just before contact;
- land the pulse on the writable layer;
- spread a small amber ripple across that layer only.

### Morph write packet into file chip

This is the highest-priority improvement.

Do not fade the write packet out and then independently fade `access.log` in.

Instead:

1. Send the write packet toward the writable layer.
2. Compress and reshape the packet at contact.
3. Move it into the final chip position.
4. Change its text to `access.log` at the least visually disruptive point.
5. Finish as the actual persistent file chip.

The resulting chip must be the same node when practical. If the component architecture makes that unreasonable, use a visually continuous handoff with exact position, size, color, and timing alignment.

### Acceptance criteria

- Reads originate from the read-only image.
- Writes end in the writable layer.
- The image layers never appear to be modified by the write.
- `access.log` persists after the write.
- Flow paths are removed after use.

---

## 7. Two containers sharing one image

Relevant scene/component:

- `ContainerPair` or its current equivalent.

### Desired transition

1. Keep the shared image stack centered and stable.
2. Grow two container boundaries upward from the shared foundation.
3. Use subtle rooted connectors or shared-layer references rather than duplicating the image visually.
4. Grow two independent amber writable layers.
5. Ignite two process pulses independently.
6. Demonstrate activity in Container A affecting only Writable A.
7. Keep shared read-only layers stable and common to both.

### Motion contrast

- Shared read-only layers: firm, heavy, common foundation.
- Writable layers: flexible, independent surfaces.
- Process pulses: independent timing and energy.

### Acceptance criteria

- The scene cannot be misread as two separate image copies unless that is explicitly narrated.
- A write in one container does not visually affect the other writable layer.
- Both containers remain anchored to the same host/kernel context.

---

## 8. Kernel as visual ground

Relevant component:

- `KernelLayer` or current equivalent.

### Behavior

Make the kernel the heaviest and least reactive element:

- containers rest visually above it;
- thin vertical connections may anchor processes to it;
- process activity can produce an extremely subtle surface pulse;
- lightweight overlays move more than the kernel;
- the kernel should respond minimally to impacts and transitions.

Optional depth effect:

- overlays respond quickly;
- containers respond moderately;
- kernel responds very little.

Do not turn the kernel into another glowing card.

### Acceptance criteria

- The host kernel feels foundational.
- Containers do not appear to be independent virtual machines.
- Kernel motion never competes with the explanation.

---

## 9. Cgroups and resource limits

Relevant component/scene:

- `ResourceBudgetRing` or current equivalent.

Prefer animated resource flow over a row of boxes.

### Suggested behavior

Represent CPU, memory, and I/O as controlled flows toward the process:

- CPU: discrete rhythmic pulses;
- memory: a fill level or bounded reservoir;
- I/O: droplets or packets moving at a measurable rate.

When cgroups activate:

- valves narrow;
- CPU pulses become rate-limited;
- memory approaches a visible ceiling;
- excess pressure queues or compresses behind a boundary;
- I/O passes at a controlled rhythm.

Do not imply that cgroups generate resources. They constrain resource use.

### Acceptance criteria

- Resource limitation is visible without relying entirely on labels.
- Flow remains readable at normal playback speed.
- No effect implies resources cross the configured limit.

---

## 10. Closing formula through decomposition and recomposition

Relevant component/scene:

- `Formula`
- closing scene under `src/videos/containers-to-running-process/scenes/`

Current conceptual formula:

```text
container = process + filesystem view + namespaces + cgroups
```

### Desired transition

Do not introduce four unrelated boxes from scratch.

1. Reuse the current process and move it to the formula position.
2. Flatten or extract the filesystem layers into the filesystem term.
3. Peel or reshape the namespace boundary into the namespace term.
4. Compress the resource-control visualization into the cgroups term.
5. Align the four terms into the formula.
6. Hold long enough for comprehension.
7. Recombine the terms into the final container representation.

The animation should form a reversible visual argument:

```text
container
  -> decompose
process + filesystem view + namespaces + cgroups
  -> recombine
container
```

### Acceptance criteria

- Every formula term can be traced back to something already shown.
- The formula remains readable during assembly.
- The closing recomposition ends in a clean stable frame.

---

# Reusable helpers to implement

Implement only the helpers needed for the current video. Do not build a large speculative animation framework.

## Required or strongly recommended

### `impact`

Coordinates:

- moving-node squash and stretch;
- destination depression;
- surface ripple;
- nearby micro-displacement;
- final cleanup.

### `transferRibbon`

Supports:

- curved or straight path;
- thickness taper;
- origin and destination nodes;
- preserving the source object;
- cleanup after completion.

### `spreadLayer`

Supports:

- origin point;
- width and height growth;
- mild overshoot;
- pressure response on layers below;
- exact final geometry.

### `flowSignal`

Supports:

- source and target;
- label;
- semantic tone;
- curved path;
- source release reaction;
- target absorption reaction;
- cleanup.

### `morphInto`

Supports:

- source and target geometry;
- text handoff;
- matching world-space position;
- opacity fallback where exact morphing is not practical.

### `breathe`

Supports:

- restrained stroke or glow modulation;
- cancellation;
- no scale change by default.

## Optional

- `elasticDetach` for the lifted terminal command.
- `responsiveBoundary` for the container membrane.
- `resourceValve` for cgroup flows.

---

# Technical constraints

## Motion Canvas compatibility

- Use generator-based choreography.
- Prefer `all`, `chain`, `delay`, `sequence`, and cancellable `loop` patterns already used by the project.
- Use world-space coordinates for overlay transfers.
- Recalculate absolute positions at animation time when parent size or position may be changing.
- Avoid capturing destination coordinates too early if the destination is animated concurrently.

## Layout safety

- Preserve final dimensions and positions expected by later scenes.
- Do not animate layout-managed properties and absolute positions simultaneously without checking final layout reconciliation.
- When morphing between nodes under different parents, use the overlay layer and convert coordinates correctly.
- Remove temporary overlay nodes after completion.

## Timing

- Keep narration synchronization intact.
- Prefer replacing a plain tween with a richer tween of similar duration.
- Do not extend the video significantly without an explicit narration or timeline reason.
- Most micro-reactions should stay between 0.1 and 0.5 seconds.
- Major transfers may use the existing scene duration.

## Restraint

- Default displacement for ambient reactions: 1–4 px.
- Boundary flex: approximately 2–4 px.
- Destination depression: approximately 6–10 px.
- Scale overshoot: generally below 8%, except the existing intentional image impact.
- Avoid simultaneous continuous loops on many nodes.

---

# Implementation order

Implement and review one coherent change at a time.

## Priority 1 — write morph

- Replace the disappearing write packet plus separate chip appearance.
- Morph the packet into `access.log`.
- Verify semantic clarity and cleanup.

## Priority 2 — host impact response

- Keep the existing pulled-image landing.
- Add destination depression and a host ripple.
- Verify later scene positions remain unchanged.

## Priority 3 — transfer ribbon

- Add the registry-to-host copy ribbon.
- Preserve the source image.
- Clean up the ribbon after transfer.

## Priority 4 — writable membrane spread

- Replace simple height growth with controlled spread and pressure response.
- Preserve the exact final layer geometry.

## Priority 5 — process ignition

- Add one strong startup pulse.
- Transition into the existing breathing outline.

## Priority 6 — closing formula reuse

- Decompose existing objects into the formula.
- Recompose them into the final container.

## Later improvements

Only after the first six are stable:

- registry pressure response;
- two-container shared-foundation transition;
- kernel grounding;
- animated cgroup resource valves;
- terminal lift elasticity.

---

# Validation checklist

## Visual review

- [ ] Effects reinforce the concept rather than merely decorate it.
- [ ] No scene resembles a sequence of disconnected slides.
- [ ] Objects remain alive across transitions where continuity matters.
- [ ] Static objects are mostly stable.
- [ ] Rich effects are concentrated on meaningful events.
- [ ] Text remains readable throughout.

## Semantic review

- [ ] Pull copies the image; it does not remove the registry copy.
- [ ] Create adds a writable layer over read-only layers.
- [ ] Start creates a running process.
- [ ] Reads come from the read-only image.
- [ ] Writes land only in the writable layer.
- [ ] Two containers can share image layers while keeping independent writable layers.
- [ ] The host kernel remains the shared foundation.
- [ ] Cgroups constrain resource usage.

## Technical review

- [ ] `npm run build` passes.
- [ ] Relevant Motion Canvas scenes preview without runtime errors.
- [ ] No temporary overlay nodes remain after animations.
- [ ] All infinite loops are cancelled.
- [ ] Later scenes receive nodes at their expected final positions, sizes, scales, and opacity.
- [ ] Scrubbing the timeline does not accumulate duplicate temporary nodes.

---

# Explicit non-goals

- Do not rewrite the narration.
- Do not change the educational sequence.
- Do not replace the current terminal, registry, image, or container design system wholesale.
- Do not add realistic smoke.
- Do not add generic particle emitters unless a specific concept requires them.
- Do not make all boxes jelly-like.
- Do not add permanent floating or wobbling to static elements.
- Do not introduce 3D rendering.
- Do not create a large general-purpose physics engine.
- Do not mark this document or any video phase as ready; human review controls phase transitions.

# Definition of done for this brief

This brief is satisfied when the first six priority changes are implemented, visually reviewed, and adjusted so that:

- the video retains its current structure;
- transitions feel physically connected;
- the image, writable layer, process, and data flows have distinct material identities;
- the new motion improves conceptual clarity;
- the implementation remains maintainable and reusable for later Synesthetic Code Craft videos.
