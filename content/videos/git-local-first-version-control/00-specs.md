---
type: specs
status: in-progress
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

Target: 4–6 minutes.

Acceptable range: 3–7 minutes.

This should be longer than a tiny short, but still focused enough to finish and upload soon.

## Scope

The video should explain, at a high level:

- centralized version control as contrast
- local repository vs remote repository
- commit as a point in project history
- commit parent links and commit graph
- branch as a movable name/pointer
- `HEAD` as the current checkout/reference
- merge as combining histories
- rebase as replaying commits on a new base
- fetch as updating local knowledge of a remote
- pull as fetch plus integration
- apply as applying a patch to the working tree
- why many Git operations work offline

## Non-goals

Do not explain:

- every Git command
- Git internals in full detail
- object storage, hashing, packfiles, refs layout, reflog, or index internals beyond what is needed
- detailed conflict resolution workflows
- GitHub/GitLab-specific collaboration features
- submodules
- hooks
- advanced branching models such as Git Flow

The video may mention older centralized systems such as SourceSafe or Subversion only as contrast, not as a full historical lesson.

## Tone

Calm, practical, slightly playful.

A small joke about centralized-version-control nightmares is fine, but the video should not become a rant.

Preferred feeling:

- “Ah, Git is a graph I have locally.”
- “Fetch and pull are different for a reason.”
- “Merge and rebase are different ways to integrate histories.”

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
- `RemoteRepository`
- `WorkingTree`
- `PatchCard`
- `CommandCallout`
- `ComparisonFrame`

Useful visual contrasts:

- centralized server model vs local repository model
- branch pointer moving as commits are added
- merge creating a join commit
- rebase replaying commits as new commits
- fetch moving `origin/main` without moving local `main`
- pull as fetch plus merge/rebase
- apply as patch into working tree, not necessarily history

## Framework goals

This video should test whether the framework can handle:

- graph-based visual state
- pointer movement
- before/after transformations
- command callouts synchronized with narration
- local vs remote copies of similar objects
- reusable technical diagram components

## Ready checklist

Before marking this specs file `ready`, decide:

- Is the video mainly “Git works offline” or “Git mental model with local-first as the unifying idea”?
- Should staging/index be included, or avoided to keep the video focused?
- Should `apply` be included in this first Git video, or saved for a later patch-oriented video?
- Is the target duration closer to 4 minutes or 6 minutes?
- Should the comparison to SourceSafe/Subversion be a short opening contrast or a recurring comparison?
