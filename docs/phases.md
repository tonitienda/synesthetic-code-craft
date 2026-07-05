# Phases for each video project

This document defines the Markdown-first workflow for each video project.

The goal is to move from broad intent to implementation-ready scenes without asking the implementation agent to invent the video structure directly in Motion Canvas.

Each phase produces one Markdown artifact under:

```text
content/videos/<video-slug>/
```

Each phase is gated separately. The human approves a phase by marking it `ready`.

## Core rule

Agents refine the video one phase at a time.

They may suggest improvements to earlier phases, but they must not silently change the intent of a ready phase while working on a later one.

A phase may start only when all dependencies are `ready`.

## Statuses

Use only these statuses:

```text
in-progress
ready
```

Meaning:

- `in-progress`: the phase is still being written, reviewed, or changed.
- `ready`: the human has accepted this phase as input for the next phase.

Only `ready` unblocks dependent phases.

## Common front matter

Every phase artifact should start with YAML front matter.

```yaml
---
type: specs
status: in-progress
depends_on: []
---
```

Allowed `type` values:

```text
specs
research
treatment
beats
narration
scene-timeline
implementation-plan
review
```

Rules:

- `type` describes the phase.
- `status` is either `in-progress` or `ready`.
- `depends_on` uses file names.
- The video slug is not needed because the file already lives under `content/videos/<video-slug>/`.
- No approver field is needed; the human reviewing the phase is the approver.
- Agents should preserve stable IDs once downstream files reference them.

## Canonical phase order

```text
00-specs.md
01-research.md
02-treatment.md
03-beats.md
04-narration.md
05-scene-timeline.md
06-implementation-plan.md
```

---

# 00 — Specs

## File

```text
00-specs.md
```

## Front matter

```yaml
---
type: specs
status: in-progress
depends_on: []
---
```

## Purpose

Define the video contract before research or writing begins.

This phase answers:

- What is the topic?
- Who is the audience?
- What should the viewer understand by the end?
- What is the desired tone?
- What is the expected format and duration?
- What is explicitly out of scope?
- What visual style hints are already known?

## Output

A concise project brief with:

- title or working title
- topic
- audience
- language
- target duration range
- purpose of the video
- required concepts
- non-goals
- tone
- visual direction
- constraints
- open questions

## Gate

Mark this phase `ready` when the scope, audience, tone, and depth are clear enough for research.

---

# 01 — Research

## File

```text
01-research.md
```

## Front matter

```yaml
---
type: research
status: in-progress
depends_on:
  - 00-specs.md
---
```

## Purpose

Collect the factual and conceptual material needed to explain the topic well.

This phase is about understanding, not storytelling yet.

## Output

Research should clarify:

- origin and historical context
- the problem being solved
- what did not work before
- key mechanisms
- examples
- counterexamples
- common misconceptions
- relevant terminology
- alternatives or related ideas
- factual uncertainties
- source links, when external facts are used

## Agent rules

- Do not design the final video structure here.
- Do not write final narration here.
- Mark uncertain claims clearly.
- Prefer useful understanding over exhaustive research.

## Gate

Mark this phase `ready` when the topic is understood deeply enough to design the video structure.

---

# 02 — Treatment

## File

```text
02-treatment.md
```

## Front matter

```yaml
---
type: treatment
status: in-progress
depends_on:
  - 00-specs.md
  - 01-research.md
---
```

## Purpose

Define the high-level story of the video.

This phase turns research into a coherent explanation arc.

## Output

Treatment should include:

- central thesis
- act structure
- conceptual progression
- viewer journey
- emotional rhythm
- pacing intent
- major visual metaphors
- what each act must achieve
- what each act should avoid

## Agent rules

- Stay high level.
- Do not write line-by-line narration.
- Do not specify detailed animation timing yet.
- Make the structure clear enough that beats can be written next.

## Gate

Mark this phase `ready` when the act structure and explanatory arc feel right.

---

# 03 — Beats

## File

```text
03-beats.md
```

## Front matter

```yaml
---
type: beats
status: in-progress
depends_on:
  - 00-specs.md
  - 01-research.md
  - 02-treatment.md
---
```

## Purpose

Break the treatment into concrete beats.

A beat is a small explanatory unit: one idea, one shift, one question, or one visual change.

## Output

Each beat should have a stable ID.

Example shape:

```yaml
beats:
  - id: b001
    act: act-1
    title: "The story starts smaller"
    purpose: "Move from deep networks to one artificial neuron."
    key_idea: "Backpropagation starts with understanding a single learning unit."
    visual_hint: "A large network fades away, leaving one neuron."
    transition_to_next: "Name the perceptron."
```

## Agent rules

- Use stable beat IDs, because narration and scene timeline will reference them.
- Keep each beat focused.
- Avoid implementation details.
- Visual hints are allowed, but they are not final animation specs.

## Gate

