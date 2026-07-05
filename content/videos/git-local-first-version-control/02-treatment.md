---
type: treatment
status: ready
depends_on:
  - 00-specs.md
  - 01-research.md
---

# 02 — Treatment: Git local-first version control

## Central thesis

Git makes more sense when you stop imagining it as a client for a central server.

Older version-control systems trained developers to think in a client-server way: the important history lives on the server, and the local machine is mostly a working copy. Git changes that relationship. In Git, the local machine has the history graph. Commits, branches, merges, rebases, diffs, and most inspection commands are local graph operations. Remotes are other repositories that we synchronize with.

The video should lead the viewer from the historical reason source control exists, through the limitations of centralized systems, into Git's local-first model.

The key viewer realization should be:

> Git is not mysterious because it has strange commands. Git is mysterious when you imagine the wrong architecture.

Once the architecture is clear, the rest becomes coherent:

- a commit is a point in local history
- a branch is a movable name pointing at a commit
- `HEAD` is where you are
- merge combines histories
- rebase replays history onto a new base
- fetch updates local knowledge of another repository
- pull is fetch plus integration
- push synchronizes your local work somewhere else

## Desired viewer journey

The viewer should begin with a familiar but slightly uncomfortable feeling:

> I use Git every day, but many commands still feel like rituals.

The treatment should not shame that confusion. Instead, it should show that much of the confusion comes from inheriting a centralized mental model and applying it to a distributed tool.

By the end, the viewer should feel:

> Ah, Git is a graph I have locally. The remote is not magic. The remote is another copy I synchronize with.

The emotional movement should be:

1. Familiar pain: source files change, things break, and we need history.
2. Historical grounding: centralized systems solved a real problem.
3. Limitation: the central server becomes the place where version control "really happens."
4. Shift: Git moves the important history onto every developer machine.
5. Clarity: most Git commands are graph and pointer operations.
6. Relief: fetch, pull, merge, and rebase stop feeling arbitrary.

## Act structure

## Act 1 — Why source control exists

### Purpose

Start before Git. Establish the original problem source control solves.

The video should open with the basic human/software problem:

- files change
- changes break things
- people need to know what changed
- teams need to work together without overwriting each other
- sometimes we need to return to a previous state

This act should make source control feel necessary before introducing Git.

### Conceptual point

Source control exists to give a project memory.

Without source control, a project becomes a folder full of anxiety:

```text
app.js
app-final.js
app-final-really.js
app-final-toni-copy.js
app-final-before-demo.js
```

This joke can be used lightly, but the point should remain practical: version control gives us checkpoints, history, comparison, recovery, and collaboration.

### Visual metaphor

Start with a messy folder of files multiplying over time. Then compress that mess into a clean timeline of saved project states.

The first visual transformation should be:

```text
messy copies -> ordered history
```

This sets up the central visual language: history as structure.

### What to avoid

Do not mention Git immediately. Do not start with commits, branches, or hashes. The viewer should first remember why source control exists at all.

## Act 2 — Centralized source control: one server, many working copies

### Purpose

Introduce the client-server model using systems such as SourceSafe and Subversion as light historical context.

This should be a simple contrast, not a detailed history lesson.

### Conceptual point

Centralized version control solved a real problem by putting project history in one shared place.

A simplified model:

```text
Developer A working copy
          |
Developer B working copy -- central server history
          |
Developer C working copy
```

This model is understandable:

- there is one central repository
- developers check out working copies
- commits/check-ins go to the central place
- everyone agrees where the official history lives

The video should be fair to this model. It was not stupid. It was a natural answer to team coordination.

### SourceSafe / Subversion positioning

Mention SourceSafe and Subversion as examples of the older mental model:

- the server is where the project history lives
- the developer machine has a working copy
- the central repository feels like the source of truth

Do not dwell on SourceSafe-specific behavior or make the act a rant about old tools. SourceSafe can carry a small joke if desired, but Subversion should be treated respectfully because it was a serious, widely used system.

### Visual metaphor

The central server should be drawn as a large bright repository in the middle. Developer machines around it have thinner local working copies.

Important visual distinction:

- central server: full history
- local machine: editable files / working copy

The viewer should visually feel that version control "happens over there."

