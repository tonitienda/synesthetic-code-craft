---
type: treatment
status: ready
depends_on:
  - 00-specs.md
  - 01-research.md
---

# 02 — Treatment: How coding agents and LLMs work together, from keystroke to GPU

## Central thesis

An agent is not a mind in your terminal. An agent is a loop.

A harness — an ordinary program running on your machine — repeatedly sends the entire conversation to a stateless model over an API. The model, a frozen set of weights on someone else's GPUs, does exactly one thing: given a sequence of tokens, predict the next one. When the prediction is a tool request, the harness executes it locally, appends the result, and sends everything again. That's the whole trick.

The key viewer realization should be:

> The agent felt mysterious because I imagined one intelligent thing. It's actually two mundane things — a loop and a predictor — passing tokens back and forth.

Once that architecture is clear, the everyday vocabulary snaps into place:

- the **model** is frozen weights that predict the next token
- a **token** is the unit of everything: cost, context, speed
- the **context** is the full request, re-sent every turn
- the **harness** owns the loop, the tools, and the conversation's memory
- a **tool call** is the model asking; execution is the harness's job — and the harness runs it on the user's machine
- **attention** is the look-back that every prediction performs — and "KV" in "KV cache" literally means the keys and values that look-back reads
- the **prompt cache** is why re-sending everything is affordable
- the **KV cache** is why generating token 500 doesn't reprocess tokens 1–499
- the felt rhythm of a session — pause, streaming, silence, streaming — maps 1:1 onto the architecture

## Structural decisions (from spec review)

These were decided interactively and shape everything below:

1. **One deep descent.** The video follows one request all the way down — keystroke → harness → API → queue → tokens → GPU → back — and reaches the loop naturally when the model's answer turns out to be a tool call. Later laps are fast and light up the caches. Depth-first, matching the title.
2. **Session-rhythm bookend.** Cold open on the felt rhythm of a real session; closing beat replays the same timeline fully labeled (latency anatomy).
3. **Policy layer reduced to a mention.** (Revised during treatment review, superseding the earlier "one shared policy beat" decision.) The demo session runs with auto-approved permissions and no hooks; one line in Act 8 acknowledges that real harnesses place a policy layer (permission prompts, hooks, sandboxes) at the tool-call boundary. The tool-call *flow* — prompt → model → tool call request → execution → result appended → model — is shown in full; only the gating machinery is elided. The audience is engineers; they'll understand the focus is on the other side of the fence. Hooks/permissions get a future harness-focused video.
4. **Attention as a recurring motif.** The `AttentionLinks` visual (new token drawing lines back to all previous tokens) is born in the forward-pass act and returns for the KV cache and the prompt cache. Attention is load-bearing, not a lecture.
5. **Clarity over runtime.** Target 12–18 minutes, up to 20 acceptable. The audience is engineers who use coding agents daily: skip hyper-basic explanations (they know what an API, a process, and JSON are), and spend the reclaimed depth budget on the model-side concepts — attention, prefill/decode, and the two caches get full explanations, not compressed summaries. Consequence: the GPU material spans two acts (forward pass; then prefill/decode/KV cache) instead of one.

## Desired viewer journey

The viewer starts from a familiar, slightly uneasy place:

> I use this thing every day. It edits my files and runs my tests. I don't actually know what it is.

The treatment should not shame that. The tools are deliberately seamless; the seams are hidden by good design, not by the viewer's laziness.

By the end, the viewer should feel:

> I know what kind of thing is on the other side of my Enter key. I know which part is a program on my laptop, which part is a frozen artifact on a GPU, what one prediction actually consists of, and why the rhythm feels the way it does.

The emotional movement:

1. Recognition: the rhythm of a session — pause, stream, silence, stream — is instantly familiar.
2. Split: what looked like one intelligent thing is two mundane things.
3. Descent: follow one request down through layers that are each individually unmagical.
4. Floor: one prediction, opened up — embeddings, attention, a sampled token. Mechanical, not mystical.
5. Turn: the model's "answer" is a request for help — the loop reveals itself.
6. Economy: the caches explain why this absurd-sounding architecture (re-send everything, every turn) is viable.
7. Payoff: the opening rhythm replays, fully labeled. The viewer already knew the architecture by feel.

## Running example

One coding task carries the whole video: **"fix the failing test."**

It is small enough to hold in the head, and it naturally produces the full loop: run the tests (tool call), read the failure (tool result), edit a file (another tool call), run the tests again, report success (plain text, loop exits). Every architectural concept gets a concrete moment in this one task.

