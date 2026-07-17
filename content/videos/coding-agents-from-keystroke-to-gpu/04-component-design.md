---
type: design
depends_on:
  - 03-beats.md
---

# 04 — Component Design: How Visual Props Convey Information

This document maps each component's appearance, behavior, and animation strategy to the beats and acts they inhabit. The design language prioritizes **color-pulse breathing** over scaling, **prop lifetimes** (enter when needed, exit when done), and **motion direction as meaning**.

## Core Animation Philosophy

### Principle 1: Color-Pulse Breathing (not scaling)
- **What it is:** Components idle via `stroke` and `fill` color tweens between two shades over ~1.6s cycles, using `easeInOutCubic`.
- **Why not scaling:** Scaling nudges neighboring elements off-layout and reads as shimmer, not organic life.
- **Warm vs. cold state:** Warm prefix (cached, efficient) pulses toward gold (`#f59e0b`). Cold tail (fresh compute) pulses toward blue (`#3b82f6`).
- **Reset on cancel:** When looping ends, reset color directly (no scale artifact).

### Principle 2: Prop Lifetimes (clear purpose)
- **Birth:** Tied to a specific beat. The TerminalPane enters at b001 for the cold open; it exits at b003 when we zoom out to reveal the harness.
- **Active phase:** Prop remains on screen fulfilling its narrative purpose. The PersistentMap is born in b005 and never redrawn—every subsequent beat that needs the map uses the same visual.
- **Exit:** Deliberate, not accidental lingering. Once a prop has served its beat(s), it leaves. This clarity prevents viewer confusion.

### Principle 3: Motion Direction as Meaning
- **TokenStream:** Flows left→right when crossing the boundary outbound (user input becoming GPU requests).
- **Decoded tokens:** Flow right→left returning to the viewer's terminal (output streaming back).
- **AttentionLinks:** Point only leftward, visualizing causality (no future peeking).
- **BatchLanes:** Flow left (consuming compute), refill from right (new requests queuing). Viewer's lane is always highlighted.

### Principle 4: Line Thickness & Opacity for Relationship
- **Strength encoding:** Thicker, more opaque = stronger relationship. AttentionLinks use this to show which past tokens influenced the current token's vector.
- **Hierarchy:** Brighter elements are in focus; dimmed elements (other batch lanes, inactive stages) recede.
- **Cascade:** Warm→cold transitions happen top-to-bottom or early-to-late, showing temporal order.

---

## Component Catalog

### 1. TerminalPane (Acts 1–3)

**Where:** b001 (cold open), b003 (zoomed out), then absent

**Visual design:**
- Standard terminal aesthetic: dark background, monospace font, bright text
- Actual command history from the demo session (`$ fix the failing test`, streamed output, etc.)
- Rendered at natural timing (pauses and silences audible)

**Animation strategy:**
- **b001:** TerminalPane fills the screen. Text streams in real-time. Pauses and silences are *felt*, not labeled. No narration explains the pauses yet.
- **b002:** TerminalPane stays, timeline freezes horizontally below it (unlabeled strip).
- **b003:** TerminalPane pulls back, shrinks, becomes one labeled box ("harness") on a growing PersistentMap. At this moment, it exits as a full-screen element.
- **Breathing:** While on screen, the terminal border and text occasionally pulse (color-pulse, not scale) to signal it is "live" before being labeled as the harness program.

**Why this works:**
- Viewers recognize the terminal immediately; no explanation needed.
- By showing the pauses without labels, we make the viewer *feel* the mystery before we solve it.
- The zoom-out in b003 is the moment architecture is revealed—TerminalPane becomes one piece of a larger system.

---

### 2. PersistentMap (Acts 2–10)

**Where:** Born b005, center stage through b033

