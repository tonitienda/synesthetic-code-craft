---
type: research
status: in-progress
depends_on:
  - 00-specs.md
---

# 01 — Research: How coding agents and LLMs work together, from keystroke to GPU

## Research goal

Support the video with enough technical accuracy to explain what happens during one interactive coding-agent session — from the user pressing Enter in a terminal/desktop app, through the harness, the API, the serving layer (queue, batching), the GPUs, and back — without turning the episode into a transformer-architecture lecture or an MLOps deep dive.

The video is **deep and narrow**: one session, followed all the way down. Concepts that open sideways doors (MCP, Skills, multi-agent, training, attention history) get one line each and their own future videos.

The research should help the later outline/script phases keep these ideas precise:

- A model is a frozen artifact that predicts the next token. It does not remember, learn, or act.
- A token is the unit of everything: cost, context size, generation speed.
- One prediction is one forward pass: embeddings → attention over all previous tokens → a probability distribution. Attention and embeddings are inference machinery, not training trivia.
- The API is stateless. The harness re-sends the entire conversation every turn.
- An agent is a loop, not a model: model proposes → harness executes → result appended → repeat.
- The harness is a real program with real responsibilities: loop, tool execution, permissions, hooks, context management, rendering. Different products name these differently; the concepts are shared.
- "Cache" means two different things at two different layers — prompt cache (between requests) and KV cache (within a generation) — and the first is implemented by persisting the second.
- Serving is a shared system: requests queue and are batched with strangers' requests onto GPUs; this is visible to the user as time-to-first-token.
- The felt rhythm of a session (pause → streaming → pause) maps 1:1 onto prefill → decode → local tool execution.

## Primary sources

Use these as the authoritative sources for the video.

### Agents and the agent loop

- Anthropic Engineering — Building effective agents
  - URL: https://www.anthropic.com/engineering/building-effective-agents
  - Useful for the audience-facing definition of an agent vs a workflow.
  - Key teaching point: "Agents are systems where LLMs dynamically direct their own processes and tool usage" — the model chooses the next step, but a surrounding program runs the loop.

- Anthropic Docs — Tool use overview
  - URL: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
  - Useful for the exact mechanics of one loop iteration.
  - Key teaching points:
    - The model does not execute tools. It returns a `tool_use` block: a tool name plus JSON arguments, and the response has `stop_reason: "tool_use"`.
    - The client (harness) executes the tool and sends back a `tool_result` block in a new user message.
    - The "loop" is literally: call API → check stop_reason → execute tools → append results → call API again — until `stop_reason` is `end_turn`.

- Claude Agent SDK docs (a harness packaged as a library)
  - URL: https://code.claude.com/docs/en/agent-sdk
  - Useful as evidence that the harness is a nameable, shippable software component: loop + built-in tools + permissions + hooks + context management, offered separately from the model.

### Harness behavior made visible: tools, permissions, hooks — across tools

The video uses a **generic agent**. These sources ground the claim that the same concepts exist across real harnesses under different names. (Verified 2026-07: agents.md, Cursor hooks docs, Codex CLI docs, Claude Code docs.)

- Claude Code Docs — Hooks reference
  - URL: https://code.claude.com/docs/en/hooks
  - Key teaching points:
    - Hooks are user-configured commands the harness runs at fixed lifecycle points — `PreToolUse` (before a tool executes, can block it), `PostToolUse`, `UserPromptSubmit`, `SessionStart`/`SessionEnd`, compaction events, and more.
    - They are deterministic: they run every time the event fires, regardless of what the model "wants".

- Cursor Docs — Agent hooks
  - URL: https://cursor.com/docs/agent/hooks
  - Key teaching point: Cursor documents the same concept in nearly the same vocabulary — "Hooks let you observe, control, and extend the agent loop using custom scripts" — with events like `preToolUse`, `postToolUse`, `beforeShellExecution`, `afterFileEdit`, `sessionStart`, `preCompact`. Strong evidence the concept is generic, not one vendor's invention.

