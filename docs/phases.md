# Phases for each project

The video definition follows a process of refinement that goes from more general to more specific until the final product is ready.
Each phase will generate a numbered file that will be used as the input for the next phase.
Each file has a front matter like:

```yaml
type: research
depends_on: [specs]
status: ready | in-progress
```

A phase cannot start if their dependencies are not ready.

## 00 - specs

Defines the goal for the video: the topic, purpose, tone, size format (short, medium long), audience, hints about the style, etc.

In order to move to research specially the topic and the depth of the explanation needs to be clear.
If it is not clear we can start with the research this file needs to be refined.

## 01 - Research

Depends on: specs
contains: information required to explain the topic in depth

Based on the purpose and the topic we can start with the research.
Things like: where this came from, what problem we are solving, what did not work before, the mechanism of the system we are trying to explain, examples and counterexamples, and alternatives, etc need to be clear.
The goal of this document is to understand the topic in depth enough that we can start desiging the Acts of the video.

## 02 - Treatment

Depends on: Research, Specs
constains: Acts of the video. High level structure of the contents

## 03 - Beats

Depends on: Treatment, Specs

## 04 - Narration

Depends on: beats, Specs
contains: the narration timeline act by act

## 05 - Scene timeline

Depends on: Beats and Narration
Contains: screens and animations aligned with the narration using the DSL described in content/language/animation-spec-v0.md