**Visual design:**
- **Left box (blue, cool tone):** Harness on the viewer's machine. Label: "Harness". Subtitle: "(your machine)". Contains smaller text: "reads keystrokes", "builds request", "runs tools".
- **Center barrier (accent pink):** Vertical line representing the API boundary. Thick stroke (3px), emphatically drawn. Small gate icon in the center (subtle, no detail).
- **Right box (gold/warm tone):** GPU + Model in shared datacenter. Label: "GPU + Model". Subtitle: "(shared datacenter)". Text: "frozen weights", "one token at a time".
- **Connection path:** Dashed line from harness to GPU (request path). Label: "HTTPS request".
- **LoopArrow (added in b025):** A curved path wrapping back from GPU to harness (tool result returned), closing the loop visually. This stays once introduced.

**Animation strategy:**
- **b005 assembly:** Map builds piece-by-piece. Harness box appears first (with label), then boundary line sweeps down, then GPU box appears. The connection path draws itself. Text fades in as boxes settle.
- **Throughout Acts 4–8:** The map provides spatial orientation. When TokenStream crosses the boundary in b010, we see chips flow along the connection path. When batching is explained in b012, the GPU box expands to show BatchLanes internally.
- **b025 (loop closes):** The LoopArrow curves from GPU back to harness, and the entire path glows briefly to signal the loop is complete. This visual becomes the new normal.
- **b028 (cache warmth):** The ContextColumn (sitting on the harness side) develops a color-pulse gradient: the long prefix section pulses warm (gold), the tiny new tail pulses cold (blue). This distinction is entirely color-based, not motion.
- **b030 (position sensitivity):** When one chip in the ContextColumn changes, we see a cascade: that section and everything after it drain from warm to cold (color shift from gold to blue), signaling the cache invalidation.
- **b031–b033:** The map quiets—all components settle into idle breathing (subtle color pulse). As narration speaks each clause, the relevant component briefly intensifies its glow, then returns to idle.

**Why this works:**
- One persistent visual stays on screen for most of the video, building spatial memory. Viewers learn the map's layout and can mentally predict what happens where.
- The map's color scheme (cool harness, warm GPU) is consistent and memorable.
- LoopArrow's birth in b025 is a visual "aha"—viewers see the loop *structure* for the first time in motion.

---

### 3. ContextColumn (Acts 3, 8–10)

**Where:** Born b006, grows in b025–b026, warms/drains in b028–b030

**Visual design:**
- Tall, narrow rectangle on the harness side of the PersistentMap.
- Internal sections stacked vertically, each labeled:
  1. "Tool definitions" (small section, cool blue tint)
  2. "System prompt" (small section, cool blue tint)
  3. "Project instructions" (small section, cool blue tint, flashes with file names: CLAUDE.md, AGENTS.md, etc.)
  4. "Message history" (grows section, cool blue tint, shows abbreviated prior turns)
  5. "User input" (bottom, highlighted in accent pink, visibly tiny against the whole)
- When the cache highlights in b028, the entire column except the tail transitions to a warmer color palette (gold tints instead of blue), signaling "warm" (cached, efficient).

**Animation strategy:**
- **b006 assembly:** Column appears on screen next to the PersistentMap. Sections stack downward, each section fading in sequentially. As each part assembles, a label appears. The "Project instructions" section briefly flashes file names (CLAUDE.md, AGENTS.md, Cursor rules—different names, same idea) for a few seconds, then the flash ends.
- **b007 contrast:** On the right side of screen, the chat-bubble layout is shown. On the left, the ContextColumn at full height. As narration explains they are the same content, the bubbles' borders dissolve into the single column visual—a morphing transition showing they are one thing, two views.
- **b008 crossing & return:** The column slides across the boundary, lands on the GPU side briefly (reading happens), then snaps back to the harness side. This visualizes statelessness: the GPU reads everything, forgets everything, returns nothing.
- **b025 growth:** After the first tool call, the ContextColumn visibly grows. A "ToolResultCard" (see below) appends to the bottom, making the column taller. This repeats in b026 for each subsequent lap, with laps 2–3 happening fast.
- **b028 warm prefix:** The entire column except the tail shifts to warm-state coloring. The tail (new content) stays cold-blue. A subtle label or color-key appears momentarily: "warm (cached, ~1% cost)" vs. "cold (fresh, full cost)".
- **b030 cascade:** One early chip changes (a timestamp in the system prompt, for example). That section and all content below it immediately drain from warm to cold colors. This is a *cascade down*, not a flicker—the transition is visible and directional, showing how a small early change invalidates everything after.
- **Breathing:** When idle, the warm prefix section pulses gently between gold and darker gold. The cold tail pulses between blue and darker blue.

