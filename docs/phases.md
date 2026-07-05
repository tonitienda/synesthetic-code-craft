# Phases for each video project

This document defines the Markdown-first workflow for each video project.

The goal is to move from broad intent to approved story structure, then approved visual explanation, then Motion Canvas implementation without asking a coding agent to invent the video directly in code.

Each phase produces one Markdown artifact under:

```text
content/videos/<video-slug>/
```

Each phase is gated separately. The human approves a phase by marking it `ready`.

## Core rules

- Agents refine the video one phase at a time.
- A phase may start only when all dependencies are `ready`.
- Agents may suggest improvements to earlier phases, but they must not silently change the intent of a ready phase while working on a later one.
- Agents must not mark documents as `ready`; humans transition documents from `in-progress` to `ready`.
- Stable IDs should be preserved once downstream files reference them.

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
motion-design
motion-components
implementation-plan
review
```

Rules:

- `type` describes the phase.
- `status` is either `in-progress` or `ready`.
- `depends_on` uses file names.
- The video slug is not needed because the file already lives under `content/videos/<video-slug>/`.
- No approver field is needed; the human reviewing the phase is the approver.

## Canonical phase order

```text
00-specs.md
01-research.md
02-treatment.md
03-beats.md
04-narration.md
05-scene-timeline.md
06-motion-design.md
07-motion-components.md
```

An `implementation-plan` document may still be used for legacy videos or for unusually complex implementation work, but the preferred post-design handoff is `07-motion-components.md`.

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

## Agent rules

- Do not research deeply here.
- Do not write the story yet.
- Keep the contract short enough for a human to approve confidently.

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

Each beat should have a stable ID and should include:

- act reference
- title
- purpose
- key idea
- optional visual hint
- transition to the next beat

## Agent rules

- Use stable beat IDs, because narration, scene timeline, motion design, and components will reference them.
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
- references from the scene timeline and motion design

## Required format

Use YAML front matter with `type: narration`, followed by a fenced parseable narration block.

Markdown outside the fenced block is allowed for human notes. Tooling should be able to ignore it.

## Narration schema

Each segment should include:

- `id`: stable narration segment ID, for example `n001`
- `act`: act ID
- `beat`: beat ID from `03-beats.md`
- `speaker`: usually `narrator`
- `text`: spoken text only
- `pause_after`: pause after the segment, in seconds
- `delivery`: optional voice direction
- `notes`: optional human or agent notes

## Agent rules

- `id` must be stable once referenced by downstream phases.
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

Map the ready narration to acts, scenes, timing budgets, teaching jobs, and required conceptual moments.

This phase is the edit map. It answers:

- what happens
- in what order
- which narration and beat IDs are involved
- roughly how much time each section should receive
- what idea each scene must land

It does **not** define the final animation language.

## Output

Each scene should include:

- scene title
- duration budget
- beat references
- narration segment references
- teaching job
- required conceptual moments
- required on-screen terms
- transition intent

## Agent rules

- Do not write Motion Canvas code here.
- Do not rewrite ready narration here.
- Reference narration segments by ID instead of duplicating the script.
- Do not define final screen layouts.
- Do not define camera movement.
- Do not define detailed choreography.
- Do not define reusable component APIs.
- Do not include ASCII key frames here.
- If a visual idea seems important, express it as a conceptual requirement; the concrete motion design belongs in `06-motion-design.md`.

## Gate

Mark this phase `ready` when the story sequence, pacing, and required ideas are clear enough to design the motion.

---

# 06 — Motion design

## File

```text
06-motion-design.md
```

## Front matter

```yaml
---
type: motion-design
status: in-progress
depends_on:
  - 05-scene-timeline.md
---
```

## Purpose

Translate the ready scene timeline into visual explanation.

This phase answers:

- what the viewer sees
- what persists between scenes
- what transforms into what
- where attention goes
- what the camera or composition does
- which visual metaphor carries each idea
- what text is allowed on screen
- how reviewers should judge whether the motion teaches

## Output

The motion design should include:

- global motion language
- visual grammar and recurring motifs
- persistence rules for objects across scenes
- text policy
- scene promise
- visual metaphor
- starting frame and ending frame
- ASCII key frames where useful
- choreography
- camera / attention direction
- allowed on-screen copy
- things to avoid
- component candidates
- scene quality gate

## Agent rules

- Do not add new story beats.
- Do not add or rewrite narration.
- Do not write Motion Canvas code here.
- Do not define final component APIs here.
- Use ASCII key frames as review sketches, not final layouts.
- Prefer transformations, reveals, persistence, and cause/effect over slide-like replacement.
- The motion itself must teach. Avoid visuals that merely decorate the narration.

## Gate

Mark this phase `ready` when the visual explanation can be reviewed and approved before implementation.

A reviewer should be able to understand:

- why each scene exists
- what the viewer sees
- what the central visual metaphor is
- what movement teaches the idea
- what must not be shown
- what candidate components are needed later

---

# 07 — Motion components

## File

```text
07-motion-components.md
```

## Front matter

```yaml
---
type: motion-components
status: in-progress
depends_on:
  - 06-motion-design.md
---
```

## Purpose

Turn the ready motion design into a concrete Motion Canvas component and implementation handoff.

This phase should make the coding task clear without changing the approved story or visual design.

## Output

The motion components document should include:

- files to create or update
- project entry point
- scene-to-file mapping
- reusable Motion Canvas components to create or reuse
- component responsibilities
- component props / inputs
- component state or animation phases, if needed
- scene assembly plan
- implementation order
- preview or screenshot commands
- acceptance checks
- risks and simplifications
- what must not be changed from earlier ready phases

## Agent rules

- Keep implementation scoped to ready motion-design scenes.
- Do not add new story beats.
- Do not add new narration.
- Do not redesign scenes.
- Prefer reusable Motion Canvas components when they simplify future videos.
- Avoid premature framework work that is not needed by the approved motion design.
- Keep component APIs human-readable and stable enough for review before code.

## Gate

Mark this phase `ready` when a coding agent can implement the requested video scope without inventing the structure, motion design, or component model.

After this, a coding agent may implement the requested scope in Motion Canvas.