- OpenAI Codex CLI docs
  - URL: https://developers.openai.com/codex/cli/
  - Key teaching points:
    - Codex handles the same policy problem with **approvals and a sandbox**: the user chooses when the agent may edit files or run commands without asking.
    - Project instructions live in `AGENTS.md` (bootstrapped by `/init`) — the same role CLAUDE.md plays for Claude Code.

- AGENTS.md — open format for agent instructions
  - URL: https://agents.md/
  - Key teaching point: a cross-tool standard ("a simple, open format for guiding coding agents") supported by Codex, Cursor, Aider, Zed, GitHub Copilot, Jules, Warp and others, used by tens of thousands of repos. Evidence that "a file of instructions the harness injects into context" is a shared, generic mechanism.

- Claude Code Docs — Configure permissions
  - URL: https://code.claude.com/docs/en/permissions
  - Key teaching point: a tiered system — read-only tools run freely inside the working directory; bash commands and file edits require approval. Concrete evidence that the gate is graduated harness policy, not model self-restraint.

### Statelessness, context, and the context window

- Anthropic Docs — Context windows
  - URL: https://platform.claude.com/docs/en/build-with-claude/context-windows
  - Key teaching point: the context window is the total token budget for everything the model sees plus what it generates in one request; it is bounded and everything competes for it.

- Anthropic Docs — Messages API (multi-turn)
  - URL: https://platform.claude.com/docs/en/api/messages
  - Key teaching point: the API is stateless — each request carries the full conversation (`system`, `tools`, `messages`). "Memory" in a chat is an illusion produced by the client re-sending history.

- Anthropic Engineering — Effective context engineering for AI agents
  - URL: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  - Key teaching point: context is "a finite resource with diminishing marginal returns"; in an agent loop, tool results are the fastest-growing part, and harnesses actively manage it (compaction, tool-result clearing).

### Tokens and tokenization

- Anthropic Docs — Token counting
  - URL: https://platform.claude.com/docs/en/build-with-claude/token-counting
  - Key teaching point: tokens are model-specific; there is an API endpoint whose whole job is counting them, because everything (price, limits) is denominated in tokens.

- OpenAI — Tokenizer (interactive)
  - URL: https://platform.openai.com/tokenizer
  - Useful for showing real text→token splits on screen (tokenizers differ per vendor, but the phenomenon is identical and this one is easiest to demo).
  - Key teaching points: common words are one token; rare words split; code splits on interesting boundaries (indentation, camelCase). Rule of thumb in English prose: ~4 characters per token.

- Andrej Karpathy — "Let's build the GPT Tokenizer"
  - URL: https://www.youtube.com/watch?v=zduSFxRajkE
  - Writer background (BPE mechanics; why weird tokenization causes weird behavior). Not for on-screen citation.
  - Key teaching point: the model never sees characters or words — only token IDs (integers).

### The forward pass: embeddings and attention at inference time

These sources support the new in-scope section (§2 below). The video teaches the *inference-time role* of these mechanisms, not their math or history.

- 3Blue1Brown — "Attention in transformers, visually explained" (and the Neural Networks chapter on transformers)
  - URL: https://www.youtube.com/watch?v=eMlx5fFNoYc
  - Writer background and visual inspiration: the cleanest existing visual language for "each token gathers information from previous tokens".

- Jay Alammar — The Illustrated Transformer / The Illustrated GPT-2
  - URL: https://jalammar.github.io/illustrated-transformer/
  - Writer background: embeddings, the layer stack, causal (backward-only) attention in GPT-style models, and the final projection to a vocabulary distribution.

- Vaswani et al. — "Attention Is All You Need" (2017)
  - URL: https://arxiv.org/abs/1706.03762
  - Reference only, so the writer can name the origin accurately if needed. The *significance/history* of this paper is the future training-video's material, not this one's.

### Inference serving: queueing, batching, prefill, decode, streaming