**Why this works:**
- The column grows visibly, making the loop's accumulation tangible. Viewers see the context exploding and understand why caching matters.
- The warm/cold visual language (color-pulse) is learned in b028 and re-used in b029–b030, building a vocabulary.
- The cascade in b030 is scary (cache invalidation) but beautifully motivated by the visual grammar: one change invalidates everything after.

---

### 4. TokenStream (Acts 4–7, 10)

**Where:** b009 (shatters), b010 (flows outbound), b021–b022 (flows back as decoded output), b031 (replay)

**Visual design:**
- Sequence of rectangular "chips" arranged horizontally.
- Each chip shows text (part of source code) on the front, flips to show an integer ID on the back.
- Chips have clean borders, no fill—they are hollow rectangles with stroke.
- When flowing, chips slide along a path, maintaining sequence order.

**Animation strategy:**
- **b009 reveal:** A line of code (e.g., `src/format.js`) is displayed. It shatters into token chips in sequence, each chip appearing with a brief scale-in animation (small → 1x). Then the chips "flip" (rotateY 180°) to reveal their integer IDs on the back. A few IDs are shown, then the flip happens, then we see the numbers.
- **b010 flow:** The chips flow left→right across the boundary, moving toward the GPU box. As they cross, they stream smoothly, maintaining order. At the boundary, they "enter" the GPU side. A cost meter, budget bar, and speed annotation orbit the stream momentarily, then settle.
- **b021–b022 decode:** New chips are produced one at a time (metronome rhythm). Each new chip appears at the end of the sequence on the GPU side, then flows back right→left toward the boundary. As it crosses, it "detokenizes" (flips back from ID to text), and the text lands in the TerminalPane on the harness side. The rhythm is synchronized with the decode metronome (every ~10–40 ms, one chip).
- **b031 replay:** During the Act 10 replay, TokenStream appears in fast-forward, showing the entire conversation and its responses as chip sequences flowing back and forth. The rhythm is compressed (~2–3 seconds for the full replay).

**Why this works:**
- Tokenization is abstract; visualizing it as physical "chips" that carry IDs makes it concrete.
- The left→right flow is the first major flow direction introduced; it establishes a spatial rule: outbound = left-to-right.
- The flip animation is satisfying and memorable. Viewers will associate "flip" with "tokenization" afterward.
- Chips flowing back (right→left) reinforces the bidirectional nature of the request-response cycle.

---

### 5. BatchLanes (Act 5)

**Where:** b012 (introduced), briefly referenced b021

**Visual design:**
- Three or four horizontal lanes, stacked vertically, each a thin rectangle.
- Each lane contains a sequence of small square "request chunks" (one chunk per token being processed in that batch).
- The viewer's request chunks are colored (using brand color or a bright accent). Other requests are muted gray.
- Lane boundaries are subtle (light grid lines).
- One lane is fully active (chunks visible), one is starting to process, one is mostly done and about to exit.

**Animation strategy:**
- **b012 entry:** BatchLanes slide up from the bottom of the GPU box. As they appear, narration explains: many users' requests run in one batch, processing in parallel at token granularity. The viewer's lane is highlighted with a bright border.
- **Lane motion:** Lanes flow leftward (consuming compute). As tokens are processed, chunks move left within their lane. Finished lanes exit the top; new lanes enter from the bottom (continuous batching).
- **Viewer's lane highlight:** Throughout, the viewer's lane is brighter and has a thicker border. Other lanes are muted and recede. This reinforces: "Your context is isolated; you share only hardware, not memory."
- **Individual chunk state:** Each chunk pulses lightly (color-pulse) when actively processing, dims when done, brightens as a result emerges.