## Act 1 — Cold open: the rhythm you already know

### Purpose

Start inside the viewer's daily experience, before any architecture. Establish the promise of the video.

### Conceptual point

A terminal session plays out realistically: the user types "fix the failing test" and presses Enter. Then:

- a pause — nothing visible happens
- text streams in, word by word
- a tool runs; a longer silence while tests execute
- more streaming, another tool, another silence
- the final answer streams out

No labels yet. The narration names the rhythm the viewer already knows by feel — and makes the promise:

> Every pause and every burst in this rhythm is caused by a specific piece of machinery. By the end of this video, you'll be able to name all of them.

### Visual metaphor

A clean terminal pane, played at natural speed (tightened, not fake-instant). The rhythm itself is the visual: pause, stream, gap, stream. This exact timeline returns in Act 10 with labels.

### What to avoid

No architecture, no vocabulary, no diagrams yet. Do not explain anything in this act. The only goal is recognition plus a promise.

## Act 2 — Two programs, not one

### Purpose

Make the fundamental split: the "agent" is a local program (the harness) plus a remote model behind an API. This is the video's equivalent of the git video's architectural inversion — do it early, then spend the rest of the video making it concrete.

### Conceptual point

What sits in the terminal is a program — the **harness**. It draws the UI, reads keystrokes, and when the user presses Enter, it does something almost anticlimactic: it makes an HTTPS request to an API.

On the other side of that API is the **model**: a frozen set of numeric weights — hundreds of billions of numbers — loaded on GPUs in a datacenter. It does not remember, does not learn, does not act. Its only operation: given a sequence of tokens, output a probability distribution for the next one.

Key lines for later narration:

> The model never touches your machine. The harness never predicts a word. Everything you'll see is these two taking turns.

> Nothing the model does during your session changes its weights. It arrived frozen and it stays frozen. "It learned my codebase" is never true — "my codebase is currently in its context" sometimes is.

The audience knows what an API request is — no time is spent explaining HTTP or JSON. The surprise is not the mechanism; it's how ordinary the mechanism is.

### Visual metaphor

