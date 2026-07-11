# Future Video Ideas

This document is a parking lot for future educational video topics. The goal is to explore a broad mix of subjects, publish across categories, compare audience response, and then make more videos in the areas that resonate.

The creator is currently strongest in software topics, but the channel should also be a learning-in-public project: research unfamiliar domains carefully, explain them clearly, and use audience interest to decide where to go deeper.

## Selection strategy

- **Release across topic families:** mix software, infrastructure, physics, engineering, and society-of-technology topics instead of staying in one niche too early.
- **Start with approachable explainers:** prefer questions a curious viewer already has, then reveal the underlying model step by step.
- **Watch for signal:** compare retention, comments, click-through rate, and follow-up questions to decide which families deserve sequels.
- **Keep the Markdown-first workflow:** every selected idea should become a `content/videos/<video-slug>/` folder and pass through the normal phase gates before implementation.
- **Research outside the comfort zone:** for non-software topics, treat research and expert-source review as first-class work before writing a confident narration.

## Candidate topics

### 1. How water reaches your home

**Working question:** How does clean water get from the city system into a tap, and why does it come out with pressure?

**Possible angles:**

- Municipal supply, mains, service lines, shutoff valves, meters, and household plumbing.
- Why pressure exists, what pressure regulators do, and why elevation matters.
- How taps, cartridges, washers, and handles control flow.
- Why water keeps flowing when multiple fixtures are open, and why pressure can drop.
- Where hot water branches away from cold water.

**Visual promise:** follow a single drop of water from the street main, through a meter and pressure regulator, into a house, and finally out of a faucet.

**Why it may work:** everyone uses plumbing daily, but most people have only a vague mental model of what is behind the wall.

### 2. How hot and cold water work

**Working question:** Why can one handle mix hot and cold water, and what is actually happening behind the tap?

**Possible angles:**

- Cold water feed versus hot water line.
- Water heaters, storage tanks, tankless systems, thermostats, and mixing valves.
- Single-handle mixer taps versus separate hot/cold taps.
- Pressure balance, anti-scald behavior, and why shower temperature changes when another fixture opens.
- Why “hot on the left” is conventional and useful.

**Visual promise:** show two colored pressure paths merging through a faucet cartridge, with handle position changing the opening for each side.

**Why it may work:** it pairs a familiar everyday interaction with hidden mechanical logic.

### 3. Rocket science is rocket science

**Working question:** Why is reaching orbit so unforgiving, and why does a little more payload demand so much more rocket?

**Possible angles:**

- The rocket equation as the central constraint.
- Mass ratio: payload, structure, engines, and propellant.
- Why adding payload often requires adding much more fuel, which itself adds more mass.
- Why staging helps by discarding dead weight.
- Why engine performance and specific impulse matter.
- Why orbit is mostly about horizontal speed, not just going “up.”

**Visual promise:** animate a rocket budget where every added kilogram of payload expands the fuel requirement, then show staging dropping empty tanks to improve the remaining mass ratio.

**Why it may work:** it has a strong title, high curiosity, and a clean mathematical core that can be made visual.

### 4. More rockets: why SpaceX needs to load so much fuel in orbit to reach the Moon

**Working question:** If a spacecraft is already in orbit, why does going to the Moon still require so much propellant and orbital refueling?

**Possible angles:**

- Difference between reaching low Earth orbit and leaving low Earth orbit.
- Delta-v budgets for trans-lunar injection, lunar orbit, landing, ascent, and return or transfer operations.
- Why large payloads and reusable architectures change the fueling plan.
- Why refueling in orbit can be more practical than launching one impossibly large fully fueled vehicle.
- How “fuel to carry fuel” compounds the problem.

**Visual promise:** show low Earth orbit as a parking lane, then draw the remaining energy/delta-v steps as toll gates that drain propellant tanks.

**Why it may work:** it connects a current public space topic to the deeper rocket equation from the previous video.

### 5. Conway’s Law: how committees invent software architecture

**Working question:** Why do systems so often look like the organizations that built them?

**Possible angles:**

- Conway’s Law as a communication-structure mirror.
- How team boundaries become API boundaries, service boundaries, or workflow seams.
- Why committees can produce fragmented products even with smart individuals.
- When aligning architecture to teams helps, and when it traps the organization.
- Inverse Conway maneuver: changing teams to get the architecture you want.

**Visual promise:** start with an org chart, then let communication paths extrude into boxes, interfaces, and duplicated subsystems.

**Why it may work:** it appeals to software viewers while touching management, sociology, and product design.

### 6. OOP is not a silver bullet

**Working question:** What does object-oriented programming solve, what does it confuse, and why should we separate value, reference, and identity?

**Possible angles:**

- Encapsulation, polymorphism, and message passing as useful tools.
- Why “everything is an object” can blur data, behavior, identity, and time.
- Rich Hickey-inspired distinctions: values versus references, identity versus state, and the cost of mutation.
- Why OOP can model some domains well but become accidental complexity in others.
- Alternatives and complements: immutable data, functional transformations, explicit state machines, and composition.

**Visual promise:** show a stable value as a snapshot, an identity as a labeled thread through time, and references as pointers to changing states.

**Why it may work:** the creator has domain strength here, and the topic can generate thoughtful discussion without becoming a rant.

### 7. LLMs and agents: what is really happening in a session

**Working question:** When you chat with an LLM agent, what are context, GPUs, cache, tools, and sessions actually doing?

**Possible angles:**

- Prompt, context window, tokens, and why earlier messages may be summarized or dropped.
- GPU inference at a high level: matrix operations without overloading viewers with hardware detail.
- KV cache and why continuing a conversation can be cheaper/faster than recomputing everything.
- Sessions, tool calls, files, and external memory versus model weights.
- Agents as loops: observe, plan, act, read results, update context.
- Why agents can feel persistent even when the model itself is stateless between calls.

**Visual promise:** show a conversation as a growing context tape feeding a model, with side channels to tools, files, caches, and session state.

**Why it may work:** it is timely, close to the creator’s software expertise, and useful for both technical and semi-technical audiences.

## Follow-up clustering

If a topic performs well, expand it into a mini-series:

- **Plumbing and infrastructure:** water pressure, sewers, electrical grids, gas lines, HVAC.
- **Rocket engineering:** rocket equation, staging, orbital mechanics, lunar missions, reusability.
- **Software architecture:** Conway’s Law, OOP, functional programming, distributed systems, coupling.
- **AI systems:** LLM internals, agents, context engineering, inference hardware, evaluation, product patterns.

## Notes for future agents

When turning one of these ideas into a real video, do not implement directly from this list. First create the normal phase files under `content/videos/<video-slug>/`, beginning with `00-specs.md`, then follow `docs/phases.md` until each downstream phase is marked `ready`.
