---
type: beats
status: ready
depends_on:
  - 00-specs.md
  - 01-research.md
  - 02-treatment.md
---

# 03 — Beats: How coding agents and LLMs work together, from keystroke to GPU

## Beat intent

Turn the approved treatment into focused explanatory units that can become narration segments and scene timeline references.

The sequence must preserve the treatment's shape:

```text
rhythm (unlabeled) -> split -> descent (request -> tokens -> queue -> forward pass -> prefill/decode) -> loop -> caches -> rhythm (labeled)
```

And the final memory:

```text
agent = harness loop + frozen next-token predictor, passing tokens back and forth
```

Two structural rules from the treatment are binding for every downstream phase:

1. The viewer reaches the GPU floor (Acts 6–7) **before** the first tool call returns, so the fast laps in Act 8 compress a journey already taken slowly.
2. The words **key** and **value** are planted in the attention beats (`b015`–`b016`) so that "KV cache" (`b020`) and the prompt-cache bridge (`b029`) resolve names instead of introducing them.

## Running example: the demo session

One concrete session carries Acts 1, 8, and 10, and every abstract beat points back to it. Downstream phases must use these exact details so the cold open, the loop laps, and the labeled replay are recognizably the same session.

**Project:** a small Node utility library. Relevant files:

- `src/format.js` — exports `formatPrice(amount)`; currently builds the string with the raw number, so `formatPrice(1234.5)` returns `"$1,234.5"`.
- `test/format.test.js` — expects `formatPrice(1234.5)` to equal `"$1,234.50"`.

**User input:** `fix the failing test` (one line, then Enter).

**Tool definitions offered by the harness (three only):** run a command, read a file, edit a file.

**The session, lap by lap:**

| Lap | Model output (streamed) | Tool executed by harness | Tool result appended |
| --- | --- | --- | --- |
| 1 | Short text ("I'll run the tests first.") + tool call: run `npm test` | `npm test` (the long silence — tests take a few seconds) | 1 test failed: expected `"$1,234.50"`, received `"$1,234.5"` |
| 2 | Short text naming the bug (missing two-decimal formatting) + tool call: edit `src/format.js` to format with two decimals | File edit (near-instant — the short gap) | Edit applied |
| 3 | Tool call: run `npm test` again | `npm test` (second silence) | All tests pass |
| 4 | Plain-text answer summarizing the fix; no tool call; the loop exits | — | — |

**The felt rhythm (Act 1 cold open, replayed labeled in Act 10):**

```text
[pause A: long]  -> stream -> [silence 1: npm test] -> [pause B: short] -> stream
-> [gap: edit]   -> [pause C: short] -> stream tool call -> [silence 2: npm test]
-> [pause D: short] -> final answer streams
```

Labels land only in Act 10: pause A = network + queue + cold prefill; pauses B–D = warm prefix, tiny tail; streams = decode cadence; silences and gap = the harness running tools locally, with no request in flight.

## Act map

Beats are intentionally granular for downstream reference IDs; the scene timeline may group nearby beats into fewer visual scenes when one diagram carries several ideas. Pacing targets come from the treatment budget (~15 min center; 12–18 min range).

| Act | Beat range | Purpose | Pacing intent |
| --- | --- | --- | --- |
| Act 1 | `b001`–`b002` | Cold open on the felt session rhythm; make the promise. | 40–60s |
| Act 2 | `b003`–`b005` | Split the "agent" into local harness + remote frozen model; the persistent map is born. | 60–80s |
| Act 3 | `b006`–`b008` | The request is a document; the API is stateless; the harness carries the memory. | 80–105s |
| Act 4 | `b009`–`b010` | Tokens as the only unit: cost, context, speed. | 60–80s |
| Act 5 | `b011`–`b012` | The front door, the queue, and continuous batching on shared GPUs. | 70–90s |
| Act 6 | `b013`–`b018` | Inside one forward pass: embeddings, layers, attention with keys and values, sampled output. | 130–170s |
| Act 7 | `b019`–`b022` | Prefill fills the KV cache; decode reads it; streaming is the decode cadence. | 100–130s |
| Act 8 | `b023`–`b026` | The answer is a tool call; the harness executes; the loop closes; "agent" is defined. | 80–105s |
| Act 9 | `b027`–`b030` | The wastefulness objection; the prompt cache; the bridge to the KV cache; position sensitivity. | 100–130s |
| Act 10 | `b031`–`b033` | The rhythm replayed with labels; final synthesis over the completed map. | 60–80s |

