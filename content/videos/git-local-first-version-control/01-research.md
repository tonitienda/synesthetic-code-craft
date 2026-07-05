---
type: research
status: in-progress
depends_on:
  - 00-specs.md
---

# 01 — Research: Git local-first version control

## Research purpose

This document collects the factual and conceptual material needed for a practical explainer about Git as a local-first, distributed version-control system.

This is not the final video structure and not narration. It is the conceptual source material for later phases.

## Research summary

Git is best understood as a local database of project history, plus tools for moving names through that history and synchronizing with other repositories.

The key mental shift for the video is:

> Git is not a client for GitHub. Git is a local version-control system that can synchronize with other Git repositories.

Most everyday Git operations work locally because the local repository contains the object database, commit graph, branches, `HEAD`, index, and working tree state needed to inspect and modify history. Network operations such as `fetch`, `pull`, and `push` synchronize repositories; they are not the foundation of all work.

## Core factual claims

### Git is distributed version control

In centralized version-control systems, a central server contains the authoritative versioned files, and clients check out from that central place.

In distributed version-control systems, clients do not merely check out the latest files. They mirror the repository, including its history. Each clone can act as a full backup of the project data.

For this video, the important idea is not just "distributed" as a buzzword. The important idea is that the developer's machine contains enough information to continue versioning work without asking a central server for every operation.

Source:

- https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control

### Git stores snapshots, not only diffs

A useful simplification is: each commit represents a snapshot of the project at a point in time.

More precisely, a commit object points to a tree object representing the project snapshot, stores metadata, and points to one or more parent commits. A normal commit has one parent. The initial commit has no parent. A merge commit has multiple parents.

This matters visually because Git history can be represented as a graph:

- commits are nodes
- parent relationships are edges
- branches are names pointing to commits
- `HEAD` tells us what is currently checked out

Source:

- https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F
- https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell

### Nearly every operation is local

Git's own documentation emphasizes that most operations need only local files and resources because the whole project history is on the local disk.

This explains why these operations normally work offline:

- viewing log history
- creating commits
- creating branches
- switching branches, assuming the relevant objects are local
- diffing local revisions
- merging local branches
- rebasing local branches

This does not mean every Git operation is offline. Synchronization operations need another repository to communicate with.

Source:

- https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F

### Working tree, index, and `HEAD`

A practical mental model for local work is Git's "three trees":

- `HEAD`: the last commit snapshot for the current branch; also the likely parent of the next commit
- index / staging area: the proposed next commit snapshot
- working tree / working directory: the editable sandbox of files on disk

For this video, the index should be explained only as much as needed to make commits coherent. The video does not need to go into index file internals.

Useful phrasing:

> The working tree is where you edit. The index is what you are preparing to commit. `HEAD` is where your current branch currently points.

Source:

- https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified

### Branches are movable names

A Git branch is a lightweight movable pointer to a commit. When the branch is checked out and a new commit is created, the branch pointer moves forward to the new commit.

This is probably one of the most important concepts for the video because it explains why branching feels cheap in Git. Creating a branch does not copy the whole project. It creates another name pointing into the same commit graph.

Source:

- https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell

### `HEAD` is the current checkout reference

For this video, `HEAD` can be simplified as:

> `HEAD` is Git's "you are here" marker.

In the common case, `HEAD` points to a branch, and the branch points to a commit. When a new commit is created, the branch moves, and `HEAD` still follows that branch.

The video does not need to explain detached `HEAD` unless a small warning is useful later.

Source:

- https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified
- https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell

### Merge integrates histories

Merge is one of the two main ways to integrate changes from one branch into another.

A simple visual model:

- two branches diverge from a common ancestor
- merge combines the branch snapshots
- when both sides have new work, Git may create a merge commit
- that merge commit has multiple parents

This should be shown as a graph operation, not as a vague "combine files" action.

Source:

- https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging
- https://git-scm.com/book/en/v2/Git-Branching-Rebasing

### Rebase replays commits onto a new base

Rebase is the other main way to integrate changes.

A useful simplified model:

- find the commits on the current branch that are not on the new base
- temporarily set those changes aside
- move the current branch to the new base
- replay those changes as new commits

Important nuance: after a rebase, the final file contents may match a merge-based integration, but the history shape is different. Rebase creates new commits with new identities because the parent history changed.

This video should explain rebase visually as graph rewriting/replay, not as a command to memorize.

Source:

- https://git-scm.com/book/en/v2/Git-Branching-Rebasing

### Remotes are other repositories

A remote is another repository that Git can exchange data with. It is usually on a network, but Git documentation notes that a remote can even be on the same machine. The word "remote" means "elsewhere from this repository," not necessarily "the cloud."

This is a useful corrective to the common GitHub-centric mental model.

Useful phrasing:

> `origin` is not Git's source of truth. It is the default nickname for the repository you cloned from.

Source:

- https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes

### Fetch updates local knowledge of a remote

`git fetch` retrieves commits, files, and refs from another repository and updates local remote-tracking refs such as `origin/main`.

The key teaching point:

> Fetch changes what your local repository knows about the remote. It does not automatically integrate that work into your current branch.

This is visually strong:

- before fetch: local `origin/main` points to old remote state
- after fetch: local `origin/main` moves to the newly observed remote state
- local `main` may remain where it was

Sources:

- https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes
- https://git-scm.com/docs/git-fetch

### Pull is fetch plus integration

`git pull` incorporates changes from another repository into the current branch. In practice, this means `fetch` followed by integration, usually merge or rebase depending on configuration/options.

The video should make this distinction explicit because it often unlocks Git for confused users.

Useful phrasing:

> Fetch says: "What happened over there?" Pull says: "Bring that over here and integrate it into what I have checked out."

Sources:

- https://git-scm.com/docs/git-pull
- https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes

## Historical context

### Before Git: centralized mental model

Older centralized systems such as CVS, Subversion, and Perforce used a central server model. In that model, the central repository is the place where version history lives, and clients normally depend on that central system for important operations.

This model is easier to explain administratively, but it creates a different mental relationship:

- the server feels like the source of truth
- the local checkout feels like a working copy
- local offline work is limited compared with distributed version control
- committing usually means talking to the central repository

The video can use this as the opening contrast, but should avoid becoming a history lesson or a rant against SVN.

Sources:

- https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control
- https://svnbook.red-bean.com/

### Git's shift

Git's shift is that the local repository is not just a checkout. It contains history.

This is the conceptual foundation for the whole video:

> In Git, your machine has the graph. The remote has another copy of the graph. Synchronization moves graph data and refs between repositories.

## Local-first framing

### Local-first software definition

Local-first software is a design philosophy where the primary copy of data lives on the user's device, while synchronization with other devices or servers happens separately. The Ink & Switch essay describes local-first software as trying to combine collaboration with ownership.

Local-first ideals include:

- fast local interaction
- work not trapped on one device
- optional network
- collaboration
- long-term preservation
- security and privacy
- user ownership and control

Source:

- https://www.inkandswitch.com/essay/local-first/

### How Git aligns with local-first ideas

Git is not usually described as a local-first app in Git documentation, but it strongly matches several local-first ideas:

- work can continue offline
- the local repository contains durable history
- synchronization is separate from local work
- remote servers are useful but not conceptually required for versioning
- repository data can be copied, backed up, and moved between machines

For this video, "local-first" should be used as a mental framing device, not as a claim that Git was designed from the modern local-first movement.

Good claim:

> Git feels modern because it separates local work from synchronization.

Avoid claim:

> Git invented local-first software.

### Where Git differs from modern local-first apps

Git is optimized for source code and explicit commits, not real-time simultaneous editing of the same object.

Modern local-first applications often explore CRDTs or other conflict-resolution models so multiple users can edit shared data concurrently. Git instead generally records commits and resolves conflicts during merge/rebase/pull workflows.

This distinction keeps the video honest:

- Git is local-first-like for versioned source code workflows.
- Git is not the complete answer for collaborative documents, whiteboards, spreadsheets, or design tools.

Source:

- https://www.inkandswitch.com/essay/local-first/

## Important terminology

### Repository

A Git repository is the project database and metadata that stores history, objects, refs, and configuration. The working tree is not the whole repository.

### Working tree / working directory

The editable files checked out on disk. This is where the developer changes files.

### Index / staging area

The proposed next commit. This lets the developer choose what goes into the next snapshot.

### Commit

A snapshot of project state plus metadata and parent links.

### Parent commit

A link from a commit to the commit or commits that came before it. Parent links form the commit graph.

### Commit graph

The graph created by commits and parent relationships. This is the primary visual metaphor for the video.

### Branch

A movable name pointing to a commit.

### `HEAD`

The current checkout reference. Usually it points to the current branch, which points to the current commit.

### Remote

Another repository configured for synchronization.

### Remote-tracking branch

A local reference that records the last known state of a branch in a remote repository, such as `origin/main`.

### Fetch

Download data and update local knowledge of a remote without automatically integrating it into the current branch.

### Pull

Fetch plus integration into the current branch.

### Push

Send local commits and ref updates to another repository.

### Merge

Integrate histories, often by creating a commit with multiple parents when histories diverged.

### Rebase

Replay commits onto a new base, creating new commits and changing the visible history shape.

## Common misconceptions to address

### Misconception: GitHub is Git

Correction: Git is the version-control system. GitHub is a hosting and collaboration platform for Git repositories.

### Misconception: The remote is the repository

Correction: A remote is another repository. Your local repository is also a real repository.

### Misconception: `origin/main` is the same as `main`

Correction: `origin/main` is local Git's last known position of `main` on `origin`. Local `main` is your branch.

### Misconception: `fetch` and `pull` are basically the same

Correction: `fetch` updates local knowledge of remote state. `pull` fetches and then integrates.

### Misconception: A branch is a copy of the project

Correction: A branch is a pointer to a commit. It is cheap because it is only a movable name in the graph.

### Misconception: Rebase moves existing commits unchanged