Mark this phase `ready` when the sequence of ideas is clear and complete enough to write narration.

---

# 04 — Narration

## File

```text
04-narration.md
```

## Front matter

```yaml
---
type: narration
status: in-progress
depends_on:
  - 00-specs.md
  - 02-treatment.md
  - 03-beats.md
---
```

## Purpose

Write the spoken script in a parseable format.

The narration file should be usable by humans and tools.

Possible generated outputs include:

- a plain text script
- an Apple `say` input script
- future TTS provider inputs
- timing estimates
- subtitles
- references from the scene timeline

## Required format

Use YAML front matter with `type: narration`, followed by a fenced parseable narration block.

Markdown outside the fenced block is allowed for human notes. Tooling should be able to ignore it.

````markdown
---
type: narration
status: in-progress
depends_on:
  - 03-beats.md
---

# Narration

```narration-yaml
segments:
  - id: n001
    act: act-1
    beat: b001
    speaker: narrator
    text: |
      Backpropagation.
    pause_after: 0.6
    delivery: calm
    notes: "Title line. Let it breathe."

  - id: n002
    act: act-1
    beat: b001
    speaker: narrator
    text: |
      How neural networks learn from mistakes.
    pause_after: 0.8
    delivery: calm
```
````

## Narration schema

Each segment should include:

```yaml
id: "Stable narration segment ID, for example n001"
act: "Act ID"
beat: "Beat ID from 03-beats.md"
speaker: "Usually narrator"
text: "Spoken text"
pause_after: "Pause after the segment, in seconds"
delivery: "Optional voice direction"
notes: "Optional human or agent notes"
```

Rules:

- `id` must be stable once referenced by the scene timeline.
- `text` contains only spoken words.
- Do not place stage directions inside `text`.
- Use `pause_after` instead of writing artificial filler.
- Keep mathematical notation mostly for visuals, not narration.
- Tools may concatenate `text` fields to generate a script for `say`.
- Future tools may transform the same segments into subtitles or TTS requests.

## Gate

Mark this phase `ready` when the spoken script has the right tone, rhythm, and conceptual clarity.

---

# 05 — Scene timeline

## File

```text
05-scene-timeline.md
```

## Front matter

```yaml
---
type: scene-timeline
status: in-progress
depends_on:
  - 03-beats.md
  - 04-narration.md
---
```

## Purpose

Describe the visual timeline aligned with narration.

This phase is the main handoff from writing to Motion Canvas implementation.

The scene timeline should use the high-level components and vocabulary defined in:

```text
content/language/animation-spec-v0.md
```

## Output

Each scene should include:

- scene ID
- title
- duration budget
- beat references
- narration segment references
- high-level components used
- component props
- timeline events
- transitions
- open implementation notes

Example shape:

```yaml
scenes:
  - id: s001
    title: "Title"
    duration: 8
    beats: [b001]
    narration: [n001, n002]
    components:
      - id: title-card
        type: TitleCard
        props:
          title: "Backpropagation"
          subtitle: "How neural networks learn from mistakes"
          animation: "fade-in-hold-fade-out"
    events:
      - at: 0.0
        narration: n001
        target: title-card
        action: show_title
      - at: 2.0
        narration: n002
        target: title-card
        action: show_subtitle
      - at: 5.5
        target: title-card
        action: fade_out
```

## Agent rules

- Prefer high-level components over low-level shape commands.
- Use components such as `SplashScreen`, `TitleCard`, `Perceptron`, `NeuralNet`, and `Graph2D` when possible.
- Low-level commands are allowed only when no existing component describes the intent.
- Do not write Motion Canvas code here.
- Do not rewrite ready narration here.
- Reference narration segments by ID instead of duplicating the script.
- If a reusable component is missing, propose it in the scene timeline or implementation plan.

## Gate

Mark this phase `ready` when an implementation agent can build the scenes without inventing the structure, pacing, or visual metaphor.

---

# 06 — Implementation plan

## File

```text
06-implementation-plan.md
```

## Front matter

```yaml
---
type: implementation-plan
status: in-progress
depends_on:
  - 05-scene-timeline.md
---
```

## Purpose

Translate the ready scene timeline into a concrete Motion Canvas implementation plan.

This phase is still documentation, not the final implementation.

## Output

The implementation plan should include:

- files to create or update
- project entry point
- scenes to implement
- reusable components to create or reuse
- props needed by each component
- npm scripts to add or update
- preview or screenshot commands
- risks and simplifications
- what must not be changed

## Agent rules

- Keep implementation scoped to ready scenes.
- Do not add new story beats.
- Do not add new narration.
- Prefer reusable Motion Canvas components when they simplify future videos.
- Avoid premature framework work that is not needed by the ready scene timeline.

## Gate

Mark this phase `ready` when the implementation task is clear, bounded, and safe for a coding agent.

After this, a coding agent may implement the requested scope in Motion Canvas.