### What to avoid

Do not imply centralized systems were useless. They solved the immediate problem. The limitation should emerge naturally from the architecture.

## Act 3 — The friction: what happens when the server is the place where history lives?

### Purpose

Show why the centralized model creates friction for local work, experimentation, and offline development.

This act creates the need for Git.

### Conceptual point

If the central server is where history lives, then many important actions depend conceptually or practically on that server.

The viewer does not need a full matrix of CVS/SVN/SourceSafe capabilities. The treatment should focus on the mental model:

> My machine has files. The server has the history.

That mental model makes certain things feel heavier:

- saving a versioned checkpoint
- branching for an experiment
- looking at rich history while disconnected
- moving work between machines
- treating the local machine as a complete project memory

### The transition question

This act should end with a question that creates the need for the local-first model:

> What if your laptop was not just a working copy?
>
> What if it had the whole history?

This is the turning point of the video.

### Visual metaphor

Show a developer disconnected from the central server. The working files remain, but the history visualization fades or becomes unreachable.

Then pause on the contrast:

```text
centralized model:
local machine = files
server = history
```

This sets up the inversion:

```text
Git model:
local machine = files + history
remote = another copy
```

### What to avoid

Do not overclaim specific limitations for every centralized tool. Keep the statement architectural and mental-model based.

## Act 4 — Git's inversion: the repository is local

### Purpose

Introduce Git as the architectural inversion of the centralized model.

This is the heart of the video.

### Conceptual point

Git gives every clone the project history.

The local machine is no longer just a working copy. It contains a repository: a database of commits, parent links, branches, and references.

Key line for later narration:

> In Git, your laptop does not merely borrow the project. It carries the project history.

This explains the local-first focus without making the video too philosophical.

### Visual metaphor

Take the central server history graph from Act 2 and duplicate it into the laptop.

The central server shrinks from "the only real repository" into "another repository."

Before:

```text
Laptop working copy -> central repository
```

After:

```text
local repository <-> remote repository
```

The arrow should become synchronization, not dependency.

### Concepts introduced here

Introduce only the minimum Git model needed:

- repository: local database of history
- commit graph: history as connected snapshots
- commit: a saved point in history
- parent links: how commits remember what came before

Do not introduce branches, merge, rebase, fetch, and pull all at once. They should unfold from this model.

### What to avoid

Avoid object-storage internals, hash details, packfiles, refs layout, and implementation trivia. The treatment needs the viewer to feel the graph, not memorize `.git` internals.

## Act 5 — Branches and `HEAD`: Git as local pointer movement

### Purpose

Once the local graph exists, explain why common Git operations feel cheap and fast.

### Conceptual point

A branch is not a copy of the project. A branch is a movable name pointing to a commit.

`HEAD` is Git's "you are here" marker. In the common case, `HEAD` points to the current branch, and the current branch points to a commit.

This act turns Git from a scary command set into a small set of graph-and-pointer operations.

### Visual progression

Start with a simple line of commits:

```text
A -- B -- C  main
```

Add a branch pointer:

```text
A -- B -- C  main, feature
```

Move `HEAD` to `feature`, then add a new commit:

```text
A -- B -- C  main
          \
           D  feature, HEAD
```

The key visual feeling is: nothing huge was copied. A pointer moved, then a node was added.

### Concepts introduced here

- branch pointer
- `HEAD`
- local commit creation
- why branches are cheap
- why committing does not need the network

### Pacing intent

This act should breathe. It is the moment where the viewer starts to see Git as a graph.

Do not rush from branch to merge too quickly. The branch pointer idea is foundational.

### What to avoid

Avoid detached `HEAD` unless it becomes necessary later. Avoid explaining every branch command.

## Act 6 — Merge and rebase: two ways to integrate local histories

### Purpose

Explain merge and rebase as consequences of the graph model.

### Conceptual point

When histories diverge, Git needs a way to integrate them.

Merge and rebase are not magic words. They are different graph operations:

- merge preserves the shape of parallel history and creates a join point when needed
- rebase replays commits on top of a new base, creating a cleaner-looking line but new commits

The goal is not to teach full conflict-resolution workflows. The goal is to help the viewer understand why the history graph changes differently.