**Why this works:**
- Batching is a complex infrastructure concept, but showing parallel lanes immediately communicates the idea visually.
- The viewer's lane is always highlighted—a visual reminder that the viewer's request is separate and private.
- The continuous flow (lanes exiting/entering) shows modern GPU scheduling without needing to explain queueing theory.

---

### 6. EmbeddingGrid (Act 6)

**Where:** b013 (tokens become vectors)

**Visual design:**
- A table-like visual: columns represent tokens (in sequence), rows represent dimensions of the embedding vector.
- Each cell contains a small rectangle filled with a shade representing the numeric value (darker = more negative or extreme, lighter = near zero, warmer = positive).
- Tokens are labeled at the top with their IDs or text.
- Rows are unlabeled (no dimensions called out—just visual texture).

**Animation strategy:**
- **b013 entry:** TokenStream chips unfold. Each chip expands from a narrow vertical bar (the chip) into a full column of many cells (the embedding vector). The cells fill with color gradually, creating a "blooming" effect. Text labels fade out as numeric texture takes over. Narration: "Each token ID is looked up in a table and becomes a vector—a long list of numbers."
- **Breathing (when idle):** The grid pulses subtly (colors shift between slightly brighter/darker) to signal it is "alive" and processing, but the motion is smooth and not distracting.
- **Transition to next:** The grid is shown once, then the focus shifts upward to the LayerStack above it.

**Why this works:**
- Embedding grids are a common visualization in ML, so they feel authoritative to viewers familiar with neural networks.
- The "blooming" transition from chip to vector is satisfying and clearly communicates the transformation.
- Color as numeric encoding is a learned visual language; no explanation needed once viewers see the pattern.

---

### 7. LayerStack (Act 6)

**Where:** b014 (layers introduced), b015–b016 (attention, keys, values), b017 (causality), b018 (output)

**Visual design:**
- Vertical stack of horizontal band-shaped boxes, each representing one layer.
- Each band is subdivided internally:
  - Left side: "Attention" (default: dimmed until b014 narration highlights it).
  - Right side: "Feed-forward" (dims immediately after being named in b014, stays dim for the rest of the video—the video follows attention, not feed-forward).
- Vectors flow upward through the stack, narrowing/widening as they pass through each layer (visual metaphor for transformation).

**Animation strategy:**
- **b014 entry:** LayerStack appears above the EmbeddingGrid. Vectors flow upward through each layer. Both "Attention" and "Feed-forward" sublabels appear and glow briefly as narration names them. Then "Feed-forward" dims (color fades to gray), and "Attention" remains bright.
- **b015–b016 focus:** The "Attention" band expands or zooms to show interior detail. Vectors branch: the query computation happens on the left, key/value lookups happen in the middle. Keys are represented as small tagged objects, values as payload shapes. As narration defines the roles, each object pulses gently (color-pulse) to draw attention.
- **b017–b018 through-flow:** Vectors continue upward through remaining layers. AttentionLinks (see below) are drawn on-demand during the attention substage of each layer (not literally shown for every layer, but conceptually present). At the top of the stack, the final vector is projected onto the vocabulary, forming a probability distribution (b018).

**Why this works:**
- Vertical stacking is a natural metaphor for the transformer architecture. Viewers learn this visual language once and it helps them remember the overall pipeline.
- Dimming feed-forward reinforces focus: the video is about attention, not feed-forward.
- Vectors flowing upward creates upward motion, which is intuitive for "processing" and "refinement."

---

### 8. AttentionLinks (Acts 6–7)

**Where:** b016 (introduced), b020–b021 (reused with KVShelf), b031 (replay)

**Visual design:**
- From a query token (newest in sequence), thin curved lines extend backward to every previous token.
- Line thickness encodes attention weight (similarity): thick = strong match, thin = weak match.
- Line color: accent pink or warm gold (consistent with brand, distinct from the data flow colors).
- Optional: matched keys briefly glow, and values flow along the lines as particle trails into the query token's vector.