## Reviewer alignment notes

- Acts 6, 7, and 9 are expanded beyond the treatment's 26-item sketch because they are the technical heart; the extra IDs exist for narration and scene-timeline precision, not extra runtime.
- Scope lines from the treatment are enforced at beat level: no matrices, softmax, dot products, multi-head, or positional encodings (`b015`–`b016` present query/key/value as roles); no training story beyond the one honest line in `b017`; no vendor-internals claims in the cache beats (`b028`–`b030`).
- Three one-liners must stay one-liners and are folded into host beats rather than owning beats: skills/MCP (`b006`), the policy/permission gate (`b024`), context management/compaction (`b030`).
- Numbers stay approximate and unattributed: "dozens of layers," "on the order of a hundred thousand possible tokens," "roughly an order of magnitude cheaper," "minutes" for cache lifetime. No prices, ratios, or TTLs.
- Tokenization in `b009` is presented as one tokenizer's output — an example of the phenomenon, not a universal truth.
- Narration must model precise phrasing: the model "emits a tool request"; it never "decides to look at your files," "thinks," or "learns your codebase."

## Beat list

```yaml
beats:
  - id: b001
    act: act-1
    title: "The rhythm you already know"
    purpose: "Start inside the viewer's daily experience before any architecture."
    key_idea: "A real session plays out: 'fix the failing test', Enter, a pause, streaming text, a long silence while tests run, more streaming — a rhythm every daily user knows by feel."
    visual_hint: "TerminalPane at natural (tightened) speed playing the demo session's felt-rhythm timeline. No labels, no diagrams, no vocabulary."
    transition_to_next: "Hold on the rhythm and name it as something the viewer recognizes but cannot yet explain."

  - id: b002
    act: act-1
    title: "The promise"
    purpose: "Commit the video to its payoff."
    key_idea: "Every pause and every burst in this rhythm is caused by a specific piece of machinery, and by the end the viewer will be able to name all of them."
    visual_hint: "The session timeline freezes as a horizontal strip with unlabeled segments — the same strip that returns fully labeled in Act 10."
    transition_to_next: "Rewind to the moment of Enter and ask what is actually sitting in the terminal."

  - id: b003
    act: act-2
    title: "The thing in your terminal is a program"
    purpose: "Introduce the harness as an ordinary local program."
    key_idea: "The 'agent' in the terminal is the harness: a program that draws the UI, reads keystrokes, and on Enter does something almost anticlimactic — it makes an HTTPS request to an API."
    visual_hint: "The TerminalPane pulls back to reveal it is one box labeled 'harness' on the viewer's machine; a request arrow leaves it toward the right edge of the screen."
    transition_to_next: "Follow the request arrow to what is on the other side."

  - id: b004
    act: act-2
    title: "The other side is frozen weights"
    purpose: "Define the model mechanically before any behavior is discussed."
    key_idea: "The model is a frozen set of numeric weights on GPUs in a datacenter; its only operation is: given a sequence of tokens, output a probability distribution for the next one. It does not remember, learn, or act — nothing in a session changes its weights."
    visual_hint: "On the right side, a model block: a dense, static field of numbers with a single input arrow (token sequence) and single output arrow (next-token distribution)."
    transition_to_next: "Place both sides on one map and draw the line between them."

  - id: b005
    act: act-2
    title: "The persistent map is born"
    purpose: "Create the architecture map that stays on screen for the rest of the video."
    key_idea: "Harness on the left (the viewer's laptop), model on the right (a shared datacenter), an API boundary between them; the model never touches your machine, the harness never predicts a word — everything that follows is these two taking turns."
    visual_hint: "PersistentMap assembles: harness box | heavy vertical API boundary | model/GPU box, connected by a single round-trip path. The boundary line is drawn emphatically."
    transition_to_next: "Zoom to the harness side at the instant of Enter: what exactly does it send?"

  - id: b006
    act: act-3
    title: "The harness sends a document"
    purpose: "Show what one request actually contains."
    key_idea: "The user typed one line; the harness sends a document — in order: tool definitions (run a command, read a file, edit a file, each with a schema), the system prompt, project instruction files (one flash: CLAUDE.md, AGENTS.md, Cursor rules — different names, same mechanism), the full message history, and at the very bottom the user's one line, visibly tiny. One line only: skills and MCP tools are just more content the harness can put here."
    visual_hint: "ContextColumn assembles piece by piece as a tall labeled stack; the user's line is highlighted at the bottom, tiny against the whole. The project-instructions flash lasts a few seconds, no comparison table."
    transition_to_next: "Contrast what the user sees with what the API receives."

  - id: b007
    act: act-3
    title: "One long sequence, not turns"
    purpose: "Break the chat-UI framing before tokens are introduced."
    key_idea: "The model does not experience turns; it reads one long token sequence. The chat layout is a rendering choice of the harness."
    visual_hint: "Contrast shot: left, the familiar chat bubbles; right, the same content as one continuous unbroken document. The bubbles' borders dissolve into the single column."
    transition_to_next: "State what the server will do with this document after responding: nothing."

  - id: b008
    act: act-3
    title: "The API keeps nothing"
    purpose: "Plant statelessness, the fact the whole architecture hinges on."
    key_idea: "The API is stateless: the model reads everything, responds, and keeps nothing — no session object exists on the other side. Next turn the harness sends everything again, one message longer; the harness carries the memory. This should feel almost wasteful — that tension is deliberate and resolves in Act 9."
    visual_hint: "The ContextColumn crosses the boundary, is read, and the server side wipes clean; the column snaps back to the harness side, which visibly retains it."
    transition_to_next: "Before the document crosses the boundary, look at what the model actually reads: not text."

  - id: b009
    act: act-4
    title: "Text shatters into tokens"
    purpose: "Establish tokens as the model's only input reality."
    key_idea: "Server-side, the request is chopped into tokens — a few characters each, mapped to integer IDs; the model reads a sequence of integers. A real code snippet tokenizes memorably: common words are one token, identifiers split at camelCase, indentation and brackets stand alone. The tokenizer is a fixed, deterministic compression dictionary built before training. Present as one tokenizer's output, not a universal truth."
    visual_hint: "TokenStream: a line from src/format.js shatters into token chips; each chip flips to reveal its integer ID."
    transition_to_next: "Attach the three consequences the viewer already pays for."

  - id: b010
    act: act-4
    title: "Everything is denominated in tokens"
    purpose: "Make tokens the universal unit of cost, context, and speed."
    key_idea: "Price is per million tokens (input and output priced differently); the context window is a token budget everything in the request competes for; generation speed is tokens per second. Every limit and invoice the viewer has seen is counting these chips."
    visual_hint: "Three quick annotations orbit the chip stream — a price tag, a budget bar, a speedometer — then the chips flow along the path toward the API boundary (this chip-flow becomes the standard 'data crossing the boundary' visual)."
    transition_to_next: "Cross the boundary with the chips and land at the API front door."

  - id: b011
    act: act-5
    title: "An ordinary front door"
    purpose: "Demystify the serving entry point in seconds."
    key_idea: "The request hits ordinary large-API machinery — authentication, rate limits, validation — then routes to an inference cluster where the model's weights sit sharded across several GPUs working as one unit; a frontier model does not fit on one GPU."
    visual_hint: "A brief establishing shot: the chip-stream passes standard API gate icons, then approaches a GPU block that subdivides into several linked GPUs sharing one weights texture."
    transition_to_next: "Reveal the part nobody's mental model includes: the hardware is shared."

  - id: b012
    act: act-5
    title: "A place in line for a shared GPU"
    purpose: "Explain the queue and continuous batching honestly."
    key_idea: "You do not have a GPU; you have a place in line for a shared one. GPUs are efficient only when processing many sequences at once, so many users' requests run in the same batch — and modern schedulers batch at token granularity (continuous batching): after every generation step, finished requests leave and queued ones join. If the cluster is busy, the wait is user-visible as extra time before the first word. Reassurance: batched requests share hardware, not context — each sequence attends only to its own tokens."
    visual_hint: "BatchLanes: parallel lanes on the GPU server; the viewer's chips (brand color) slot between strangers' muted-grey chip-streams; one lane finishes and refills mid-flight while others continue. The viewer's lane stays highlighted."
    transition_to_next: "Zoom from the lanes into what actually happens to the viewer's tokens: one prediction."

  - id: b013
    act: act-6
    title: "Embeddings: IDs become vectors"
    purpose: "Move from integers to the model's working representation."
    key_idea: "Each token ID is looked up in a table and becomes a vector — a long list of numbers. From here on, nothing is text. One grounding line only: directions in this space encode usage; tokens that behave similarly sit near each other."
    visual_hint: "EmbeddingGrid: each chip unfolds into a column of numbers; the chips' text fades, leaving pure number-columns standing in sequence."
    transition_to_next: "Send the vectors upward into the stack of layers."

  - id: b014
    act: act-6
    title: "The layer stack"
    purpose: "Frame the two ingredients of every layer, then commit to attention."
    key_idea: "The vectors flow through dozens of identical layers. Each layer refines every token's vector with two ingredients: attention, which mixes information between tokens, and a small feed-forward network, which transforms each token's vector on its own. Both are named once; the video follows attention — the ingredient with consequences the viewer can feel."
    visual_hint: "The vector-columns rise through horizontal layer bands. One band expands to show its two internal stages; the feed-forward stage dims after being named, the attention stage brightens."
    transition_to_next: "Enter the attention stage and watch a token being processed."

  - id: b015
    act: act-6
    title: "Every token publishes a key and a value"
    purpose: "Plant the two words the entire cache story depends on."
    key_idea: "As each token is processed, it publishes two things that stick around: a key — a summary that lets later tokens find it — and a value — the information it offers if found. These are the vocabulary seeds for the KV cache; they must land as distinct, memorable objects."
    visual_hint: "Inside the attention band, each processed chip grows two small attached objects with distinct shapes: a key tag and a value payload. They persist visibly on every chip."
    transition_to_next: "Bring in a new token that needs something from the past."

  - id: b016
    act: act-6
    title: "The look-back: query against every key"
    purpose: "Show attention as search-and-blend; birth of the AttentionLinks motif."
    key_idea: "The token being processed forms a query — what am I looking for? The query is compared against every previous token's key; matches are weighted; the corresponding values are blended into the new token's vector. This happens in every layer, for every token — it is how the variable declared 400 tokens ago reaches the line being written now."
    visual_hint: "AttentionLinks born: the newest chip casts thin lines back to all previous chips; line thickness shows match strength; matched keys glow and their values flow along the lines into the new chip's vector."
    transition_to_next: "State the two properties of this look-back that the viewer will feel later."

  - id: b017
    act: act-6
    title: "Causality and cost"
    purpose: "Land the two attention properties with consequences, plus the scope-honesty line."
    key_idea: "Causality: a token only looks backward — the model reads left to right, like the viewer. Cost: producing a new token means comparing against everything before it, which is mechanically why long contexts cost compute and money. One honest line: how the model learned what to put in its keys and values is the training story — a different video; here the frozen machinery simply runs."
    visual_hint: "The AttentionLinks fan visibly points only leftward; then the fan widens as the sequence lengthens, with a subtle cost meter rising alongside."
    transition_to_next: "Follow the final vector out of the top of the stack."

  - id: b018
    act: act-6
    title: "A distribution, a sample, a token"
    purpose: "Close the forward pass at the output end."
    key_idea: "After the last layer, the final vector is projected onto the vocabulary: a score for every possible next token — on the order of a hundred thousand — forming a probability distribution. A sampler picks one, usually likely, not always the top; that choice point is where the knob called temperature lives (one line, no parameter tour). One forward pass, one token: the model's entire repertoire."
    visual_hint: "The final vector fans out into a probability bar-field over candidate tokens; one bar is picked and the new chip snaps into existence at the end of the sequence."
    transition_to_next: "Zoom back out: a whole response is thousands of these. How is that not impossibly slow?"

  - id: b019
    act: act-7
    title: "Prefill: the parallel wave"
    purpose: "Explain how the prompt is processed all at once."
    key_idea: "The request's thousands of tokens already exist, so the model processes them in one wide parallel pass — every prompt token flows through the layers simultaneously, and crucially, every one publishes its keys and values along the way. Prefill is compute-heavy but parallel, and it is the main body of the pause before the first word."
    visual_hint: "A wide bright wave sweeps across all prompt chips at once; as it passes, every chip deposits its key/value pair onto a shelf beneath the sequence — the KVShelf, the act's central persistent prop."
    transition_to_next: "Name the shelf that just filled up."

  - id: b020
    act: act-7
    title: "The shelf has a name: KV cache"
    purpose: "Resolve — not introduce — the term using the planted vocabulary."
    key_idea: "The published keys and values are kept, per token per layer, in GPU memory: the KV cache — literally the cache of keys and values. When predicting token N+1, the query compares against stored keys and blends stored values; nothing about the past is recomputed. Without it, every new token would redo the attention work for the whole sequence and generation cost would explode with length."
    visual_hint: "The KVShelf gets its label: 'KV cache'. A ghosted before/after: without the shelf, the AttentionLinks re-derive every key/value each step (frantic, wasteful); with it, links calmly read the shelf."
    transition_to_next: "With the cache in place, watch generation proper begin."

  - id: b021
    act: act-7
    title: "Decode: the metronome"
    purpose: "Show serial generation and what sets streaming speed."
    key_idea: "Decode: one forward pass produces one token; its key and value join the cache; the next pass begins. Serial by nature — the next token cannot be computed before the current one exists. This phase sets the tokens-per-second the viewer watches. Optional single line: prefill saturates compute; decode is bound by how fast weights and cache can be read from memory — why the two phases feel so different."
    visual_hint: "A metronome rhythm: chip, pause, chip, pause. Each new chip fires AttentionLinks into the KVShelf (not into the chips — the look-back reads the store), then adds its own pair to the shelf."
    transition_to_next: "Follow each new token out of the datacenter the moment it exists."

  - id: b022
    act: act-7
    title: "Streaming is the decode cadence"
    purpose: "Dissolve the loading-animation misconception; seed the latency anatomy."
    key_idea: "Each decoded token is detokenized and pushed over the open connection immediately. The word-by-word streaming in the terminal is not a loading animation — it is the actual cadence of generation, one forward pass per token. Latency seed for Act 10: pause before the first word = queue + prefill; streaming speed = decode rate."
    visual_hint: "Chips stream back across the boundary as they are produced — the Act 4 chip-flow now flowing home — and materialize as words in the TerminalPane at the same beat as the decode metronome."
    transition_to_next: "Read what those streamed tokens actually spell out."

  - id: b023
    act: act-8
    title: "The answer is a question"
    purpose: "The turn of the video: the response is a structured tool request."
    key_idea: "The streamed tokens spell out something structured: a tool call — the tool's name and JSON arguments, run `npm test` — and the response ends with a stop reason that says: I'm not done; I need this executed."
    visual_hint: "The streamed text in the TerminalPane re-renders as a ToolCallCard (tool name + arguments), with the stop reason highlighted at its foot."
    transition_to_next: "Establish who can act on this request — and who cannot."

  - id: b024
    act: act-8
    title: "The harness executes, locally"
    purpose: "Land the division of labor; keep the policy layer to its one line."
    key_idea: "The model cannot run anything — no shell, no filesystem, no network access to the viewer's machine; it can only emit a request and stop. The harness executes the tool locally. One line, no more: real harnesses place a policy layer exactly here — permission prompts, hooks, sandboxes — deciding whether and how the call runs; this session runs auto-approved because the interesting part of this trip is on the other side of the fence."
    visual_hint: "The ToolCallCard travels from model to harness across the map, passes a small GateIcon with a soft 'auto-approved' tick, and `npm test` visibly runs in the real TerminalPane from Act 1 — the first long silence, now explained."
    transition_to_next: "Take the test failure and put it where everything goes: into the context."

  - id: b025
    act: act-8
    title: "The loop closes — 'agent' defined"
    purpose: "Reveal the loop and give the video's central word its precise meaning."
    key_idea: "The failure output is wrapped as a tool result and appended to the history — and then, almost comically, the harness sends the entire conversation again; the whole descent (tokens, queue, prefill, decode) happens again. This is the agent: not a mind, a loop — model proposes, harness executes, result goes back in, repeat until the model answers in plain text and stops asking. From the API's point of view there is no session at all, only independent ever-growing requests; the loop, and therefore the agent, lives entirely in the harness."
    visual_hint: "A ToolResultCard clips onto the bottom of the ContextColumn, which visibly grows; the round-trip path on the PersistentMap closes into the LoopArrow cycle; the full request flies across the boundary again as a 2–3 second fast replay of Acts 4–7."
    transition_to_next: "Run the remaining laps at loop speed."

  - id: b026
    act: act-8
    title: "Laps two and three, fast"
    purpose: "Compress the journey the viewer has already taken slowly; exit the loop."
    key_idea: "Lap two: the model, now seeing the failure log in context, emits the next tool call — edit src/format.js to format with two decimals. Lap three: run `npm test` again; all tests pass. Lap four: the model answers in plain text with no tool call, and the loop exits. Same flow every lap: prompt in, tool call out, execution, result appended."
    visual_hint: "The LoopArrow choreography runs progressively faster: edit-file card, then run-tests card, each with its GateIcon tick, each growing the ContextColumn; the final lap streams plain text and the loop visibly comes to rest."
    transition_to_next: "Stop and confront what just happened three times: everything was re-sent, every lap."

  - id: b027
    act: act-9
    title: "The wastefulness objection"
    purpose: "State the tension from Act 3 honestly before resolving it."
    key_idea: "By the final lap the context is enormous — tool definitions, system prompt, project instructions, every turn, two fat test logs — and the harness re-sent all of it, every lap. Dozens of laps happen in real tasks. Does the GPU redo prefill on the whole thing every time?"
    visual_hint: "The ContextColumn shown at full height next to a lap counter; the prefill wave from Act 7 replays over the entire column with a cost meter climbing — a visibly absurd bill taking shape."
    transition_to_next: "Answer no — with machinery the viewer has already seen."

  - id: b028
    act: act-9
    title: "The prompt cache: warm prefix, cold tail"
    purpose: "Explain the API-level cache that makes the loop affordable."
    key_idea: "Turn N's request begins with exactly turn N−1's request — same tool definitions, same system prompt, same history, new content only at the end. The server checks incoming requests against recently seen prefixes — an exact, in-order match — and skips recomputing the matched prefix, prefilling only the new tail. Two user-visible consequences: cached input is billed roughly an order of magnitude below fresh input, and time-to-first-token collapses on warm turns. The agent-loop pattern is only economically viable because of this."
    visual_hint: "CacheHighlight on the ContextColumn: the entire prefix shifts to a warm state (color-pulse, not motion) while only the thin appended tail renders cold and processes. Contrast shot: first turn (all cold, long prefill wave) vs later turn (long warm prefix, tiny cold tail, near-instant first token)."
    transition_to_next: "Ask what 'kept warm' physically means — and bring back the shelf."

  - id: b029
    act: act-9
    title: "The bridge: one mechanism, two timescales"
    purpose: "Unify the two caches using the persistent shelf."
    key_idea: "What is saved for a matched prefix is its KV cache — the keys and values every prefix token published when first processed. The two caches are one mechanism at two timescales: the KV cache is the attention memory built during one generation; the prompt cache is that same memory kept alive between requests for a prefix that hasn't changed. Phrased carefully: in practice this is how it works — prefix semantics and pricing are documented; exact vendor internals are not."
    visual_hint: "The KVShelf makes its final return, shown persisting across the request boundary: the same ghosted key/value pairs still present when the next request arrives, matched against the incoming prefix chip by chip."
    transition_to_next: "Show the one fragility that explains real harness behavior."

  - id: b030
    act: act-9
    title: "Position sensitivity"
    purpose: "Explain observable harness design through the exact-prefix rule."
    key_idea: "The match is an exact prefix match: change one early byte — a timestamp in the system prompt, a reordered tool definition — and everything after that point goes cold and reprocesses at full price. This is why harnesses keep system prompts frozen, append instead of editing history, and put stable content first. Cache lifetime is short — minutes, refreshed on each use — which is fine because loop iterations arrive seconds apart. One line only: context is still finite, so on very long sessions the harness also manages it — summarizing old turns, dropping stale tool output; another harness duty, not this video's story."
    visual_hint: "One early chip in the ContextColumn changes color; everything downstream — column and KVShelf both — visibly drains from warm to cold in a cascade."
    transition_to_next: "With every mechanism named, return to where the video began."

  - id: b031
    act: act-10
    title: "The pauses, labeled"
    purpose: "Pay off the promise from b002: the rhythm's pauses and streams explained."
    key_idea: "The Act 1 session replays over the completed map. The pause before the first word = network + queue + prefill — long on turn one (cold cache, giant system prompt), short on later turns (warm prefix, tiny tail). The fluent streaming = decode: one token per forward pass, roughly constant speed."
    visual_hint: "The frozen timeline strip from b002 returns above the completed PersistentMap; as the session replays, each pause and stream segment lights up the corresponding map region (queue lane, prefill wave, decode metronome) and receives its label."
    transition_to_next: "Label the segments where nothing streams at all."

  - id: b032
    act: act-10
    title: "The silences, labeled"
    purpose: "Explain the mid-answer gaps with the loop's division of labor."
    key_idea: "The silent gaps mid-answer are the harness running tools locally. The model is not thinking during these; it is not running at all — its next request has not been sent yet."
    visual_hint: "During the silence segments, the map's right side goes fully dormant while the harness side and TerminalPane are active; the LoopArrow shows the request-not-yet-sent state."
    transition_to_next: "Speak the whole model over the finished map."

  - id: b033
    act: act-10
    title: "Final synthesis over the completed map"
    purpose: "Close with the compact mental model and no new concepts."
    key_idea: "The model is frozen weights that predict the next token — one forward pass, one look-back over everything before, one sampled token. The harness is the program that carries the memory, runs the tools, and enforces the rules. The agent is the loop between them. Everything is tokens; the caches are why the loop is affordable. The rhythm you feel every day is the architecture, felt from the outside. At most one line of future-video teasing (training/attention history; skills and MCP)."
    visual_hint: "The completed PersistentMap at rest: harness, boundary, queue, GPU, LoopArrow, warm ContextColumn, quiet KVShelf. Each spoken clause briefly illuminates its component; the final frame is the whole map, calm."
    transition_to_next: "End."
```