- NVIDIA Technical Blog — Mastering LLM Techniques: Inference Optimization
  - URL: https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/
  - The authoritative generic description of LLM serving. (Verified: covers prefill, decode, KV cache, batching.)
  - Key teaching points:
    - **Prefill:** the input prompt is processed in one highly parallel pass; compute-bound; produces the initial KV cache; corresponds to time-to-first-token.
    - **Decode:** tokens are generated autoregressively one at a time; each step reads and appends to the KV cache; memory-bandwidth-bound; measured in tokens/second.
    - **In-flight (continuous) batching:** the server evicts finished sequences and inserts new requests between decode iterations, instead of waiting for a whole batch to finish — this is how one GPU serves many users at once.

- vLLM — Easy, fast, and cheap LLM serving with PagedAttention
  - URL: https://blog.vllm.ai/2023/06/20/vllm.html
  - The public reference for how real inference servers manage KV-cache memory (paged KV cache) and batch many users' requests (continuous batching). Open-source stand-in for what providers run internally.

- Hugging Face Docs — KV caching
  - URL: https://huggingface.co/docs/transformers/kv_cache
  - A second, simpler description of the KV-cache mechanism.

- Anthropic Docs — Streaming
  - URL: https://platform.claude.com/docs/en/build-with-claude/streaming
  - Key teaching point: responses stream as server-sent events, delta by delta. Streaming mirrors the actual one-token-at-a-time decode loop.

### The prompt cache (API-level)

- Anthropic Docs — Prompt caching
  - URL: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
  - Key teaching points:
    - Prompt caching is a **prefix match** over the exact bytes of the rendered request (`tools` → `system` → `messages`, in that order). Any change anywhere in the prefix invalidates everything after that point.
    - Cached reads cost roughly a tenth of normal input processing; entries live minutes (TTL), refreshed on use.
    - The economics of the agent loop depend on this: turn N re-sends turns 1..N−1, but the API only truly reprocesses the new tail.
    - Under the hood this works by keeping the model's computed state (KV state) for the prefix — the bridge fact that unifies the two caches.

## Key mechanisms (writer's understanding)

Claims here are either sourced above or marked as uncertain.

### 1. The model at inference time

- A trained LLM is a set of numeric parameters ("weights") — for frontier models, hundreds of billions of numbers — loaded into GPU memory on the provider's servers.
- Its only operation: take a sequence of token IDs, run one forward pass, output a probability distribution over the vocabulary (~tens of thousands of possible next tokens). A sampler picks one. That's a "predicted token".
- The weights are frozen during use. Nothing the user says changes the model. "It learned my codebase" is false; "my codebase is currently in its context" is the true version.
- Everything that looks like capability beyond next-token prediction — tool use, multi-step plans, "agency" — is next-token prediction plus a harness that acts on the emitted text.

### 2. Inside one prediction: the forward pass

In scope at conceptual depth (specs decision). This is *use*, not training: the same machinery runs on every token of every session. Training (how the weights got their values) and the history of attention are a separate future video.

- **Embeddings:** each token ID is looked up in a table and becomes a vector — a list of numbers. From here on, the model computes with vectors, never with text.
- **The layer stack:** the vectors pass through a stack of identical layers (dozens of them). Each layer refines every token's vector using two ingredients: attention and a small feed-forward network. The video only needs "a stack of layers, each mixing information between tokens".
- **Attention, inference role:** inside each layer, every token's vector gets to *look back* at all previous tokens and pull in information from them. Mechanically, each previous token has stored a "key" and a "value"; the new token compares its "query" against all keys and blends the values. Two consequences the video needs:
  - Causality: a token only attends backward. The model reads left-to-right, like the viewer.
  - Cost: predicting a new token means comparing against *everything before it* — which is why long contexts cost compute, and why caching the keys/values (next point) matters so much.