**Animation strategy:**
- **b016 birth:** AttentionLinks appear as the query-key comparison is explained. Lines draw themselves from the query token to each previous token in sequence, with thickness based on attention weights. Matched keys glow momentarily, then settle. Values "flow" along the lines (thin particle trails) into the new token's vector.
- **b017 properties:** As narration speaks about causality (only looking backward) and cost (comparison is expensive), the links visibly point only leftward (reinforcing causality) and the fan broadens as the sequence lengthens, with a cost meter rising alongside.
- **b020–b021 reuse:** When the KVShelf is introduced, AttentionLinks are re-drawn in the same style, now reading from the stored keys and values instead of re-deriving them. This visual continuity (same line style, same glow) teaches that the cache is re-using the same information, just stored.
- **b031 replay:** AttentionLinks flash briefly in the fast replay, showing the look-back is happening, but compressed into 2–3 seconds so the rhythm is maintained.

**Why this works:**
- AttentionLinks make attention visible as a physical metaphor: the query reaches back and pulls in information. This is more intuitive than "matrix multiplication."
- Line thickness is a learned encoding; once shown, it communicates relationship strength without narration.
- Reusing AttentionLinks in b020–b021 to show cache reading is a powerful teaching moment: the cache stores the same keys/values that the links would derive, so reading the cache is the same operation, just faster.

---

### 9. KVShelf (Acts 7, 9–10)

**Where:** b019 (filled during prefill), b020 (named), b021 (read during decode), b029 (returns across request boundary), b030 (drains during cascade), b031–b033 (replay and synthesis)

**Visual design:**
- A shelf-like horizontal structure sitting below the token sequence, during the prefill/decode phase.
- Each token's position on the shelf is labeled with a small key tag (key) and value payload (represented as a shape or block).
- Keys are warm-tinted (gold) and have a small tag aesthetic. Values are accent-tinted (pink) and are slightly larger.
- When warm (cached), the entire shelf and its contents pulse gently in warm colors. When cold (needs fresh computation), colors shift to cool blue.

**Animation strategy:**
- **b019 prefill wave:** A bright wave sweeps across all prompt tokens horizontally (wide, parallel). As the wave passes each token, the token's key/value pair materializes on the shelf below. This visualization shows "every token publishes a key and a value, and they stick around."
- **b020 naming:** The shelf gets its label: "KV cache" (literally the cache of keys and values). A brief before/after ghost shows: without the shelf, every AttentionLink would re-derive the keys and values (frantic, wasteful); with it, the links calmly read the shelf (clean, efficient).
- **b021 decode metronome:** During serial generation, each new token's AttentionLinks read from the shelf (lines point to the shelf, not to previous tokens). As each new token is generated, its key/value pair joins the shelf (appends to the right), growing the shelf as the sequence grows.
- **b029 bridge:** The KVShelf returns, shown persisting across the API request boundary in Act 9. As narration explains "the prompt cache is the KV cache kept alive between requests," the same shelf is shown present when the next request arrives, with old tokens' pairs still there. This is the moment the two caches (KV during generation, prompt cache between requests) are revealed to be one mechanism at two timescales.
- **b030 cascade:** When the early chip changes, the KVShelf's warm-to-cold cascade is synchronized with the ContextColumn's cascade. Both drain from gold to blue starting from the changed point and flowing rightward. This shows the cache invalidation is a unified phenomenon: one mechanism at work.
- **b031–b033 replay and synthesis:** The KVShelf appears at rest in the final map, quietly pulsing warmly. As narration closes, the shelf is briefly highlighted (glow intensifies) when discussed.

**Why this works:**
- The shelf is a persistent, visually distinctive prop. Once introduced, it becomes a landmark. Viewers remember "the KV cache is that shelf."
- Showing it fill during prefill, be read during decode, and persist across requests (b029) unifies three concepts visually.
- The warm/cold color transition of the shelf mirrors the ContextColumn's, making the cache concept feel cohesive.

