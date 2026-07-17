---
type: specs
status: ready
depends_on: []
---

# 00 — Specs: How coding agents and LLMs work together, from keystroke to GPU

## Working title

How AI coding agents actually work: from your terminal to the GPU and back

Alternative titles to consider later:

- What happens when you press Enter in Claude Code / Codex / Cursor?
- Agents, models, tokens, and the loop in between
- One prompt, end to end: inside an AI coding agent

## Purpose

Give developers who use AI coding agents daily a precise mental model of what actually happens during one interactive session: which part is the model, which part is the harness, where the loop runs, what a token is, what the context really contains, and what the caches do.

The video uses a coding task as the running example because coding agents make the harness visible: tool calls, shell commands, file edits, hooks, and permission prompts are all observable harness behavior, not model behavior.

The goal is to make the common words "agent", "model", "token", "context", "cache", "hook", and "harness" feel precise — the same way the containers video made "image", "container", and "registry" precise.

## Core thesis

An agent is not a model. An agent is a loop: a harness program repeatedly sends the entire conversation to a stateless model over an API, the model returns text or a tool request as tokens, and the harness executes tools, enforces policy (permissions, hooks), manages the context, and sends the result back — until the model stops asking for tools.

The model itself is a frozen artifact that only ever does one thing: given a sequence of tokens, predict the next one, on a GPU, one token at a time.

## Audience

Primary audience:

- software developers who use AI coding agents (Claude Code, Cursor, Copilot, Codex-style tools) through recipes but are unsure what happens underneath
- developers who know "the AI edited my file" but not who actually ran the edit
- backend and platform-curious developers who want the systems view

Secondary audience:

- technically curious viewers who want a bridge from "chatting with AI" to the actual request/response machinery

## Language

English for now. Wording should remain simple enough to rewrite in Spanish later.

## Target duration

Target: 12–18 minutes; up to 20 is acceptable.

(Updated 2026-07 during treatment review: the original 8–12 target was relaxed. The main goal is that the concepts are genuinely clear to engineers who use coding agents — no hyper-basic explanations needed, but the deep model-side concepts (attention, prefill/decode, both caches) must be properly explained, not compressed to fit a runtime. One video, not a split.)

## Scope

The video should explain, at a high level:

- one interactive session, end to end: terminal/desktop app → harness → API → inference server → GPU → back
- what an LLM model is at inference time (frozen weights; next-token prediction; no learning during the session)
- what a token is (tokenizer, token IDs, why costs and limits are measured in tokens)
- what the context is (the full request the model sees each turn: system prompt, tool definitions, conversation, tool results)
- statelessness: the API remembers nothing; the harness re-sends everything every turn
- the agent loop: model requests a tool → harness executes it → result appended to context → repeat until done
- tools as the model's only hands: the model never executes anything itself
- the harness: the program around the model (agent loop, tool execution, permission gating, hooks, context management, UI rendering)
- hooks and permission gating: passing mention only (see Decisions — 2026-07 scope reduction). The demo session runs with auto-approved permissions and no hooks; one line acknowledges that real harnesses put a policy layer at the tool-call boundary
- cache, both meanings:
  - prompt cache (API level): prefix matching over the re-sent conversation, why it makes the loop affordable
  - KV cache (inference level): attention keys/values, why generation doesn't restart from scratch for every token
- the serving path in detail: API front door (auth, rate limits, validation) → queueing and continuous batching onto shared GPU servers → tokenization → prefill → decode → streaming back. Keep the queue/batching step — deep and narrow, not wide and general.
- inference at mental-model depth: prefill (whole prompt processed in parallel) vs decode (one token at a time), sampling, streaming tokens back
- one forward pass, conceptually: token IDs become vectors (embeddings); each new token attends over all previous tokens (attention — the mechanism whose keys and values the KV cache stores); the output is a probability distribution over the next token
- why responses stream word by word (autoregressive decoding, not a UI effect)
- latency anatomy: time-to-first-token = network + queue + prefill; streaming speed = decode rate; tool-run pauses = harness executing locally. The felt rhythm of a session maps 1:1 onto the architecture.