- **The KV cache, now concrete:** the keys and values that every processed token produced (per layer) are exactly what the server stores. When decoding token N+1, the model reuses all stored K/V instead of recomputing them. The video's earlier "cache" hand-wave becomes precise here: **KV cache = the attention memory of tokens already processed.**
- **The output end:** after the last layer, the final vector is projected onto the vocabulary → scores → probability distribution → the sampler picks one token. One line on sampling ("picks from the distribution — usually a likely token, not always the top one"); no temperature/top-p tour (specs open question, current lean unchanged).
- Suggested visual: `AttentionLinks` — a new token chip drawing lines back to all previous chips; the same motif reappears when explaining both caches. This makes attention a *recurring load-bearing visual*, not a one-off lecture.

### 3. Tokens

- Tokenization happens server-side, before the model: text → token IDs. Detokenization happens after: sampled IDs → text streamed back.
- Tokens are why: pricing is per million tokens (input and output priced differently); the context window is a token count; generation speed is tokens/second.
- Good on-screen demo: tokenize a small code snippet. Indentation, brackets and identifier fragments make surprising tokens — memorable for a developer audience.
- Caveat: token boundaries are vendor/model-specific. Present the phenomenon, not one tokenizer's split as universal.

### 4. Context = the request

- One API request contains, in order: tool definitions, system prompt, then the message history (user turns, assistant turns, tool results). The model sees all of it as one long token sequence — it does not experience "turns" the way the UI shows them.
- The system prompt of a coding harness is large: instructions, safety rules, environment info (cwd, git status), tool schemas. Users rarely see this part. Good reveal moment: "what you typed is a tiny slice of what the model reads."
- Also injected into context by the harness: **project instruction files** — the generic mechanism behind CLAUDE.md, AGENTS.md, Cursor rules, GEMINI.md. The video can show it generically as "your project's standing instructions, prepended by the harness".
- Statelessness: after responding, the server keeps nothing (conversationally speaking). The next request must contain everything again. The harness is the keeper of history.
- Because context is finite and every loop iteration appends tool results, long sessions hit the ceiling. Harnesses respond with context management: summarizing/compacting older history, clearing stale tool outputs. (Both Claude Code and Cursor expose compaction in their hook events — `PreCompact`/`preCompact` — evidence it's a standard harness duty.)

### 5. The agent loop, precisely

One "turn" of an interactive session, e.g. user asks "fix the failing test":

1. Harness assembles the request: system prompt + tool definitions + project instructions + full history + new user message.
2. API call (HTTPS). Response streams back.
3. Model output ends with `stop_reason: "tool_use"` and a structured block: e.g. `{name: "Bash", input: {command: "npm test"}}`.
4. Harness intercepts: permission check (is this command allowed? ask the human?), pre-tool hooks run (may block or modify the flow).
5. Harness executes the tool **locally** — the shell command runs on the user's machine, not the model's.
6. Post-tool hooks run. The output (test failure log) is wrapped as a `tool_result` and appended to the history.
7. Back to step 2. The model now "sees" the test output and proposes an edit (another tool call), and so on.
8. Eventually the model responds with plain text and `stop_reason: "end_turn"`. The loop exits; the harness renders the answer; the terminal waits for the next user input.

- Key framing: from the API's point of view there is no session — just a series of independent, ever-growing requests. The loop, and therefore the "agent", exists entirely in the harness.
- Models can request several tools in one response (parallel tool calls); the harness runs them and returns all results together. One line, not a beat.

### 6. The harness — generic anatomy, cross-tool names

Responsibilities worth naming on screen (each observable in a coding session):

- **Loop driver** — the while-loop around the API.
- **Context assembler/manager** — builds every request; injects project instructions; compacts when near the window limit.
- **Tool executor** — actually runs shell/read/edit/search on the local machine.
- **Policy layer** — permission prompts, allow/deny rules, sandboxing.
- **Hook runner** — user-defined scripts at fixed lifecycle points.
- **Renderer** — turns the token stream into the live terminal/desktop UI.

The video uses generic terms; this table is the evidence they generalize (and a candidate for a fast on-screen "different names, same thing" moment):

| Generic concept (video vocabulary) | Claude Code | Cursor | OpenAI Codex CLI | Others |
|---|---|---|---|---|
| Project instruction file | CLAUDE.md | Rules + AGENTS.md | AGENTS.md (via `/init`) | GEMINI.md (Gemini CLI)*; AGENTS.md is the emerging cross-tool standard |
| Hooks (scripts on loop events) | Hooks: `PreToolUse`, `PostToolUse`, … | Hooks: `preToolUse`, `postToolUse`, `beforeShellExecution`, … | — (approvals/sandbox cover gating) | varies* |
| Permission gating | Permission modes + allow/deny rules | Auto-run allow-lists | Approvals + sandbox (`/permissions`) | varies* |
| Context compaction | Auto-compact (`PreCompact` hook event) | `preCompact` hook event | `/compact` command* | varies* |
| On-demand instruction packages | Skills | — / rules & commands* | custom prompts* | concept still converging |

\* Entries marked with an asterisk are from the writer's general knowledge, not verified against current docs — verify before naming any specific tool's feature on screen. The three unmarked columns (Claude Code, Cursor hooks, Codex approvals + AGENTS.md) were verified 2026-07 against the sources above.

- The distinction also has product-level proof: the Claude Agent SDK is literally a harness (loop + tools + hooks + permissions) sold separately from the model; on the other side, a "manual loop" over a bare API is the thinnest possible harness a developer writes themselves.
- One-liner allowed for MCP: "a standard plug for adding external tools to the harness." One-liner allowed for Skills (see §7). No more than that — dedicated video later.

### 7. Hooks — and the Skills one-liner

- Definition for the video: scripts the *user* configures and the *harness* executes at fixed events — before a tool call (can veto it), after a tool call, at session start/end, before compaction.
- Why they exist: the model is probabilistic; hooks are deterministic. "Always run the formatter after an edit" as a prompt instruction is a request; as a post-tool hook it is a guarantee.
- Perfect illustration of the boundary: a hook can block the model's tool call, and the model just receives a refusal in the tool result — it never had the power to begin with.
- Cross-tool: Cursor's hook system is near-isomorphic to Claude Code's (same events, camelCase names); Codex reaches the same goal through approvals/sandbox policy instead. The generic lesson: *every serious harness has a deterministic policy layer wrapped around the probabilistic model.*
- **Skills, one line only:** some harnesses let users package instructions (and helper files) into named bundles the harness loads into context only when relevant. From this video's perspective, a skill is just *context that arrives on demand* — more tokens injected by the harness. Full mechanics (discovery, progressive disclosure, bundled scripts) belong to the future Skills + MCP video.

### 8. The two caches (headline teaching point)

| | Prompt cache | KV cache |
|---|---|---|
| Layer | API / serving layer | Inside one generation on the GPU |
| Solves | Re-sending the whole conversation every turn would mean re-processing it every turn | Generating token N+1 would otherwise recompute attention over tokens 1..N |
| Granularity | Exact prefix of the rendered request | Every processed token's attention keys/values, per layer |
| Lifetime | Minutes (TTL, refreshed on use) | The duration of one request (then persisted *as* the prompt cache when applicable) |
| User-visible? | Yes: cheaper billed rates for cached tokens, faster time-to-first-token | No: invisible, always on |

- With §2 in place, both caches are now *mechanistic*, not metaphorical: the KV cache stores each token's attention keys/values; the prompt cache **is** that same KV state, kept alive between requests for a matching prefix. Turn N's request matches the prefix of turn N−1's; the server restores the state and only prefills the new tail.
- Consequence worth showing: cache is position-sensitive. Change one early byte (e.g. a timestamp in the system prompt) and everything after it goes cold. This is why harnesses keep system prompts frozen and histories append-only.
- Without prompt caching, the agent-loop pattern (full history re-sent per iteration, dozens of iterations per task) would be roughly an order of magnitude more expensive and slower. Caching is not an optimization footnote; it is what makes the architecture viable.

### 9. From API gateway to GPU and back (the serving path, in detail)

Kept detailed per specs decision, but presented as "how LLM serving generically works" (sourced to NVIDIA/vLLM) — not as any specific vendor's datacenter diagram.

1. **Front door.** The HTTPS request hits the provider's API edge: authentication (API key/OAuth), rate limiting, request validation. Same shape as any large API service.
2. **Routing and queueing.** The request is routed to an inference cluster that has the target model's weights loaded (a frontier model spans multiple GPUs; the weights are sharded across them). If the cluster is busy, the request waits in a queue — user-visible as extra time-to-first-token under load.
3. **Continuous batching.** GPUs are only efficient when processing many sequences at once, so the server runs a batch of many users' requests simultaneously. Modern schedulers batch at *token* granularity: after every decode step, finished sequences leave the batch and queued requests join — nobody waits for a whole batch to finish. (Public reference implementations: vLLM's continuous batching + PagedAttention, which also manages KV-cache GPU memory in pages so many requests' caches can share the space.)
4. **Tokenization.** The assembled prompt becomes token IDs.
5. **Prefill.** If a cached prefix matches (prompt cache), its saved KV state is restored; the remaining new tokens are processed in one parallel pass, filling in their K/V. Compute-heavy but parallel. This is the pause before the first word appears.
6. **Decode.** One forward pass per token: the newest token attends over the whole KV cache, the distribution comes out, the sampler picks, the token joins the sequence and its K/V join the cache. Serial by nature — this phase sets the tokens/second.
7. **Streaming back.** Each decoded token is detokenized and pushed over the open connection as a server-sent event — which is why the harness can render word-by-word in real time.
8. **Stop.** Generation ends on a stop condition: end-of-turn, a completed tool-call block, or the token limit. The final message carries `stop_reason` and token-usage accounting — which the harness reads to decide the next loop iteration.

- Batch privacy note worth one reassuring line if it fits: requests in a batch share GPU *hardware*, not context — each sequence attends only to its own tokens.

### 10. Latency anatomy (required concept — closing beat candidate)

Promoted from nice-to-have per specs decision. The payoff: the rhythm the user already knows *is* the architecture.

- **The pause before the first word** = network + queue + prefill. Shrinks dramatically on later turns because the prompt cache means only the new tail is prefetched/prefilled. First turn of a session: long pause (cold cache, giant system prompt). Later turns: short pause.
- **The fluent streaming** = decode, one token per forward pass. Roughly constant speed for a given model and load; measured in tokens/second.
- **The silent gaps mid-answer** = the harness executing tool calls locally (tests running, files being read). The model isn't "thinking" during these; it isn't running at all — its next request hasn't been sent yet.
- Closing-beat sketch: replay the session timeline from the video's opening, now labeled — every pause and burst annotated with the layer that caused it. The viewer re-experiences a familiar rhythm with new eyes.

## Terminology the video should stabilize

- **model** — frozen weights; next-token predictor
- **inference** — using a trained model (vs training, which is out of scope)
- **forward pass** — one run through the weights = one token prediction
- **token / tokenizer / detokenization**
- **embedding** — token ID → vector
- **attention** — the new token's look-back over all previous tokens' keys/values
- **context window / context**
- **stateless API**
- **agent / agent loop**
- **harness**
- **tool call / tool result / stop reason**
- **hook** — deterministic script on a loop event (pre/post tool as concrete examples)
- **project instruction file** — generic term for CLAUDE.md / AGENTS.md / rules
- **skill** — on-demand instruction package (one line only)
- **prompt cache / prefix**
- **KV cache**
- **queue / batching (continuous batching)**
- **prefill / decode / sampling / streaming**
- **time-to-first-token / tokens-per-second**

## Common misconceptions to address

1. **"The model remembers our conversation."** No — the harness re-sends everything; the API is stateless. The prompt cache makes this *look* free but it is still re-sent.
2. **"The AI ran a command on my machine."** The model emitted a request; the harness (a local program, under local permissions and hooks) executed it.
3. **"The agent is the model."** The agent is model + loop + tools; remove the harness and you have a text predictor that can only talk.
4. **"It's learning from my codebase as we work."** Weights never change during a session. What changes is the context.
5. **"Tokens are words."** Tokens are subword pieces; code especially tokenizes unintuitively.
6. **"Attention and embeddings are training concepts."** They are the machinery of every single prediction, running right now in the user's session. Training is where the weights got their values; the forward pass is how they're used.
7. **"Streaming is a UI animation."** It is the actual generation cadence — one token per GPU pass.
8. **"Cache" as one thing.** Two layers: prompt cache (across requests) and KV cache (within a request); the former is the latter persisted.
9. **"Hooks/system prompts are the model behaving well."** They are harness enforcement around a probabilistic component — and every serious harness has an equivalent (Claude Code hooks, Cursor hooks, Codex approvals).
10. **"The model reads files when it wants to."** It cannot want anything into effect; it can only emit a tool request the harness may or may not honor.
11. **"I have a dedicated AI."** One session shares GPUs with many strangers' sessions via batching; isolation is at the data level (each sequence attends only to its own tokens), not the hardware level.

## Factual uncertainties / cautions

- **Provider internals:** exact routing, batching, and cache implementation details at Anthropic/OpenAI/Google are not public. Present §9 as "how LLM serving generically works" (NVIDIA/vLLM as public references), not as a specific vendor's architecture.
- **"Prompt cache = persisted KV cache":** publicly documented behavior (prefix semantics, pricing, TTL) strongly implies it, and it is the standard implementation in open serving stacks (vLLM prefix caching). Phrase as "in practice this works by keeping the model's computed state for that prefix" rather than claiming inside knowledge of a specific vendor.
- **Cross-tool terminology drifts fast.** The table in §6 was spot-verified 2026-07 for Claude Code, Cursor, and Codex CLI; asterisked entries are unverified. Re-verify any tool named on screen close to production.
- **Numbers date quickly:** context sizes, prices, cache ratios and TTLs all drift. Prefer visual proportions ("cached input is roughly an order of magnitude cheaper") over exact figures, or date-stamp any number shown.
- **Tokenizer specifics:** per-model; demo one tokenizer as an *example*, not the truth.
- **Layer counts / vocabulary sizes:** if the forward-pass scene wants concrete numbers ("dozens of layers", "~100K-token vocabulary"), keep them approximate and unattributed to any specific frontier model — exact figures for current frontier models are not public.

## Related ideas explicitly out of scope (for narration discipline)

- Training, fine-tuning, RLHF — the model arrives frozen; say so once and move on.
- The history and significance of attention / the Transformer paper — future dedicated video ("why attention was the key"), paired naturally with the training story.
- Attention *math* — no matrices, no softmax, no multi-head on screen; the conceptual look-back mechanism only.
- CI/outer-loop/scheduled agents — one interactive session only.
- Subagents/multi-agent — one line at most.
- MCP and Skills mechanics — one line each; future dedicated video covering both together.
- Speculative decoding, quantization, MoE — writer background only.

## Gate status

`in-progress` — ready for human review.

Resolved since the first draft (per human feedback):

- Serving path keeps queue/batching detail (§9) — deep and narrow.
- Latency anatomy promoted to required concept (§10), closing-beat candidate.
- Generic agent confirmed; cross-harness terminology mapped and partially verified (§6).
- Attention/embeddings pulled INTO scope at inference depth (§2); their history/training stays out for a future video.
- Skills added as a one-line concept (§7); full treatment deferred to a Skills + MCP video.

Remaining open items for the human:

- The §6 table's asterisked cells need verification if those tools are named on screen — or the video can show only the three verified columns.
- Whether the forward-pass scene (§2) shows approximate numbers ("dozens of layers") or stays fully qualitative.
- Whether the batch-privacy line (§9) is included or dropped as a tangent.