---

### 10. ToolCallCard & ToolResultCard (Acts 8–9)

**Where:** b023 (model emits tool call), b024 (harness executes), b025–b026 (loop closes and laps re-run), b029 (prompt cache shown)

**Visual design:**
- **ToolCallCard:** A rectangular card displaying:
  - Tool name (bold)
  - Arguments in JSON-like format (monospace, indented)
  - Stop reason (small text, e.g., "tool_use")
  - Color: accent pink border, light accent fill.
- **ToolResultCard:** Similar card displaying:
  - Tool name (bold, for context)
  - Result output (monospace, scrollable if tall)
  - Status (success, error, etc.)
  - Color: cool blue border, light blue fill.

**Animation strategy:**
- **b023 transform:** The streamed text in the TerminalPane re-renders as a ToolCallCard mid-screen. The card assembles: border appears first, then title fades in, then arguments display (line by line), then the stop reason highlights at the foot.
- **b024 journey:** The ToolCallCard slides from the TerminalPane across the PersistentMap boundary toward the harness side. A small GateIcon (badge with a checkmark or "auto-approved" label) briefly glows as the card passes. The card lands in the harness box and `npm test` runs in the terminal (live).
- **b025 result append:** A ToolResultCard materializes below the ToolCallCard, showing the test failure output. The ContextColumn grows visibly, and the ToolResultCard is incorporated as the bottom of the column.
- **b026 loop laps:** For each subsequent lap, a new ToolCallCard forms, passes through the gate, executes (with a brief progress indicator if the tool is slow), and a ToolResultCard forms below it. These laps happen progressively faster (tempo changes).
- **b031 replay:** During the Act 10 replay, ToolCallCards and ToolResultCards flash briefly, showing the loop structure is happening, but compressed into fast-forward.

**Why this works:**
- Cards are a familiar UI pattern. Using them to display tool calls and results is intuitive.
- The journey across the boundary (harness → GPU → back to harness) reinforces the bidirectional loop structure.
- The progressive speed increase in b026 is a tempo change; it's a musical concept and drives home the repetition and automation of the loop.

---

### 11. CacheHighlight (Act 9)

**Where:** b028 (warm prefix introduced), b030 (cascade drain)

**Visual design:**
- An overlay or visual distinction on the ContextColumn, dividing it into two regions:
  - **Warm prefix:** All content up to a certain point, tinted gold with a soft glow. Maybe a label or translucent banner: "warm (cached)".
  - **Cold tail:** New content appended below, tinted blue with no glow. Label: "cold (fresh)".

**Animation strategy:**
- **b028 entry:** As the narration explains the prompt cache, the ContextColumn shifts from a uniform blue tint to a two-tone appearance: the prefix goes warm-gold, the tail goes cool-blue. The transition is a color-shift animation (tween between color palettes over ~1 second), not a motion or scale. A subtle label appears momentarily for each zone.
- **Contrast:** A quick before/after is shown side-by-side: first request (all blue, full prefill wave, slow) vs. later request (long warm prefix, tiny cold tail, instant first token). This contrast is the payoff for the Act 3 "wastefulness" tension.
- **b030 cascade:** When the early chip changes, the warm-to-cold transition cascades downward, showing how a small early change invalidates the whole cache downstream. The cascade is directional and smooth, not instant.
- **Duration:** The CacheHighlight stays visible through b030, then fades away as we move into Act 10. The idea is learned; the visual helper exits.

**Why this works:**
- The two-tone coloring (warm/cold) is a powerful visual language once learned. Viewers immediately understand "warm = fast, cold = slow."
- The contrast shot (first vs. later turn) is a data-visualization moment that crystallizes the economic argument: caching is why the loop is affordable.
- The cascade is visually dramatic and makes position sensitivity memorable.

---

## Animation Timing & Pacing