### Visual progression: merge

Before:

```text
A -- B -- C  main
      \
       D -- E  feature
```

After merge:

```text
A -- B -- C ---- M  main
      \       /
       D -- E  feature
```

The visual should emphasize the merge commit's two parents.

### Visual progression: rebase

Before:

```text
A -- B -- C  main
      \
       D -- E  feature
```

After rebase:

```text
A -- B -- C  main
           \
            D' -- E'  feature
```

The visual should emphasize that `D'` and `E'` are new commits replayed on a new base.

### Emotional rhythm

This act should feel like a reveal, not a warning lecture.

A useful tone:

> Merge says: keep the parallel roads and build a bridge.
>
> Rebase says: replay my road starting from over here.

### What to avoid

Do not turn this into "merge vs rebase best practices." Avoid moralizing. The treatment should frame them as tools with different graph shapes.

Mentioning that rebasing shared history can be dangerous is acceptable later as a short caveat, but not the centerpiece.

## Act 7 — Remotes: not the source of truth, another repository

### Purpose

Return to the local-first theme by explaining remotes after the viewer understands the local graph.

This is where the historical contrast pays off.

### Conceptual point

A remote is another repository.

GitHub, GitLab, Bitbucket, an internal server, another laptop over SSH, or even another path on disk can all be synchronization targets. Hosted platforms matter socially and practically, but Git's model does not require the remote to be the place where version control begins.

Key line:

> `origin` is not the source of truth built into Git. It is the default nickname for the repository you cloned from.

### Visual progression

Show two repositories side by side:

```text
Local repository          Remote repository
A -- B -- C main          A -- B -- C main
```

Then let the remote move ahead:

```text
Local repository          Remote repository
A -- B main               A -- B -- C main
A -- B origin/main
```

Then fetch:

```text
Local repository
A -- B main
      \
       C origin/main
```

The important part is that `origin/main` moves locally. The viewer should see that fetch updates local knowledge.

### Concepts introduced here

- remote repository
- `origin`
- remote-tracking refs such as `origin/main`
- fetch
- push

### What to avoid

Avoid GitHub-specific pull requests, issues, forks, and web UI collaboration. The video is about Git's model, not platform workflows.

## Act 8 — Fetch, pull, push: synchronization after local work

### Purpose

Resolve one of the most common Git confusions: fetch vs pull.

### Conceptual point

Because Git works locally, synchronization is a separate concern.

- fetch asks: what happened over there?
- pull asks: fetch, then integrate it here
- push asks: send my local commits over there

This should feel like the final practical payoff of the whole video.

### Visual progression

Start with the local and remote graphs slightly out of sync.

Fetch:

- new remote commits appear in local repository
- `origin/main` moves
- local `main` does not move yet

Pull:

- first fetch
- then local `main` integrates the fetched commits, either by fast-forward, merge, or rebase depending on situation/configuration

Push:

- local commits are sent to the remote
- remote branch pointer moves if allowed

### Pacing intent

This act should be crisp. The hard conceptual work has already been done. Now the viewer gets the reward:

> This is why fetch and pull are different.

### What to avoid

Do not explain every pull mode deeply. It is enough to say that pull is fetch plus integration, and integration may be merge or rebase.

## Act 9 — Closing synthesis: Git is local-first history plus synchronization

### Purpose

Close by restating the mental model and connecting the historical opening to the viewer's everyday Git commands.

### Conceptual point

Git exists as a response to a real source-control history:

- no source control: files have no reliable memory
- centralized source control: one server has the project memory
- Git: every clone carries project memory

The final synthesis:

> Git works offline because history is local.
>
> Branches are cheap because they are pointers.
>
> Merge and rebase are graph operations.
>
> Fetch and pull are different because synchronization and integration are different steps.
>
> The remote is not Git. The remote is another repository.

### Final feeling

The viewer should leave with less fear and more structure.

Not:

> I now know every Git command.

But:

> I know what kind of thing Git is doing when I run those commands.

## Conceptual progression

The video's conceptual progression should be:

1. Projects need memory.
2. Centralized systems put that memory on a server.
3. That makes the local machine feel like a working copy.
4. Git moves the memory into every clone.
5. That memory is a commit graph.
6. Branches and `HEAD` are pointers into that graph.
7. Merge and rebase are ways to reshape or combine graph history.
8. Remotes are other repositories.
9. Fetch, pull, and push synchronize graph data and branch positions.

## Major visual metaphors

### Project memory

Use "memory" as the core metaphor for version control.

- no source control: memory scattered across file copies
- centralized source control: memory in one server
- Git: memory copied into every clone

### Graph on your desk

The local repository should feel like a physical graph sitting on the developer's desk.

This supports the final idea:

> The graph is local.

### Pointer choreography

Branches, `HEAD`, `origin/main`, merge, rebase, fetch, and pull should all become pointer choreography over the commit graph.

This is visually consistent and implementation-friendly.

### Synchronization instead of dependency

The remote should visually change from "authority above the developer" to "peer repository beside the developer."

This supports the local-first idea without overexplaining local-first philosophy.

## Pacing intent

Target duration is around six minutes, so the treatment must avoid becoming a complete Git course.

Suggested pacing:

- Act 1: 30–40 seconds
- Act 2: 45–55 seconds
- Act 3: 35–45 seconds
- Act 4: 55–70 seconds
- Act 5: 55–70 seconds
- Act 6: 70–90 seconds
- Act 7: 45–60 seconds
- Act 8: 45–60 seconds
- Act 9: 25–35 seconds

The history section should be meaningful but light. It should explain the reason Git's design matters, not consume the whole video.

## Tone

Calm, practical, slightly playful.

The video can include small jokes about file-copy chaos or old centralized-tool memories, but it should avoid smugness.

Recommended tone:

- respectful toward older systems
- empathetic toward confused Git users
- clear and visual rather than encyclopedic
- playful only where it helps reduce tension

Avoid:

- "Git is easy"
- "SVN was bad"
- "If you do not understand Git, you are doing it wrong"
- platform tribalism

## What each act must achieve

### Act 1 must achieve

The viewer understands that source control is project memory.

### Act 2 must achieve

The viewer understands the centralized client-server model.

### Act 3 must achieve

The viewer feels why local history would be useful.

### Act 4 must achieve

The viewer understands the main inversion: the local repository contains history.

### Act 5 must achieve

The viewer understands commits, branches, and `HEAD` as local graph/pointer concepts.

### Act 6 must achieve

The viewer understands merge and rebase as different graph operations.

### Act 7 must achieve

The viewer understands remotes as other repositories, not the definition of Git.

### Act 8 must achieve

The viewer understands fetch, pull, and push as synchronization operations.

### Act 9 must achieve

The viewer leaves with one coherent mental model.

## What each act should avoid

### Act 1 should avoid

Starting with Git-specific terminology.

### Act 2 should avoid

Turning into detailed SourceSafe or Subversion history.

### Act 3 should avoid

Making claims that every centralized tool has exactly the same limitations.

### Act 4 should avoid

Deep Git object internals.

### Act 5 should avoid

Detached `HEAD`, reflog, reset modes, and advanced branching workflows.

### Act 6 should avoid

Detailed conflict resolution and merge-vs-rebase ideology.

### Act 7 should avoid

GitHub/GitLab collaboration features.

### Act 8 should avoid

All configuration variants of pull, push, upstream branches, and remote refspec details.

### Act 9 should avoid

Introducing any new concept.

## Downstream guidance for beats

The beats phase should keep the history opening compact but concrete. It should not skip it, because the history creates the reason Git exists.

A likely beat sequence:

1. File-copy chaos before source control.
2. Source control gives projects memory.
3. Centralized systems put memory on one server.
4. Local machines become working copies.
5. The limitation: local work does not feel like complete history ownership.
6. Git's inversion: every clone carries the history.
7. Commit graph appears locally.
8. Branches are movable names.
9. `HEAD` marks where you are.
10. Merge joins diverged histories.
11. Rebase replays commits onto a new base.
12. Remote is another repository.
13. Fetch updates local knowledge of the remote.
14. Pull is fetch plus integration.
15. Push sends local history outward.
16. Final synthesis: Git is local-first history plus synchronization.

## Gate status

This treatment file is `in-progress` and ready for human review.
