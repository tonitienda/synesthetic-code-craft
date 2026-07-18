---
type: narration
status: draft
depends_on:
  - 00-specs.md
  - 02-treatment.md
  - 03-beats.md
---

# 04 — Narration: How coding agents and LLMs work together, from keystroke to GPU

## Human notes

- One segment per beat, `n001`–`n033` mapped 1:1 onto `b001`–`b033`.
- **Pacing model:** each blank-line-separated paragraph inside a segment is one audio unit — one thought, then a pause while the animation completes. The paragraphs here match `narration-master.txt` verbatim, one to one. Short sentences, short paragraphs (~15–20 words each), same cadence as the containers video.
- Written to flow as self-contained audio (podcast test): the story works with eyes closed; visuals reinforce, never carry.
- All seven recurring lines from `03-beats.md` are preserved verbatim.
- The three one-liners (skills/MCP in `n006`, policy gate in `n024`, context management in `n030`) are single sentences and must not grow.
- Demo-session details used verbatim where the session appears: `fix the failing test`, `npm test`, `src/format.js`. The `"$1,234.50"` detail is kept on screen only; narration describes it ("one decimal digit instead of two") to stay TTS-friendly.
- Numbers stay approximate per treatment: "dozens of layers", "on the order of a hundred thousand", "roughly an order of magnitude", "minutes".
- ~2,800 words of narration across 166 paragraphs; with per-paragraph pauses the runtime is set by the animation, not by continuous speech.

