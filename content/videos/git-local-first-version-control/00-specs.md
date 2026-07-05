---
type: specs
status: ready
depends_on: []
---

# 00 — Specs: Git local-first version control

## Working title

Git: local-first version control

Alternative titles to consider later:

- Git: why branches, merges, and rebases work locally
- Git is not just a remote repository
- Why Git works offline

## Purpose

Create a practical explainer that gives viewers a useful mental model for Git as a local-first, distributed version-control system.

The video should be useful for people who use Git commands but still feel that Git is a confusing set of rituals.

The goal is not to teach every command. The goal is to make the core objects and operations feel coherent.

## Core thesis

Git works offline because the repository history lives locally.

Commits, branches, diffs, merges, and rebases are mostly local graph operations. Remotes are other repositories that we synchronize with, not the only place where version control happens.

The video is mainly a Git mental model video, with local-first as the unifying idea.

## Audience

Primary audience:

- software developers who already use Git at a basic level
- developers who know commands like `commit`, `branch`, `merge`, `rebase`, `fetch`, and `pull`, but do not have a clear mental model
- developers coming from centralized version-control systems or only knowing Git through hosted platforms

Secondary audience:

- technically curious viewers who want to understand why Git feels different from older centralized systems

## Language

English for now.

The wording should remain simple enough to translate or rewrite in Spanish later.

## Target duration

Target: around 6 minutes.

Acceptable range: 5–7 minutes.

The final duration should depend on the narration needed to make the concepts clear. Do not compress the video so much that the graph operations become confusing.

## Scope

The video should explain, at a high level:

- centralized version control as opening contrast
- what drawbacks centralized systems had for local work and offline work
- local repository vs remote repository
- working tree, tracked files, untracked files, and staged changes as much as needed to make commits understandable
- commit as a point in project history
- commit parent links and commit graph
- branch as a movable name/pointer
- `HEAD` as the current checkout/reference
- merge as combining histories
- rebase as replaying commits on a new base
- fetch as updating local knowledge of a remote
- pull as fetch plus integration
- why many Git operations work offline

## Non-goals

Do not explain:

- every Git command
- Git internals in full detail
- object storage, hashing, packfiles, refs layout, reflog, or index internals beyond what is needed
- detailed conflict resolution workflows
- GitHub/GitLab-specific collaboration features
- `git apply` or patch workflows; save those for a later patch-oriented video
- submodules
- hooks
- advanced branching models such as Git Flow

The video may mention older centralized systems such as SourceSafe or Subversion as the opening contrast: where we came from, what the drawbacks were, and why Git being offline/distributed matters.

## Tone

Calm, practical, slightly playful.

A small joke about centralized-version-control nightmares is fine, but the video should not become a rant.

Preferred feeling:

- “Ah, Git is a graph I have locally.”
- “Fetch and pull are different for a reason.”
- “Merge and rebase are different ways to integrate histories.”
- “Centralized version control explains why Git’s local-first model was such a shift.”

Avoid:

- smugness
- overexplaining implementation details
- assuming the viewer is stupid
- pretending Git is simple when it is genuinely subtle

## Visual direction

The video should be graph-first.

Likely reusable visual components:

- `CommitGraph`
- `CommitNode`
- `BranchPointer`
- `HeadPointer`
- `LocalRepository`
- `RemoteRepository`
- `WorkingTree`
- `StagingArea`
- `CommandCallout`
- `ComparisonFrame`

Useful visual contrasts:

- centralized server model vs local repository model
- local repository as full history, not only a working copy
- working tree vs staged changes vs commit graph
- branch pointer moving as commits are added
- merge creating a join commit
- rebase replaying commits as new commits
- fetch moving `origin/main` without moving local `main`
- pull as fetch plus merge/rebase

## Framework goals

This video should test whether the framework can handle:

- graph-based visual state
- pointer movement
- before/after transformations
- command callouts synchronized with narration
- local vs remote copies of similar objects
- a small staged/unstaged/tracked-files model without overloading the video
- reusable technical diagram components

## Decisions already taken

- The video is a Git mental model video, with local-first as the unifying idea.
- Include staging/index concepts only as much as needed to explain commits.
- Exclude `git apply` from this first Git video.
- Aim for around 6 minutes, but let narration needs decide.
- Use SourceSafe/Subversion-style centralized systems as an opening contrast, not a recurring full comparison.

## Gate status

This specs file is `ready` for the research phase.