## Non-goals

Do not explain:

- how models are trained (pretraining, RLHF, fine-tuning) — the model arrives as an already-trained artifact
- the history and significance of attention / the Transformer ("why attention was the key to modern AI") — reserved for a dedicated training-and-architecture video. Note: attention and embeddings themselves are NOT training concepts; they run at inference time and are in scope here at conceptual depth (see scope).
- attention math (query/key/value matrices, softmax, multi-head details) — this video explains attention's inference-time role, not its equations
- CI agents, outer loops, scheduled/background agents, routines — this video is one interactive session only
- multi-agent orchestration and subagents (at most a one-line mention)
- MCP and Skills in depth — each gets a one-line mention as a harness extension point; a dedicated later video will cover them together
- prompt engineering advice
- model comparison or benchmarks
- GPU hardware details (HBM, tensor cores, quantization) beyond "the model's weights live on GPUs and predicting a token means a pass through them"
- provider-specific serving infrastructure claims (load balancers, exact batching strategies) beyond a generic, clearly-generic picture

## Required concepts to make clear

- **Model:** a frozen set of weights that, given a token sequence, outputs a probability distribution for the next token. It does not remember, learn, or act.
- **Token:** the unit models read and write; a few characters of text mapped to a number. Costs, limits, and speed are all measured in tokens.
- **Context (window):** everything the model sees for one prediction — re-sent in full on every request; bounded in size.
- **Agent:** model + loop + tools. The looping program that turns single predictions into multi-step work.
- **Harness:** the program around the model — it owns the loop, executes tools, enforces permissions, runs hooks, manages context, renders UI.
- **Tool call:** the model emitting a structured request ("run this command"); the harness deciding whether and how to execute it.
- **Hook:** (demoted 2026-07 — mention-only, no longer a taught concept) a user-configured script the harness runs at fixed points. Covered properly in a future harness-focused video.
- **Prompt cache:** API-level reuse of an already-processed conversation prefix; the reason re-sending everything each turn is viable.
- **KV cache:** inference-level reuse of attention state during generation; the reason token N+1 doesn't reprocess tokens 1..N.
- **Prefill vs decode:** the prompt is processed in one parallel pass; the response is generated one token at a time.
- **Embedding:** the lookup that turns each token ID into a vector of numbers — the form the model actually computes with.
- **Attention (inference role):** to predict the next token, the model looks back over every previous token's stored keys and values. This is what the KV cache caches, and why context size costs compute.
- **Batching:** inference servers interleave many users' requests on shared GPUs to keep them busy; your request queues, joins a batch, and decodes alongside strangers' requests.
- **Latency anatomy:** time-to-first-token ≈ network + queue + prefill; tokens/second ≈ decode. The rhythm the user already feels is the architecture.

## Tone

Calm, precise, practical — same family as the containers video.

Preferred feeling:

- "The agent is a loop, not a mind."
- "The model is stateless; the harness carries the memory."
- "The model suggests; the harness executes."
- "Everything is tokens: cost, context, speed."
- "Caching is why this whole loop is affordable."

Avoid:

- anthropomorphizing ("the model decides to look at your files" → the model emits a tool request; the harness reads the files)
- implying the model has persistent memory or runs locally
- implying magic at the GPU layer — keep it mechanical
- vendor-war framing; the harness stays generic — the research maps how several real tools name the same concepts, but the video teaches tool-agnostic vocabulary

## Visual direction

Architecture-first, loop-first. The central recurring visual should be the round trip: terminal → harness → API → GPU → back, with the loop drawn as an actual cycle that the video traverses multiple times, adding detail each pass.

Likely reusable visual components:

- `TerminalPane` (already exists in this project)
- `HarnessBox` (loop, tool executor, permission gate, hook slots)
- `ModelBox` / `GpuRack`
- `TokenStream` (text ↔ token chips)
- `ContextColumn` (growing stack: system prompt, tools, messages, tool results)
- `LoopArrow` / round-trip path
- `CacheHighlight` (prefix that turns "warm")
- `ToolCallCard` / `ToolResultCard`
- `HookGate` (script icon intercepting the path)
- `RequestEnvelope` (the JSON that travels)
- `EmbeddingGrid` (token chips turning into number vectors)
- `AttentionLinks` (new token drawing lines back to all previous tokens — reused when explaining the KV cache)
- `BatchLanes` (many users' requests interleaved on one GPU server)

Useful visual contrasts:

- what the user sees (chat) vs what the API sees (one giant token sequence)
- model box vs harness box: what each one is allowed to do
- first turn (cold, whole context processed) vs later turns (warm prefix, only the tail processed)
- prompt cache (between requests) vs KV cache (within one generation)
- prefill (parallel, wide) vs decode (serial, one chip at a time)

## Framework goals

This video should test whether the framework can handle:

- a persistent architecture diagram traversed repeatedly with increasing detail
- token-stream animation (text splitting into chips, chips flowing along a path)
- a growing context column that persists and gets appended to across scenes
- cache "warming" as a visual state change on existing elements
- loop choreography (same path, multiple laps, different payloads)

## Decisions already taken

- Coding task as the running example, because it makes the harness observable.
- One interactive session only; no CI/outer-loop/scheduled agents.
- No training content at all.
- **Generic agent, not a branded one.** Different tools name the same concepts differently (Claude Code hooks ≈ Cursor hooks; CLAUDE.md ≈ AGENTS.md ≈ Cursor rules; permission modes ≈ approval/sandbox modes). The research maps the terminology across tools; the video teaches the generic concept and may flash the per-tool names once as proof of generality.
- **Attention and embeddings are in scope at inference depth** (what a forward pass does; what the KV cache actually stores). Attention's history, training, and "why attention changed AI" are out of scope — future dedicated video.
- **The serving path keeps its detail**: queueing and continuous batching are explained, not collapsed into "reaches a server". Deep and narrow over wide and general.
- **Latency anatomy is a required concept**, likely the closing beat — it ties the whole architecture back to what the user already feels.
- **Skills get a one-line mention** as a harness extension point (on-demand instruction packages that become context when loaded); the full explanation is deferred to a dedicated Skills + MCP video.
- Both caches must be covered and explicitly disambiguated — this is a headline teaching point, not a footnote.
- **Policy layer reduced to a mention (2026-07, treatment review).** The tool-call flow (prompt → model → tool call request → execution → result appended → model) is shown in full, but the demo session runs with auto-approved permissions and no hooks. One line acknowledges that real harnesses place a policy layer (permission prompts, hooks, sandboxes) at the tool-call boundary. Rationale: the video's focus is "on the other side of the fence" (model, serving, caches), the audience is engineers who will understand the elision, and the reclaimed time protects the deep acts. Hooks/permissions get a future harness-focused video.

## Open questions

- How deep to go on sampling (temperature, top-p)? Current lean: one line ("the model picks from a probability distribution"), no parameter tour.
- Whether to show a real tokenizer output for a code snippet (probably yes — code tokenizes memorably: whitespace, camelCase splits).
- ~~Whether the permission prompt and a hook firing deserve their own beat each, or share one "harness as policy layer" beat.~~ Resolved 2026-07: neither — see Decisions (policy layer reduced to a mention).
- How to visualize attention without drifting into architecture-lecture territory — one scene ("the new token looks back at everything before it") or a recurring motif reused when the KV cache is explained.

## Gate status

`in-progress` — awaiting human review before the research phase is considered unblocked. (Research has been drafted in parallel; review both together.)