## Act coverage notes

- Act 1 is recognition only: the demo session's rhythm plays unlabeled and the promise is made; nothing is explained.
- Act 2 makes the split and births the PersistentMap; the word "loop" is deliberately absent until `b025`.
- Act 3 plants statelessness as deliberate unresolved tension; `b008` must feel almost wasteful, not resolved.
- Acts 4–5 are brisk consequence-focused beats; the front door (`b011`) is an establishing shot, the batch (`b012`) is the star.
- Act 6 is the floor and the longest act; `b015`–`b016` carry the video's most important vocabulary planting (key, value, query as roles, never linear algebra).
- Act 7 turns streaming from UI effect into mechanism; the KVShelf introduced in `b019` must be visually persistent and distinctive because `b029` points at this exact prop.
- Act 8 is deliberately lean: the flow is the teaching; the policy gate stays inside `b024` as one line plus a GateIcon tick.
- Act 9 resolves the Act 3 tension; `b029` is the headline unification and must point at existing props rather than re-explain mechanisms.
- Act 10 introduces zero new concepts; it is the reward, and must not be rushed.

## Downstream guidance

For narration:

- Keep each beat to one spoken idea; the expanded acts (6, 7, 9) exist so no narration segment has to carry two mechanisms.
- Use the demo session's concrete details (`npm test`, `src/format.js`, `"$1,234.50"` vs `"$1,234.5"`) verbatim wherever the session appears.
- Model the precise phrasing the viewer should adopt: the model "emits a tool request"; the harness "reads the files"; never "the model decided to look at your files."
- Preserve the strongest recurring lines:
  - "The model never touches your machine. The harness never predicts a word."
  - "What you typed is a tiny slice of what the model reads."
  - "You do not have a GPU. You have a place in line for a shared one."
  - "One forward pass. One token. That is the model's entire repertoire."
  - "Not a mind, a loop."
  - "The two caches are one mechanism at two timescales."
  - "The rhythm you feel every day is the architecture, felt from the outside."
- The one-liners in `b006` (skills/MCP), `b024` (policy layer), and `b030` (context management) must not grow during script polish.

For scene timeline:

- Prefer the components named in the treatment and reused here: `TerminalPane`, `PersistentMap`, `ContextColumn`, `TokenStream`, `BatchLanes`, `EmbeddingGrid`, `AttentionLinks`, `KVShelf`, `LoopArrow`, `ToolCallCard`, `ToolResultCard`, `GateIcon`, `CacheHighlight`.
- Props have lifetimes: the PersistentMap is born in `b005` and never redrawn; the ContextColumn is born in `b006`, grows in `b025`–`b026`, warms in `b028`, and drains in `b030`; the KVShelf is born in `b019`, is read in `b021`, and returns in `b029`; AttentionLinks are born in `b016` and reused in `b020`–`b021`.
- Warm/cold cache states use color-pulse, not motion or scaling.
- The fast replay inside `b025` compresses Acts 4–7 into 2–3 seconds; laps in `b026` run progressively faster — the tempo change is the teaching.
- Treat visual hints as intent, not final animation timing.

## Gate status

This beats file is `in-progress` and ready for human review.
