---
type: beats
status: in-progress
depends_on:
  - 00-specs.md
  - 01-research.md
  - 02-treatment.md
---

# 03 — Beats: Git local-first version control

## Beat sequence

```yaml
beats:
  - id: b001
    act: act-1
    title: "A folder starts remembering badly"
    purpose: "Begin with the familiar pain that source control solves before naming any tool."
    key_idea: "When files change without structured history, people invent anxious copies."
    visual_hint: "A clean project folder gradually fills with names like app-final.js and app-final-before-demo.js."
    transition_to_next: "Compress the messy copies into the idea of project memory."

  - id: b002
    act: act-1
    title: "Source control gives the project memory"
    purpose: "Define source control in human terms."
    key_idea: "Version control creates checkpoints, comparison, recovery, and collaboration."
    visual_hint: "The scattered file copies collapse into an ordered timeline of saved project states."
    transition_to_next: "Ask where that memory lives when a team shares it."

  - id: b003
    act: act-2
    title: "One shared place for history"
    purpose: "Introduce centralized source control as a real solution to team coordination."
    key_idea: "Older systems often put the authoritative project history on one central server."
    visual_hint: "A bright central repository appears, with several developer working copies around it."
    transition_to_next: "Zoom into what each developer machine contains."

  - id: b004
    act: act-2
    title: "Working copies orbit the server"
    purpose: "Make the client-server mental model visible."
    key_idea: "The server feels like where version control really happens; local machines feel like editable copies."
    visual_hint: "Developer laptops show files and a thin checkout; the central server shows the full history timeline."
    transition_to_next: "Remove or dim the connection to reveal the model's friction."

  - id: b005
    act: act-3
    title: "When history is over there"
    purpose: "Show the friction caused by imagining history as server-owned."
    key_idea: "If my machine has files but the server has history, local checkpoints, experiments, and inspection feel heavier."
    visual_hint: "A developer tries to work while the server-history glow fades out of reach."
    transition_to_next: "Pose the turning question: what if the laptop had the whole history?"

  - id: b006
    act: act-3
    title: "The turning question"
    purpose: "Create the need for Git's local-first inversion."
    key_idea: "The core architectural shift is to make the laptop more than a working copy."
    visual_hint: "Text contrast: centralized model = local files, server history; next line leaves space for the Git model."
    transition_to_next: "Fill the empty side with files plus history on the local machine."

  - id: b007
    act: act-4
    title: "Git moves the memory into the clone"
    purpose: "Introduce Git as the local-first inversion."
    key_idea: "In Git, a clone carries the project history instead of merely borrowing files from a server."
    visual_hint: "The central history graph duplicates into the laptop, and the laptop gains its own repository frame."
    transition_to_next: "Replace the single timeline with a connected graph of commits."

  - id: b008
    act: act-4
    title: "History becomes a local commit graph"
    purpose: "Establish the graph as the core object for the rest of the video."
    key_idea: "A commit is a saved point in history, and parent links connect commits into a graph."
    visual_hint: "Commit nodes appear on the laptop desk, connected by parent arrows from newer commits to older commits."
    transition_to_next: "Add names that point into the graph."

  - id: b009
    act: act-5
    title: "A branch is a movable name"
    purpose: "Correct the common misconception that branches are whole project copies."
    key_idea: "A branch is a lightweight pointer to a commit, not a duplicate folder."
    visual_hint: "A `main` label points at commit C; a `feature` label appears pointing at the same commit without copying nodes."
    transition_to_next: "Show how Git knows which pointer you are using."

  - id: b010
    act: act-5
    title: "HEAD says you are here"
    purpose: "Introduce `HEAD` as the viewer's location marker in the graph."
    key_idea: "In the common case, `HEAD` follows the current branch, and that branch points to a commit."
    visual_hint: "A small `HEAD` marker attaches to `feature`, which points at commit C."
    transition_to_next: "Make a new commit and let the current branch move."

  - id: b011
    act: act-5
    title: "Committing moves the current branch locally"
    purpose: "Show why local commits and branches feel cheap."
    key_idea: "Creating a commit adds a node and advances the checked-out branch; no network is required."
    visual_hint: "A new commit D appears after C; `feature` moves to D while `main` stays on C."
    transition_to_next: "Let the two pointers diverge enough to require integration."

  - id: b012
    act: act-6
    title: "Histories diverge"
    purpose: "Set up merge and rebase as answers to the same graph problem."
    key_idea: "When two lines of work grow from a shared commit, Git needs a way to integrate them."
    visual_hint: "`main` advances to C while `feature` contains D and E from an earlier base."
    transition_to_next: "First show the integration that preserves both roads."

  - id: b013
    act: act-6
    title: "Merge builds a bridge"
    purpose: "Explain merge as graph integration that preserves parallel history."
    key_idea: "A merge commit can join two histories by having two parents."
    visual_hint: "A merge node M appears where `main` joins C with feature commit E; parent edges highlight both inputs."
    transition_to_next: "Reset to the same divergence and show the alternate graph shape."

  - id: b014
    act: act-6
    title: "Rebase replays the road"
    purpose: "Explain rebase as replaying commits on a new base."
    key_idea: "Rebase creates new commits with new parent history, making the line look as if the work started later."
    visual_hint: "D and E fade into D' and E' after C, while the original branch line becomes ghosted."
    transition_to_next: "Step back from local graph operations and bring in another repository."

  - id: b015
    act: act-7
    title: "A remote is another repository"
    purpose: "Return to the central thesis after local graph operations are clear."
    key_idea: "A remote is not Git's source of truth; it is another repository that can synchronize with yours."
    visual_hint: "Local and remote repository frames sit side by side, each with a similar commit graph."
    transition_to_next: "Name the usual default remote and the local memory of its branch."

  - id: b016
    act: act-7
    title: "origin is a nickname, origin/main is local knowledge"
    purpose: "Prepare the fetch explanation without platform-specific workflows."
    key_idea: "`origin` names another repository; `origin/main` is a local remote-tracking pointer recording what was last observed there."
    visual_hint: "The remote repository is labeled `origin`; inside the local repo, an `origin/main` pointer marks the last known remote `main`."
    transition_to_next: "Let the remote move ahead, then update local knowledge."

  - id: b017
    act: act-8
    title: "Fetch asks what happened over there"
    purpose: "Separate synchronization from integration."
    key_idea: "Fetch brings remote objects and moves remote-tracking refs, but it does not move the current local branch."
    visual_hint: "A new commit arrives into the local repository and `origin/main` moves to it; `main` remains behind."
    transition_to_next: "Now show the command that also integrates."

  - id: b018
    act: act-8
    title: "Pull is fetch plus integration"
    purpose: "Resolve the common fetch-versus-pull confusion."
    key_idea: "Pull first fetches, then integrates the fetched history into the current branch by fast-forward, merge, or rebase."
    visual_hint: "A two-step callout: fetch moves `origin/main`; integration then moves or reshapes local `main`."
    transition_to_next: "Complete the synchronization loop by sending local commits outward."

  - id: b019
    act: act-8
    title: "Push sends local history outward"
    purpose: "Explain push as synchronization from local to remote."
    key_idea: "Push transfers local commits to another repository and asks that repository to move its branch pointer."
    visual_hint: "Local-only commits flow to the remote graph, then the remote `main` pointer advances if allowed."
    transition_to_next: "Summarize the whole architecture in one coherent model."

  - id: b020
    act: act-9
    title: "The model snaps into place"
    purpose: "Close with the local-first mental model and no new concepts."
    key_idea: "Git is local project memory plus synchronization: commits are graph nodes, branches and HEAD are pointers, and remotes are other repositories."
    visual_hint: "A compact recap transforms from messy files to centralized memory to local graph plus remote sync."
    transition_to_next: "End on the viewer's everyday commands feeling like graph and synchronization operations."
```

## Review notes

- The sequence intentionally keeps Acts 1–3 compact so the history section explains the need for Git without taking over the video.
- `HEAD`, branch pointers, remote-tracking pointers, merge, rebase, fetch, pull, and push all use the same pointer-and-graph visual language for downstream narration and scene timeline work.
- The beats avoid detailed command syntax, conflict resolution, hosted-platform workflows, and Git internals beyond commits, parent links, branches, and repository synchronization.

## Gate status

This beats file is `in-progress` and ready for human review.