The architecture map is born here and persists for the rest of the video: terminal/harness box on the left (the user's machine), an API boundary in the middle, model/GPU on the right. A single round-trip path connects them.

Draw the boundary heavily. The left side is the viewer's laptop; the right side is a shared datacenter. The video will traverse this path once slowly, then many times fast.

### What to avoid

Do not enumerate harness responsibilities yet (tool execution comes in Act 8). Do not explain tokens or context yet. Do not explain web basics. Just the split and the map. Resist saying "loop" — the loop should be discovered in Act 8, not announced.

## Act 3 — The harness assembles the request

### Purpose

Show what actually gets sent when the user presses Enter — and plant statelessness, the fact the whole architecture hinges on.

### Conceptual point

The user typed one line. The harness sends a document.

Into one request, in order, go:

- **tool definitions** — descriptions of what the harness is offering to do (run a command, read a file, edit a file), each with a schema the model can target
- the **system prompt** — the harness's standing instructions: rules, behavioral guidance, environment info (working directory, git status)
- **project instruction files** — the project's own standing notes, injected by the harness (one flash: this is CLAUDE.md, AGENTS.md, Cursor rules — different names, same mechanism)
- the **message history** — every previous turn, in full: user messages, assistant messages, tool results
- finally, at the very bottom: the user's one line

Reveal moment:

> What you typed is a tiny slice of what the model reads.

Worth a beat of its own for this audience: the model does not experience "turns" the way the UI shows them. It sees one long token sequence. The chat framing is a rendering choice of the harness.

Then the load-bearing fact — **the API is stateless**:

> The model will read all of this, respond, and keep nothing. There is no session object on the other side. Next turn, the harness sends everything again — one message longer. The model has no memory; the harness carries the memory for it.

One line, no more: some harnesses can also load extra instruction packages on demand ("skills") and plug in external tools (MCP) — from this video's perspective, just more of the same: content the harness puts into the request. Dedicated video later.

### Visual metaphor

`ContextColumn`: a tall stack that assembles piece by piece — tool definitions, system prompt, project instructions, history, and at the bottom, highlighted, the user's single line, visibly tiny against the whole. This column is a persistent prop: it grows across the video and its prefix will "warm up" in Act 9.

Contrast shot: what the user sees (a chat) vs what the API sees (one long document).

### What to avoid

Do not show a real vendor's system prompt. Do not detail context compaction (one line at most, in Act 9 if anywhere). Do not preempt the cache discussion — statelessness should feel almost wasteful here; the resolution comes later. That tension is deliberate.

## Act 4 — Tokens: the only unit that exists

### Purpose

Before the request crosses the boundary, establish what the model actually reads: tokens, not text.

### Conceptual point

The model never sees characters or words. Server-side, the whole assembled request is chopped into **tokens** — a few characters each — and each token is mapped to a number. The model reads a sequence of integers.

Show a real tokenization of a small code snippet: common words become one token; identifiers split at camelCase; indentation and brackets become their own tokens. For a developer audience this is memorable precisely because the boundaries are unintuitive. (Present it as one tokenizer's output — an example of the phenomenon, not a universal truth.) A useful engineering framing: the tokenizer is a fixed, deterministic compression dictionary built before training; frequent strings get short encodings.

Then the consequences, which the viewer already pays for without naming them:

> Everything is denominated in tokens. Price: per million tokens, input and output priced differently. The context window: a token budget that everything in the request competes for. Generation speed: tokens per second. Every limit and every invoice you've seen is counting these.

### Visual metaphor

`TokenStream`: a line of code shatters into token chips, each chip flipping to reveal its integer ID. The chips then flow along the path toward the API boundary — this chip-flow becomes the standard visual for "data crossing the boundary" for the rest of the video.

### What to avoid

No BPE merge-rule mechanics, no vocabulary-size trivia beyond an approximate "on the order of a hundred thousand possible tokens," no tokenizer comparisons. One snippet, the phenomenon, the three consequences (cost, context, speed), move on.

## Act 5 — Across the boundary: queue and batch

### Purpose

Demystify the serving layer between "the request left my machine" and "a GPU is running my tokens." Deep and narrow, per specs: the queue and continuous batching are explained, not hand-waved.

### Conceptual point

The request first hits an ordinary API front door: authentication, rate limits, validation — the same machinery as any large web API the viewer has built against. Nothing exotic; seconds of screen time.

Then it is routed to an inference cluster where the model's weights sit loaded across GPUs — a frontier model doesn't fit on one GPU; the weights are sharded across several that work as one unit. And here is the part nobody's mental model includes:

> You do not have a GPU. You have a place in line for a shared one.

GPUs are only efficient when processing many sequences at once, so the server runs many users' requests **in the same batch**. Modern schedulers batch at token granularity — *continuous batching*: after every generation step, finished requests leave the batch and queued requests join. Nobody waits for a whole batch to drain. Your request decodes alongside strangers' requests, interleaved step by step. If the cluster is busy, your request waits in the queue first — and that wait is user-visible as extra time before the first word.

One reassuring line: batched requests share hardware, not context — each sequence only ever attends to its own tokens.

### Visual metaphor

`BatchLanes`: the GPU server as a set of parallel lanes; the viewer's token chips (one color) slot into a lane between other users' chip-streams (muted colors). Lanes free up and refill mid-flight — visibly, one finishing while others continue. The viewer's lane stays highlighted; the strangers stay anonymous and grey.

### What to avoid

No vendor-specific infrastructure claims — this is "how LLM serving generically works." No PagedAttention or KV-memory paging detail. The batch is the star of this act; the front door is an establishing shot.

## Act 6 — The floor: inside one prediction

### Purpose

The bottom of the descent. Open up a single forward pass — embeddings, the layer stack, attention with its keys and values, the output distribution — at full conceptual depth. This act is why the runtime was extended: it must genuinely explain the machinery, not gesture at it. The `AttentionLinks` motif is born here, and the words "key" and "value" are planted so that "KV cache" is self-explanatory one act later.

### Conceptual point

Build the forward pass in four steps:

**1. Embeddings — from IDs to vectors.** Each token ID is looked up in a table and becomes a vector: a long list of numbers. This is the model's working representation; from here on, nothing is text. The narration can afford one grounding line: directions in this vector space encode usage — tokens that behave similarly sit near each other. No more than that; no semantic-arithmetic detours.

**2. The layer stack.** The vectors flow through a stack of dozens of identical layers. Each layer refines every token's vector using two ingredients: attention (which mixes information *between* tokens) and a small feed-forward network (which transforms each token's vector on its own). The video names both ingredients once, then focuses entirely on attention — it is the one with consequences the viewer can feel.

**3. Attention — the look-back, with keys and values.** This is the heart of the act and gets the time it needs. Conceptually, engineer-level, no matrices:

- As each token is processed, it publishes two things that stick around: a **key** — a summary that lets later tokens find it — and a **value** — the information it offers if found.
- When the model works on a new token, that token forms a **query**: what am I looking for? The query is compared against *every previous token's key*; the matches are weighted; the corresponding **values** are blended into the new token's vector.
- This happens in every layer, for every token. It is how "the variable declared 400 tokens ago" reaches "the line being written now."

Two properties to land explicitly:

- **Causality:** a token only looks backward. The model reads left to right, like the viewer.
- **Cost:** producing a new token means comparing against everything before it. This is mechanically *why* long contexts cost compute and money — the look-back is real work that grows with context length.

And the scope honesty, one line: how the model learned *what* to put in its keys and values is the training story — a different video. Here, the weights are frozen and this machinery simply runs, on every token of every session.

**4. The output end.** After the last layer, the final vector is projected onto the vocabulary: a score for every possible next token, forming a probability distribution. A sampler picks one — usually a likely one, not always the top one; that choice point is where the knob you know as temperature lives. One line on sampling; no parameter tour.

> One forward pass. One token. That is the model's entire repertoire — everything else in this video is arrangement around it.

### Visual metaphor

The act's spine is one continuous visual: token chips → each becomes a vector (chip unfolds into a column of numbers — `EmbeddingGrid`) → the stack of layers as horizontal bands the vectors rise through → inside a band, the `AttentionLinks` moment: the newest token's chip casts thin lines back to every previous chip; each previous chip glows with its **key** (an icon/tag) and offers its **value** (a payload); the lines' thickness shows the match strength; the blended result flows into the new token's vector.

Key/value visual vocabulary matters: keys and values must be *visibly distinct objects attached to each processed chip*, because the next act will point at exactly these objects and call them the KV cache.

The output end: the final vector fans out into a probability bar-field over candidate tokens; one bar is picked; the chip snaps into existence.

### What to avoid

The hard scope line of the whole video: no matrices, no softmax, no dot products, no multi-head, no positional encodings. Keys/values/queries appear as *roles*, not as linear algebra. No training, no Transformer history, no "why attention changed AI" — that is a future video, and the narration says so in one honest line. Keep numbers approximate and unattributed ("dozens of layers," "on the order of a hundred thousand possible tokens").

## Act 7 — Prefill, decode, and the KV cache

### Purpose

Now that one prediction is understood, explain how a whole response is generated: the prompt processed in one wide pass (prefill), then generation one token at a time (decode) — and the KV cache as the stored look-back state that makes decode viable. Streaming stops being a UI effect here.

### Conceptual point

**Prefill.** The request's thousands of tokens don't need to be generated — they already exist. So the model processes them all in one wide, parallel pass: every prompt token flows through the layers simultaneously, and — the crucial side effect — *every one of them publishes its keys and values along the way*. Prefill is compute-heavy but parallel, and it is the main body of the pause before the first word appears.

**The KV cache, named.** All those published keys and values are kept — per token, per layer — in GPU memory. This store is the **KV cache**: literally, the cache of keys and values. The viewer already knows exactly what these objects are; the name resolves instead of introducing. Its purpose: when predicting token N+1, the model's query compares against the *stored* keys of tokens 1..N and blends their *stored* values. Nothing about the past is recomputed. Without this store, every new token would mean redoing the attention work for the entire sequence — generation cost would explode quadratically with length.

**Decode.** Generation proper: one forward pass produces one token; its keys and values join the cache; the next pass begins. Serial by nature — the next token cannot be computed before the current one exists. This phase sets the tokens-per-second the viewer watches. (One engineer-level line if pacing allows: prefill saturates compute; decode is bound by how fast weights and cache can be read from memory — which is why the two phases feel so different.)

**Streaming.** Each decoded token is detokenized and pushed over the open connection immediately. The punchline that dissolves a misconception:

> The word-by-word streaming in your terminal is not a loading animation. It is the actual cadence of generation — one forward pass per token, each one sent to you the moment it exists.

Latency seed (pays off in Act 10): pause before first word = queue + prefill; streaming speed = decode rate.

### Visual metaphor

Prefill: a wide simultaneous wave sweeps across all prompt chips at once — bright, parallel, fast — and as the wave passes, every chip deposits its key/value pair onto a shelf beneath the sequence. The **shelf** is the act's central prop: a quiet, growing ledger of ghosted key/value pairs. It *is* the KV cache, and it must be visually persistent and distinctive — Act 9 will point at this exact shelf again.

Decode: a metronome — chip, pause, chip, pause. Each new chip fires its `AttentionLinks` lines *into the shelf* (not into the chips themselves — the look-back reads the stored keys/values), then adds its own pair to the shelf. Chips stream back across the boundary as they are produced — the Act 4 chip-flow, now flowing home.

### What to avoid

Do not re-explain attention — point at the machinery from Act 6. No quadratic-complexity math on screen; "the cost would explode with length" in narration is enough. No speculative decoding, no quantization. Keep the compute-bound/memory-bound line to one sentence or cut it.

## Act 8 — The answer is a question: the loop reveals itself

### Purpose

The turn of the video. The streamed response is not prose — it is a structured tool request. The harness executes it, the result rejoins the context, and the loop closes for the first time. This act is deliberately lean: the flow is the teaching, and the gating machinery real harnesses put here is acknowledged in one line and set aside.

### Conceptual point

The tokens that streamed back spell out something structured: a tool call — the tool's name and JSON arguments, "run `npm test`" — and the response ends with a stop reason that says *I'm not done; I need this executed.*

Land the division of labor cleanly:

> The model cannot run anything. It has no shell, no filesystem, no network access to your machine. It can only emit a request and stop. Everything that happens next is the harness.

The harness executes the tool — *locally, on the viewer's machine*. One honest line, no more, marks what the video is skipping: in real harnesses, a policy layer sits exactly here — permission prompts, user-configured hook scripts, sandboxes — deciding whether and how the call runs. Our session runs with everything auto-approved, because the interesting part of this trip is on the other side of the fence. (That layer gets its own video.)

The test failure output is wrapped as a **tool result**, appended to the history — and then the almost-comic beat: the harness sends the entire conversation again. The whole descent — tokens, queue, batch, prefill, decode — happens again. The model, now seeing the failure log in its context, responds with the next tool call: edit the file. Then again: re-run the tests. Each lap, the same flow — prompt in, tool call out, execution, result appended, prompt in.

> This is the agent: not a mind, a loop. Model proposes, harness executes, result goes back in, repeat until the model answers in plain text and stops asking.

The word "agent" gets its definition here, at the moment the viewer can see all of its parts. From the API's point of view, note, there is no session at all — just a series of independent, ever-growing requests. The loop, and therefore the agent, exists entirely in the harness.

### Visual metaphor

The round-trip path on the persistent map finally closes into a visible **cycle**: `LoopArrow`. The tool call renders as a `ToolCallCard` traveling from model to harness; the command executes in the terminal pane (the real one from Act 1); a `ToolResultCard` clips onto the bottom of the `ContextColumn`, which visibly grows. Then the whole request flies across the boundary again — fast replay of Acts 4–7 in two or three seconds.

The policy one-liner can land visually as a small gate icon on the tool call's path that the cards pass through with a soft "auto-approved" tick — present, named once, never dwelt on.

The second and third laps run progressively faster: the loop as choreography, same path, different payloads (run tests → edit file → run tests again).

### What to avoid

Do not name every real tool a harness might have — three (run/read/edit) carry the example. Do not expand the policy mention into a beat: no hook lifecycle events, no permission modes, no per-tool comparisons of gating features. Parallel tool calls: one line if it fits, no beat. Subagents: at most one line. MCP already had its line in Act 3.

## Act 9 — Why this isn't insane: the two caches

### Purpose

Resolve the tension planted in Act 3. Re-sending an ever-growing conversation dozens of times per task sounds ruinously wasteful. The reason it isn't is the headline teaching point: two caches, two layers, one mechanism. With the KV cache already fully mechanistic from Act 7, this act earns its payoff cleanly.

### Conceptual point

Frame the problem first, with honest numbers-by-proportion: by lap five, the context is enormous — system prompt, project instructions, five turns of history, four fat tool results — and the harness re-sends *all of it*. Does the GPU redo prefill on the whole thing every lap?

No — and the viewer has already seen every piece needed to understand why.

**The prompt cache** (API level, between requests): turn N's request begins with *exactly* turn N−1's request — same tool definitions, same system prompt, same history, just new content appended at the end. The server checks the incoming request against recently seen **prefixes** — an exact match over the rendered request, in order — and when it finds one, it skips recomputing the entire matched prefix and prefills only the new tail. Two user-visible consequences: cached input is billed at roughly an order of magnitude less than fresh input, and time-to-first-token collapses on warm turns. This is not an optimization footnote; the agent-loop pattern — full history re-sent per iteration, dozens of iterations per task — is only economically viable because of it.

**What is actually saved?** Bring back the shelf. The stored state for that prefix is its **KV cache** — the keys and values every prefix token published when it was first processed. The bridge fact, stated plainly:

> The two caches are one mechanism at two timescales. The KV cache is the attention memory built during one generation. The prompt cache is that same memory kept alive between requests, for a prefix that hasn't changed. (Phrased carefully: "in practice, this is how it works" — prefix semantics and pricing are documented; exact vendor internals are not.)

**Position sensitivity** — worth real screen time because it explains observable harness behavior: the match is an exact prefix match. Change one early byte — a timestamp in the system prompt, a reordered tool definition — and everything after that point goes cold and must be reprocessed at full price. This is *why* harnesses keep system prompts frozen, append instead of editing history, and put stable content first. Cache lifetime is short — minutes, refreshed on each use — which is fine, because loop iterations arrive seconds apart.

One line, no more: context is still finite, so on very long sessions the harness also has to *manage* it — summarizing old turns, dropping stale tool output. Another harness duty; not this video's story.

### Visual metaphor

`CacheHighlight` on the persistent `ContextColumn`: the entire prefix shifts to a "warm" state (color-pulse, not motion), with only the newly appended tail rendered cold and being processed. Across laps, the warm region grows and the cold tail stays thin.

The shelf makes its final return: shown *persisting across the request boundary* — the same ghosted key/value pairs, still there when the next request arrives, matched against the incoming prefix chip by chip. When the position-sensitivity demo plays, one early chip changes color, and everything downstream of it — column and shelf both — visibly drains from warm to cold.

Contrast shot: first turn (everything cold, long prefill wave) vs later turn (long warm prefix, tiny cold tail, near-instant first token).

### What to avoid

No exact prices, ratios, or TTLs — "roughly an order of magnitude" and "minutes" are the precision ceiling; date-stamp anything more specific. Do not re-explain attention or the KV mechanism — point at the shelf. Do not claim knowledge of any specific vendor's implementation.

## Act 10 — Closing: the rhythm, labeled

### Purpose

Pay off the cold open. Replay the Act 1 session timeline with every pause and burst annotated with the layer that caused it. Latency anatomy as synthesis — no new concepts.

### Conceptual point

The same session replays, now over the completed architecture map, with labels landing on each phase:

- **The pause before the first word** = network + queue + prefill. Long on the first turn (cold cache, giant system prompt), short on later turns (warm prefix, tiny tail).
- **The fluent streaming** = decode: one token per forward pass, roughly constant speed.
- **The silent gaps mid-answer** = the harness running tools locally. The model isn't thinking during these; it isn't running at all — its next request hasn't been sent yet.

Final synthesis, spoken over the full map:

> The model is frozen weights that predict the next token — one forward pass, one look-back over everything before, one sampled token.
>
> The harness is the program that carries the memory, runs the tools, and enforces the rules.
>
> The agent is the loop between them.
>
> Everything is tokens; the caches are why the loop is affordable.
>
> And the rhythm you feel every day is the architecture, felt from the outside.

The viewer should leave not with commands memorized but with the pauses explained — they'll re-experience the rhythm tomorrow, and it will read as machinery.

### Visual metaphor

The Act 1 terminal pane and the persistent architecture map on screen together for the first time, connected: each segment of the session timeline lights up the corresponding piece of the map. The final frame is the completed map at rest — harness, boundary, queue, GPU, loop arrow, warm context column, quiet shelf.

### What to avoid

No new vocabulary, no teasers beyond at most one line for the future videos (training/attention history; Skills + MCP). Do not rush the replay — this act is the reward.

## Conceptual progression

1. The session has a felt rhythm. (Act 1)
2. The "agent" is two things: a local harness and a remote frozen model. (Act 2)
3. The harness sends a document, not a message — and the API keeps nothing. (Act 3)
4. The model reads tokens, and everything is priced in them. (Act 4)
5. The request queues and batches onto shared GPUs. (Act 5)
6. One prediction = embeddings → layers → attention (queries against stored keys, blending values) → distribution → sampled token. (Act 6)
7. Prefill processes the prompt in parallel and fills the KV cache; decode generates serially against it; streaming is the decode cadence. (Act 7)
8. The model's answer is a tool request; the harness runs it locally, appends the result, and loops. The agent is the loop. (Act 8)
9. The prompt cache is the KV cache kept alive between requests; exact-prefix matching makes it position-sensitive; it makes the loop affordable. (Act 9)
10. The rhythm was the architecture all along. (Act 10)

## Major visual metaphors

### The persistent map

One architecture diagram — terminal/harness, API boundary, queue/batch, GPU — born in Act 2 and on screen (or one cut away) for the rest of the video. Detail accrues on it; it is never redrawn from scratch. The closing act plays on the completed map.

### The descent and the laps

The first traversal (Acts 3–7) is slow and zoomed-in; the loop laps in Act 8 replay the same path fast. Same route, different tempo — the tempo change *is* the teaching.

### Token chips

Text shatters into chips (Act 4); chips flow across the boundary, through batch lanes, through the forward pass, and back. The chip is the video's particle of everything: cost, context, speed.

### AttentionLinks and the shelf (recurring motif)

The look-back lines appear in Act 6 (attention, with keys and values as visible objects), the published key/value pairs accumulate on a shelf in Act 7 (the KV cache, named), and the shelf persists across request boundaries in Act 9 (the prompt cache). One visual carries three concepts across three acts; each return should be recognizable, not re-explained.

### The growing, warming column

The `ContextColumn` assembles in Act 3, grows with every tool result in Act 8, and turns warm from the top down in Act 9. It is the single best prop for statelessness, context growth, and caching — treat it as a character with a clear lifetime.

## Pacing intent

Target duration is 12–18 minutes (specs updated; up to 20 acceptable). Clarity outranks compression: the deep acts (6, 7, 9) must never feel rushed. Suggested budget (~15 min center):

- Act 1 (cold open): 40–60 s
- Act 2 (two programs): 60–80 s
- Act 3 (the request): 80–105 s
- Act 4 (tokens): 60–80 s
- Act 5 (queue and batch): 70–90 s
- Act 6 (inside one prediction): 130–170 s
- Act 7 (prefill/decode/KV cache): 100–130 s
- Act 8 (the loop): 80–105 s
- Act 9 (two caches): 100–130 s
- Act 10 (rhythm labeled): 60–80 s

Acts 6 and 7 together are the technical heart (~4–5 minutes) and were deliberately given room by the runtime extension; Act 8 was deliberately slimmed (policy layer reduced to a mention) to keep the video's weight on the model/serving side. If the total drifts past 18 minutes, trim by tightening transitions and Act 2/5 establishing material — never by shallowing Acts 6, 7, or 9. If it drifts under 12, resist padding; shorter is fine if clarity is achieved.

## Tone

Calm, precise, practical — same family as the containers and git videos. Friendly-professional; explain terms rather than avoiding them.

The audience calibration is explicit: engineers who use coding agents daily. Skip anything hyper-basic — APIs, JSON, processes, what a terminal is — and never explain *around* a deep concept when the concept itself can be explained. Where a mechanism has a real name (prefill, decode, KV cache, continuous batching), teach the real name; this audience wants the vocabulary that lets them read engineering blogs afterwards.

The recurring emotional note is *demystification without deflation*: each layer is individually mundane, and the wonder is that the mundane layers compose into something that fixes your tests. "It's just a loop" should land as relief and power, not as dismissal.

Recommended tone:

- respectful of the viewer's daily-use expertise; they know the rhythm better than anyone
- mechanical, never mystical, about the model
- honest about scope lines ("how these weights got their values is a different story — a future one")
- playful only in small places (the almost-comic re-sending of everything; the tiny user line under the giant system prompt)

Avoid:

- anthropomorphizing: the model never "decides to look at your files" — it emits a tool request; the harness reads the files. Narration should model the precise phrasing it wants the viewer to adopt.
- vendor-war framing; tool names appear only in the single "different names, same mechanism" flash (project instruction files, Act 3)
- "it's just autocomplete" dismissiveness — statistically true, rhetorically false, and it teaches nothing
- awe-of-scale filler ("billions of parameters!!") without a mechanical point attached
- condescension in either direction: no "as you surely know" hedging, and no explaining HTTP to a backend engineer

## What each act must achieve

### Act 1 must achieve
The viewer recognizes the session rhythm as theirs and accepts the promise that every pause will be explained.

### Act 2 must achieve
The viewer holds the split: local harness program vs remote frozen model, connected by an API. The persistent map exists.

### Act 3 must achieve
The viewer understands the request contains everything, every turn — and that the API remembers nothing between requests.

### Act 4 must achieve
The viewer understands tokens as the universal unit of cost, context, and speed.

### Act 5 must achieve
The viewer understands their request queues and batches onto shared GPUs alongside strangers' requests, at token granularity.

### Act 6 must achieve
The viewer can narrate one forward pass: token IDs become vectors; each layer lets every token query the keys of all previous tokens and blend their values; the output is a distribution and a sampler picks. "Key" and "value" are now meaningful words.

### Act 7 must achieve
The viewer can distinguish prefill (parallel, fills the KV cache, causes the pre-first-word pause) from decode (serial, reads the cache, sets streaming speed), and knows the KV cache is the stored keys and values.

### Act 8 must achieve
The viewer understands the agent as harness-driven loop: model proposes, harness executes locally, result appended, repeat. "Agent" is now a precise word — and the viewer knows (in one line) that a policy layer exists at the tool-call boundary in real harnesses.

### Act 9 must achieve
The viewer can disambiguate the two caches, state their relationship (same state, two timescales), explain position sensitivity, and explain why the re-send-everything architecture is affordable.

### Act 10 must achieve
The viewer maps every segment of a familiar session rhythm onto the architecture, with zero new concepts.

## What each act should avoid

### Act 1 should avoid
Explaining anything. Labels, vocabulary, diagrams.

### Act 2 should avoid
Harness responsibility lists, the word "loop," token/context detail, web basics.

### Act 3 should avoid
Real vendor system prompts; compaction detail; resolving the wastefulness tension early.

### Act 4 should avoid
BPE merge mechanics; tokenizer comparisons; presenting one tokenizer's splits as universal.

### Act 5 should avoid
Vendor infrastructure claims; PagedAttention and memory-management internals.

### Act 6 should avoid
Matrices, softmax, dot products, multi-head, positional encodings; training; Transformer history; semantic-space detours.

### Act 7 should avoid
Re-explaining attention; on-screen complexity math; speculative decoding; quantization.

### Act 8 should avoid
Tool catalogs; expanding the policy mention into a beat (no hook events, no permission modes); more than one line each for parallel tool calls and subagents.

### Act 9 should avoid
Exact prices/TTLs; vendor-internals claims; re-explaining the KV mechanism from scratch.

### Act 10 should avoid
Any new concept; more than one line of future-video teasing.

## Downstream guidance for beats

The beats phase should preserve the descent-then-loop shape: the viewer must reach the GPU floor *before* the first tool call comes back, so the fast laps in Act 8 can compress a journey the viewer has already taken slowly. The key/value vocabulary must be planted in the attention beats (Act 6) so the KV-cache beat (Act 7) and the prompt-cache beats (Act 9) resolve names instead of introducing them.

A likely beat sequence:

1. Cold open: the session rhythm, unlabeled; the promise.
2. Enter pressed — the harness is a program; it makes an API call.
3. The other side: frozen weights on GPUs; predict-next-token is the only operation.
4. The persistent map appears: harness | boundary | model.
5. The request assembles: tools, system prompt, project instructions, history, the tiny user line.
6. One long token sequence — "turns" are a UI rendering, not the model's experience.
7. Statelessness: the server will keep nothing; the harness carries the memory.
8. Text shatters into tokens; IDs; cost/context/speed all denominated in tokens.
9. Front door: auth, rate limits — ordinary API machinery, seconds only.
10. The queue and the batch: shared GPUs, strangers' lanes, token-granularity turnover; hardware shared, context not.
11. Embeddings: chips become vectors; the model computes with numbers, never text.
12. The layer stack: attention mixes between tokens; feed-forward transforms each alone.
13. Attention in full: each processed token publishes a key and a value; the new token's query searches the keys, blends the values (AttentionLinks born). Causality and cost land here.
14. The output end: distribution over the vocabulary; the sampler picks (one line; temperature name-checked).
15. Prefill: the parallel wave; every prompt token's keys/values deposited on the shelf.
16. The shelf named: the KV cache — and why decode would be quadratic without it.
17. Decode: the metronome; each new token reads the shelf, joins the shelf; streaming is this cadence, pushed token by token.
18. The streamed answer is a tool call; stop reason says "I need this executed."
19. The tool runs locally (auto-approved; one line notes the policy layer real harnesses put here); result clips onto the context column; the entire request flies again — the loop closes. "Agent" defined.
20. Laps two and three, fast (run tests → edit file → run tests again); the column grows.
21. The wastefulness objection, stated honestly.
22. The prompt cache: exact-prefix match; warm prefix, cold tail; order-of-magnitude cheaper, near-instant first token.
23. The bridge: the prompt cache is the shelf, persisted between requests.
24. Position sensitivity: one early byte changes, everything downstream drains cold — why system prompts stay frozen and history is append-only.
25. The rhythm replayed, labeled: queue+prefill / decode / local tools.
26. Final synthesis over the completed map.

Beats should keep the single "different names, same mechanism" flash (project instruction files near beat 5) to a few seconds — proof of generality, not a comparison segment. The policy-layer mention in beat 19 is one narrated line with a small gate visual; it must not grow into a beat of its own.

## Gate status

`ready` — the beats phase is unblocked.