Correction: Rebase replays changes and creates new commits. The resulting patches may be equivalent, but the commit identities and parent relationships change.

### Misconception: Merge and rebase are moral opposites

Correction: They are different graph operations with different trade-offs. Merge preserves the shape of parallel work. Rebase produces a more linear history by replaying work.

### Misconception: Offline support is a minor convenience

Correction: Offline support follows from the deeper architecture: local history plus synchronization as a separate step.

## Useful examples for later phases

### Example 1: centralized contrast

Developer wants to save a versioned checkpoint while offline.

Centralized mental model:

- local checkout can be edited
- commit/check-in depends on central repository availability

Git mental model:

- local repository already has history
- commit creates a new local snapshot
- push can happen later

### Example 2: branch pointer movement

Initial graph:

```text
A -- B -- C  main, HEAD
```

Create a branch:

```text
A -- B -- C  main, feature, HEAD -> feature
```

Commit on feature:

```text
A -- B -- C  main
          \
           D  feature, HEAD
```

Teaching point: the project was not copied. A name moved.

### Example 3: fetch vs pull

Before fetch:

```text
Local:
A -- B  main, origin/main

Remote origin:
A -- B -- C  main
```

After fetch:

```text
Local:
A -- B  main
      \
       C  origin/main
```

After pull with merge or fast-forward, local `main` integrates `C`.

Teaching point: fetch updates knowledge; pull changes the current branch by integrating.

### Example 4: merge

Before merge:

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

Teaching point: merge keeps both histories and creates a join point when needed.

### Example 5: rebase

Before rebase:

```text
A -- B -- C  main
      \
       D -- E  feature
```

After rebase feature onto main:

```text
A -- B -- C  main
           \
            D' -- E'  feature
```

Teaching point: rebase replays the feature work onto a new base, creating new commits.

## Counterexamples and caveats

### Not everything is local

Network is required for operations that communicate with another repository:

- fetch
- pull
- push
- clone from a network remote
- ls-remote

Some commands may also require objects that are not present locally in partial or shallow clones.

### Shallow clones and partial clones complicate the simple model

For the target audience, the clean model should be a normal full clone. Shallow and partial clones are advanced caveats and should probably be omitted unless needed in a footnote or later video.

### Hosted platforms still matter socially

Git does not require one canonical server, but teams often designate GitHub, GitLab, Bitbucket, or an internal server as the canonical collaboration point.

This is a social/project convention, not a limitation of Git's underlying model.

### Conflicts are not solved magically

Git can combine histories, but conflicting changes still require human decisions. The video should not imply that local-first or distributed version control eliminates conflict resolution.

### Rebase can be dangerous on shared history

Because rebase creates new commits, rebasing commits that others already depend on can create confusion. This can be mentioned as a practical warning but should not dominate the mental-model video.

## Visual research notes

The specs already identify a graph-first visual direction. Research supports that choice.

The most important visual primitives are:

- commit node
- parent edge
- branch pointer
- `HEAD` pointer
- local repository container
- remote repository container
- working tree
- staging/index area
- command callout

Visual operations to support:

- create commit: add node and move branch pointer
- create branch: add pointer to existing node
- checkout/switch: move `HEAD`
- merge: create join commit or fast-forward pointer
- rebase: copy/replay commits onto new base and move branch pointer
- fetch: move remote-tracking branch locally
- pull: fetch then merge/rebase
- push: update another repository's branch pointer and send missing objects

## Research implications for treatment

The video should probably not begin with low-level object internals. It should begin with the practical confusion:

> Why can I commit, branch, merge, and inspect history without the internet?

Then answer by revealing the local graph.

The explanatory progression should likely move from:

1. centralized mental model
2. local repository as full history
3. commits as graph nodes
4. branches and `HEAD` as pointers
5. working tree/index/commit as local workflow
6. merge and rebase as graph operations
7. remotes as other repositories
8. fetch/pull/push as synchronization

This is only a research implication, not an approved treatment.

## Open questions for later phases

- How much of the staging area/index should be included in a six-minute video?
- Should the video mention GitHub only as a misconception, or use it in examples?
- Should rebase be included fully, or introduced only as "replay commits" and saved for a later video?
- Should the centralized contrast mention Subversion by name, or keep it generic?
- Should the video include a small warning about rebasing shared history?

## Source list

Primary Git sources:

- Pro Git: About Version Control — https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control
- Pro Git: What is Git? — https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F
- Pro Git: Branches in a Nutshell — https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell
- Pro Git: Basic Branching and Merging — https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging
- Pro Git: Rebasing — https://git-scm.com/book/en/v2/Git-Branching-Rebasing
- Pro Git: Working with Remotes — https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes
- Pro Git: Reset Demystified — https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified
- git-fetch documentation — https://git-scm.com/docs/git-fetch
- git-pull documentation — https://git-scm.com/docs/git-pull

Contextual sources:

- Local-first software, Ink & Switch — https://www.inkandswitch.com/essay/local-first/
- Subversion book — https://svnbook.red-bean.com/

## Gate status

This research file is `in-progress` and ready for human review.