```narration-yaml
segments:
  - id: n001
    act: act-1
    beat: b001
    speaker: narrator
    text: |
      If you work with a coding agent, you know this rhythm. Maybe better than you realize.

      You type a request: fix the failing test. You press enter. For a moment, nothing.

      Then words begin to stream in.

      A command runs, and the terminal goes quiet while your tests execute.

      Then more streaming. A shorter pause. Another command. And finally, the answer arrives, word by word.

      Pause, stream, silence, stream. You've watched this hundreds of times.
    pause_after: 0.8
    delivery: calm
    notes: "Narration paces with the terminal replay; no vocabulary, only recognition."

  - id: n002
    act: act-1
    beat: b002
    speaker: narrator
    text: |
      Here's the claim of this video: nothing in that rhythm is accidental.

      Every pause and every burst is caused by a specific piece of machinery. By the end, you'll be able to name all of them.

      So let's rewind to the moment before enter. And start with a basic question: what is the thing in your terminal, actually?
    pause_after: 0.9
    delivery: deliberate
    notes: "The promise. The frozen timeline strip appears here and returns in Act 10."

  - id: n003
    act: act-2
    beat: b003
    speaker: narrator
    text: |
      It's a program. Not a metaphorical one — an ordinary program. And it has a name: the harness.

      The harness draws the interface. It keeps the conversation on screen. It reads your keystrokes.

      And when you press enter, it does something almost anticlimactic. It makes an HTTPS request to an API.
    pause_after: 0.7
    delivery: calm
    notes: "Anticlimax is the point; keep it dry."

  - id: n004
    act: act-2
    beat: b004
    speaker: narrator
    text: |
      On the other side of that API is the model. And it pays to be precise about what that is.

      The model is a frozen set of numeric weights. Hundreds of billions of numbers, loaded onto GPUs in a datacenter.

      It doesn't remember. It doesn't learn. It doesn't act.

      It performs exactly one operation: given a sequence of tokens, produce a probability distribution over the next one.

      And nothing that happens during your session changes those weights. The model arrived frozen, and it stays frozen.
    pause_after: 0.9
    delivery: precise
    notes: "Mechanical definition before any behavior talk. Slow down on 'frozen'."

  - id: n005
    act: act-2
    beat: b005
    speaker: narrator
    text: |
      So hold this picture in your mind. On one side, your machine, running the harness. On the other, a shared datacenter, holding the model.

      Between them, a boundary: the API.

      The model never touches your machine. The harness never predicts a word.

      Everything in this video is these two taking turns across that line.

      So — what exactly crosses it when you press enter?
    pause_after: 0.8
    delivery: deliberate
    notes: "Recurring line preserved verbatim. The persistent map is born here."

  - id: n006
    act: act-3
    beat: b006
    speaker: narrator
    text: |
      You typed one line. The harness sends a document.

      Into a single request go, in order — first, the tool definitions. Descriptions of what the harness offers to do: run a command, read a file, edit a file.

      Then the system prompt — the harness's standing instructions.

      Then your project's instruction files. CLAUDE.md, AGENTS.md, Cursor rules. Different names, same mechanism.

      If you use skills or MCP servers, those are more of the same — content the harness adds here.

      Then the full message history, every previous turn. And at the very bottom, your one line.

      What you typed is a tiny slice of what the model reads.
    pause_after: 0.9
    delivery: calm
    notes: "Skills/MCP one-liner lives here and stays one sentence. Recurring line at the end."

  - id: n007
    act: act-3
    beat: b007
    speaker: narrator
    text: |
      One subtlety worth getting right.

      The back-and-forth is real. The harness really will send many requests, and react to each response.

      But within a single request, the model doesn't receive your message. It receives the whole conversation.

      Your messages, its own earlier replies, tool results — flattened into one long sequence, laid end to end.

      The model reads that transcript from the top, and writes a continuation.

      So the model is less like the other person in a chat, and more like a reader. Handed the entire transcript, every time, and asked: what comes next?
    pause_after: 0.8
    delivery: precise
    notes: "The turns (requests) are real; the flattening happens within one request. This distinction sets up statelessness in n008."

  - id: n008
    act: act-3
    beat: b008
    speaker: narrator
    text: |
      Now, the fact the whole architecture hinges on: the API is stateless.

      The model reads everything, responds, and keeps nothing. There is no session on the other side.

      Next turn, the harness will send everything again — one message longer.

      The model has no memory. The harness carries the memory for it.

      And if that sounds wasteful — re-sending the entire conversation, every single turn — good. It should.

      Hold that objection. It gets a proper answer later.
    pause_after: 1.0
    delivery: deliberate
    notes: "Plant the tension explicitly and promise the resolution; do not soften it here."

  - id: n009
    act: act-4
    beat: b009
    speaker: narrator
    text: |
      There's one more transformation before the model can read anything. Because the model doesn't read text.

      On the server, the document is chopped into tokens: chunks of a few characters. Each token maps to a number. What the model receives is a sequence of integers.

      Tokenize a line of code, and the boundaries fall in strange places.

      A common word comes out as one token. A name like formatPrice splits in the middle. The indentation stands alone.

      The tokenizer is a fixed dictionary, built before training, where frequent strings get short encodings.

      Different models split text differently. The point is the phenomenon, not the exact cuts.
    pause_after: 0.8
    delivery: calm
    notes: "One tokenizer's output, presented as an example, per treatment."

  - id: n010
    act: act-4
    beat: b010
    speaker: narrator
    text: |
      And tokens aren't trivia. They're the unit of everything.

      Price: so much per million tokens, with input and output priced differently.

      The context window: a token budget that everything in the document competes for.

      Speed: tokens per second.

      Every limit you've hit, and every invoice you've paid, was counting these.
    pause_after: 0.9
    delivery: deliberate
    notes: "Three consequences, one per pause, then move; the chips start flowing toward the boundary."

  - id: n011
    act: act-5
    beat: b011
    speaker: narrator
    text: |
      So the request crosses the boundary.

      First, an ordinary front door: authentication, rate limits, validation. The same machinery as any large API.

      Then it's routed to an inference cluster. There, the model's weights sit sharded across several GPUs, working as one unit. A frontier model doesn't fit on one.
    pause_after: 0.7
    delivery: calm
    notes: "Establishing shot only; seconds of screen time."

  - id: n012
    act: act-5
    beat: b012
    speaker: narrator
    text: |
      And here's the part most mental models leave out: you do not have a GPU. You have a place in line for a shared one.

      GPUs are only efficient when they process many sequences at once. So the server runs many users' requests in the same batch.

      Modern schedulers do this at the granularity of single tokens. It's called continuous batching.

      After every generation step, finished requests leave the batch, and waiting requests join.

      Your tokens decode side by side with strangers' tokens, step by step.

      If the cluster is busy, your request waits in the queue first. That wait reaches you as extra time before the first word.

      One reassurance: what's shared is hardware, not context. Each sequence attends only to its own tokens.
    pause_after: 0.9
    delivery: deliberate
    notes: "Recurring line preserved verbatim; the batch is the star of the act."

  - id: n013
    act: act-6
    beat: b013
    speaker: narrator
    text: |
      Now we've reached the floor. One prediction, from the inside.

      It starts with a lookup. Each token ID is found in a table, and becomes a vector — a long list of numbers.

      That vector is the model's working representation. From here on, nothing is text.

      One grounding intuition: directions in that space encode usage. Tokens that behave similarly sit near each other.
    pause_after: 0.8
    delivery: calm
    notes: "One grounding line only; no semantic-arithmetic detours."

  - id: n014
    act: act-6
    beat: b014
    speaker: narrator
    text: |
      The vectors then flow up through a stack of layers. Dozens of them, all with the same shape.

      Each layer refines every token's vector, using two ingredients.

      Attention moves information between tokens. A small feed-forward network transforms each token's vector on its own.

      Both matter. We'll follow attention — because attention is the one whose consequences you can feel.
    pause_after: 0.7
    delivery: calm
    notes: "Name both ingredients once, then commit to attention."

  - id: n015
    act: act-6
    beat: b015
    speaker: narrator
    text: |
      Here's the core of it. As each token is processed, it publishes two things that stick around.

      A key: a small summary that lets later tokens find it.

      And a value: the information it offers if it is found.

      Keys and values. Keep those two words close — they come back.
    pause_after: 0.9
    delivery: precise
    notes: "The video's most important vocabulary planting. Slow, distinct, memorable — one term per pause."

  - id: n016
    act: act-6
    beat: b016
    speaker: narrator
    text: |
      Now a new token arrives to be processed. It forms a query: what am I looking for?

      That query is compared against every previous token's key.

      The matches are weighted. And the matching values are blended into the new token's vector.

      This happens in every layer, for every token.

      It's how a variable declared four hundred tokens ago reaches the line being written right now.
    pause_after: 0.8
    delivery: deliberate
    notes: "AttentionLinks born. Query/key/value as roles, never linear algebra."

  - id: n017
    act: act-6
    beat: b017
    speaker: narrator
    text: |
      Two properties of this look-back are worth pinning down.

      First: it only looks backward. A token can see everything before it, and nothing after it. The model reads left to right, like you.

      Second: it has a cost. Producing each new token means comparing against everything before it. And that work grows as the context grows.

      That is mechanically why long contexts cost compute — and money.

      As for how the model learned what to put in those keys and values — that's the training story. A different video.

      Here, the weights are frozen, and this machinery runs as-is, on every token of every session.
    pause_after: 0.9
    delivery: precise
    notes: "Causality, cost, and the scope-honesty line, in that order."

  - id: n018
    act: act-6
    beat: b018
    speaker: narrator
    text: |
      At the top of the stack, the final vector is projected onto the vocabulary. A score for every possible next token — on the order of a hundred thousand candidates — forming a probability distribution.

      A sampler picks one. Usually a likely one. Not always the top one.

      That choice is where the knob you know as temperature lives.

      And that's the whole act. One forward pass. One token. That is the model's entire repertoire.

      Everything else in this video is arrangement around it.

      But your response will be thousands of tokens. Thousands of passes. How is that not impossibly slow?
    pause_after: 1.0
    delivery: deliberate
    notes: "Recurring line preserved verbatim. Ends on the question Act 7 answers."

  - id: n019
    act: act-7
    beat: b019
    speaker: narrator
    text: |
      Start with the prompt. Its thousands of tokens don't need to be generated. They already exist.

      So the model processes all of them in one wide, parallel pass. Every prompt token flows through the layers at the same time.

      And along the way — the crucial side effect — every one of them publishes its keys and values.

      This pass is called prefill. Compute-heavy, but parallel. It is the main body of that pause before the first word.
    pause_after: 0.8
    delivery: calm
    notes: "The wave sweeps; the shelf fills. 'Prefill' taught by name."

  - id: n020
    act: act-7
    beat: b020
    speaker: narrator
    text: |
      All those published keys and values are kept, per token, per layer, in GPU memory.

      That store has a name you've likely seen on pricing pages and in blog posts: the KV cache.

      Literally, the cache of keys and values. And you now know exactly what those objects are.

      When the model predicts the next token, its query runs against the stored keys, and blends the stored values. Nothing about the past is recomputed.

      Without this store, every new token would redo the attention work for the entire sequence. The cost of generating would explode as the response grew.
    pause_after: 0.9
    delivery: precise
    notes: "The name resolves instead of introducing — the payoff of n015."

  - id: n021
    act: act-7
    beat: b021
    speaker: narrator
    text: |
      With the cache full, generation proper begins. This phase is called decode.

      One forward pass produces one token. That token's key and value join the cache. The next pass begins.

      It is serial by nature: the next token cannot be computed until the current one exists. And it sets the tokens-per-second you watch in your terminal.

      It's also why the two phases feel so different. Prefill saturates the GPU's compute. Decode is limited by how fast the weights and the cache can be read from memory.
    pause_after: 0.8
    delivery: calm
    notes: "The metronome. The compute/memory paragraph is the optional cut — drop it first if pacing needs it."

  - id: n022
    act: act-7
    beat: b022
    speaker: narrator
    text: |
      Each decoded token is converted back to text, and pushed over the open connection the moment it exists.

      So the word-by-word streaming in your terminal is not a loading animation. It is the true cadence of generation. One forward pass per word-piece, delivered as it's made.

      Two labels to hold for later. The pause before the first word is queue plus prefill. The streaming speed is the decode rate.

      Now — let's read what these particular tokens streamed back.
    pause_after: 0.9
    delivery: deliberate
    notes: "Dissolves the loading-animation misconception; seeds Act 10's labels."

  - id: n023
    act: act-8
    beat: b023
    speaker: narrator
    text: |
      Because this time, they don't spell an answer. They spell something structured: a tool call.

      A tool's name, with JSON arguments. Run npm test.

      And the response ends with a stop reason that says, in effect: I'm not done. I need this executed.
    pause_after: 0.8
    delivery: precise
    notes: "The turn of the video. Let the stop reason land."

  - id: n024
    act: act-8
    beat: b024
    speaker: narrator
    text: |
      It has to ask, because the model cannot run anything. No shell, no filesystem, no access to your machine.

      It can emit a request, and stop. Everything that happens next is the harness.

      The harness runs npm test, locally, on your machine.

      And that's the first long silence from the opening rhythm. Your tests running, while the model isn't running at all.

      One honest aside: in a real harness, a policy layer sits exactly at this point — permission prompts, hooks, sandboxes — deciding whether and how each call runs.

      Our session is auto-approved end to end, because this video's interest lies on the other side of the fence.
    pause_after: 0.9
    delivery: calm
    notes: "Division of labor; policy layer stays one sentence plus the gate tick."

  - id: n025
    act: act-8
    beat: b025
    speaker: narrator
    text: |
      The tests finish: one failure. The formatted price comes back with one decimal digit instead of two.

      The harness wraps that output as a tool result, and appends it to the history.

      And then it does the almost-comic thing. It sends the entire conversation again.

      The full descent — tokens, queue, prefill, decode — runs again, with the failure log now sitting in the context.

      And this is the word the video owes you. This is the agent.

      Not a mind — a loop.

      The model proposes. The harness executes. The result goes back into the context. Repeat, until the model answers in plain text and stops asking.

      From the API's point of view, there is no session at all. Only a series of independent, ever-growing requests.

      The loop — and with it, the agent — lives entirely in the harness.
    pause_after: 1.0
    delivery: deliberate
    notes: "Central definition. 'Not a mind — a loop' gets its own paragraph and its own silence. Exact test values stay on screen."

  - id: n026
    act: act-8
    beat: b026
    speaker: narrator
    text: |
      The remaining laps go quickly, because you've already taken this trip slowly.

      Lap two: with the failure log in context, the model emits the next tool call. Edit src/format.js, to format the price with two decimals. The harness applies the edit.

      Lap three: run the tests again. All tests pass.

      Lap four: the model streams a plain-text summary of the fix — no tool call this time — and the loop comes to rest.

      Every lap, the same flow. Prompt in, tool call out, execution, result appended, prompt in again.
    pause_after: 0.9
    delivery: calm
    notes: "Tempo is the teaching; one lap per paragraph while the choreography accelerates."

  - id: n027
    act: act-9
    beat: b027
    speaker: narrator
    text: |
      Now stop and consider what that cost.

      By the final lap, the context is enormous. Tool definitions, system prompt, project instructions, every turn, two full test logs.

      And the harness re-sent all of it, on every lap. Real tasks run dozens of laps.

      So: does the GPU redo prefill over that whole document, every single time?
    pause_after: 0.9
    delivery: deliberate
    notes: "The Act 3 objection returns, stated honestly, as a question."

  - id: n028
    act: act-9
    beat: b028
    speaker: narrator
    text: |
      No. And you already know every piece of the reason.

      Consider what the harness sends. This turn's request begins with exactly last turn's request. Same tool definitions, same system prompt, same history. New content only at the end.

      The server exploits that. It checks each incoming request against prefixes it has seen recently — an exact, in-order match.

      When it finds one, it skips recomputing the matched prefix entirely, and prefills only the new tail.

      This is the prompt cache. And you feel it in two places.

      Cached input is billed at roughly an order of magnitude below fresh input. And on warm turns, the first word arrives almost immediately.

      The agent loop — full history, re-sent dozens of times — is only economically viable because of this.
    pause_after: 0.9
    delivery: precise
    notes: "Warm prefix, cold tail. No exact prices or ratios."

  - id: n029
    act: act-9
    beat: b029
    speaker: narrator
    text: |
      But what does "kept warm" physically mean? You already know the answer.

      What the server keeps for that prefix is its KV cache. The keys and values that every prefix token published when it was first processed.

      So the two caches are one mechanism at two timescales.

      The KV cache is the attention memory built during a single generation. The prompt cache is that same memory, kept alive between requests, for a prefix that hasn't changed.

      That's the practical picture. The prefix behavior and the pricing are documented; the exact internals are each vendor's own.
    pause_after: 1.0
    delivery: deliberate
    notes: "The headline unification gets its own paragraph. Point at the shelf; re-explain nothing."

  - id: n030
    act: act-9
    beat: b030
    speaker: narrator
    text: |
      One property of that cache explains a surprising amount of harness design. The match is exact, and it runs from the start.

      Change one early byte — a timestamp in the system prompt, a reordered tool definition — and everything after that point goes cold. It reprocesses at full price.

      That is why harnesses keep system prompts frozen, append to history instead of editing it, and put stable content first.

      The cache's lifetime is short — minutes, refreshed on each use. And that's enough, because loop iterations arrive seconds apart.

      And one final harness duty, in one line: the context window is finite, so on long sessions the harness also curates it — summarizing old turns, dropping stale tool output. A story for another video.
    pause_after: 0.9
    delivery: calm
    notes: "Position sensitivity; the compaction one-liner stays one line."

  - id: n031
    act: act-10
    beat: b031
    speaker: narrator
    text: |
      And now, the opening rhythm again. But this time, you can read it.

      The pause before the first word: network, queue, prefill.

      Long on the first turn, when everything is cold and the system prompt is huge. Short on every later turn: warm prefix, tiny tail.

      The fluent streaming: decode. One forward pass per token, at a roughly steady rate.
    pause_after: 0.8
    delivery: calm
    notes: "The replay begins; do not rush — this act is the reward."

  - id: n032
    act: act-10
    beat: b032
    speaker: narrator
    text: |
      And those silent gaps in the middle of the answer? That's the harness, running tools on your machine.

      The model isn't thinking during those silences. It isn't running at all. Its next request hasn't even been sent.
    pause_after: 0.9
    delivery: precise
    notes: "The right side of the map goes dormant; let the stillness carry it."

  - id: n033
    act: act-10
    beat: b033
    speaker: narrator
    text: |
      So here is the whole machine.

      The model is frozen weights that predict the next token. One forward pass, one look-back over everything before, one sampled token.

      The harness is the program that carries the memory, runs the tools, and enforces the rules.

      The agent is the loop between them.

      Everything is denominated in tokens. And the two caches are why the loop is affordable.

      How those frozen weights came to be — that's the training story, for another video.

      For now, you have what this video promised: the rhythm you feel every day is the architecture, felt from the outside.

      Thanks for watching.
    pause_after: 1.2
    delivery: deliberate
    notes: "Each clause illuminates its map component; final frame is the calm, completed map."
```

## Gate status

`draft` — ready for human review.