### Breathing (Idle Loop)
- **Duration:** ~1.6 seconds one way (0.8 seconds in, 0.8 seconds out).
- **Easing:** `easeInOutCubic`.
- **Color shift:** E.g., `#1a1a1a` ↔ `#333333` for strokes; `rgba(243, 158, 11, 0.1)` ↔ `rgba(243, 158, 11, 0.2)` for warm fills.
- **When to use:** All idle components (harness box, GPU box, EmbeddingGrid, KVShelf, etc.) when not actively animating.

### Entrance Animations
- **Fade-in:** 0.4–0.6 seconds, `easeOut`.
- **Slide-in:** 0.4–0.6 seconds, `easeOut`. Direction depends on beat context.
- **Bloom/unfold:** 0.5–0.7 seconds, `easeOut`. Used for EmbeddingGrid (chips unfold into vectors).
- **Draw:** For paths and lines (LoopArrow, AttentionLinks, TokenStream flow), 0.3–0.6 seconds depending on path length.

### Exit Animations
- **Fade-out:** 0.4–0.6 seconds, `easeIn`.
- **Slide-out:** Same direction as entry, 0.4–0.6 seconds, `easeIn`.
- **Dissolve/shrink:** 0.5–0.7 seconds, `easeIn`.

### Fast Replay (b025 & b026)
- **Tempo multiplier:** 2.5–4x normal speed. Compress Acts 4–7 into 2–3 seconds.
- **Effect:** Breathing pauses (idle loops) are skipped entirely. All motion animations (flows, transformations) happen at accelerated speed.
- **Lapwise speedup:** Each lap in b026 is faster than the previous. Lap 2 ~2.5x, Lap 3 ~3.5x.

---

## Design Consistency Checklist

- [ ] All idle components use color-pulse breathing (~1.6s cycles), not scaling.
- [ ] Every prop has a defined birth and death beat (no lingering vestigial UI).
- [ ] Line thickness and opacity encode relationship strength, not decorative.
- [ ] Motion direction is consistent (outbound = left-to-right, return = right-to-left, past = leftward, future = absent).
- [ ] Color palette is consistent: cool (harness, input), warm (GPU, cache), accent (relationships, highlights).
- [ ] Warm/cold states use the same color-pulse mechanism, not different animation types.
- [ ] Props reappear with the same visual style (KVShelf in b019, b021, b029; AttentionLinks in b016, b020; etc.).
- [ ] Tempo changes (b026 fast replay) are smooth and noticeable, driving home the repetition and automation.
- [ ] Narration works as a podcast with video off; spatial relationships are shown, not described.

---

## Implementation Notes for Motion Canvas

### Color-Pulse Loop Template
```typescript
yield* component.stroke(coldColor, 0);
while (true) {
  yield* component.stroke(warmColor, 0.8, easeInOutCubic);
  yield* component.stroke(coldColor, 0.8, easeInOutCubic);
}
```

### Cascade Drain Pattern (b030)
```typescript
// Change one early chip
yield* contextColumn.children()[0].fill(coldColor, 0.2);
// Cascade: each subsequent chip delays slightly, then drains
for (let i = 1; i < contextColumn.children().length; i++) {
  yield waitFor(0.05);
  yield* contextColumn.children()[i].fill(coldColor, 0.3, easeInOutCubic);
}
```

### Fast Replay (tempo multiplier)
```typescript
const normalSpeed = 2.0; // e.g., 2 seconds for an animation
const fastSpeed = normalSpeed / 3.5; // 3.5x faster = ~570ms
yield* someAnimation(fastSpeed);
```

---

## Summary

This design language prioritizes **clarity through motion**. Every animation serves the narrative; no embellishment for embellishment's sake. Color-pulse breathing gives life without distraction. Prop lifetimes are deliberate—viewers see things enter, do their job, and exit. Motion direction becomes a learned language: left→right = request, right→left = response, leftward only = causality. Together, these principles make the complexity of agent loops and GPU computation feel not just understandable, but organic and alive.
