# 00 — Video Overview

## Working title

Backpropagation: How Neural Networks Learn From Mistakes

## Purpose

Explain backpropagation by building the need for it step by step.

The viewer should not feel that backpropagation is a magic algorithm.

The viewer should feel that it is the natural answer to a problem created by multi-layer networks:

> How do we know which hidden weights contributed to the final error?

## Audience

Software engineers and technically curious viewers.

Assume basic programming intuition.
Do not assume machine learning knowledge.

## Tone

Calm.
Visual.
Precise.
Curious.

No hype.
No AI news style.
No rushed pacing.

## Visual identity

Minimal dark background.
Soft glowing geometry.
Signals as moving dots.
Connections as thin lines.
Weights as line thickness or small labels.
Errors as red highlights.

Motion should explain the concept.

## Planned acts

### Act I — The First Artificial Neuron

Introduce the perceptron.

Show inputs, weights, weighted sum, activation, output, and the idea that changing weights changes decisions.

End with the limitation:

> A single perceptron can only draw a linear boundary.

### Act II — The Wall

Introduce linearly separable problems and XOR.

Show why one perceptron is not enough.

### Act III — Hidden Layers

Show that connecting neurons creates intermediate representations.

Introduce the idea that hidden layers can solve problems one neuron cannot.

### Act IV — The Credit Assignment Problem

Make the central training problem clear.

If the final output is wrong, how much should each hidden weight change?

### Act V — The Chain Rule

Introduce the chain rule visually as sensitivity flowing through a chain of dependencies.

### Act VI — Backpropagation

Show the backward pass step by step.

Explain gradients as local sensitivity signals multiplied through the network.

### Act VII — The Training Loop

Connect the full loop:

```text
forward pass → prediction → loss → backward pass → weight update → repeat
```

## Current implementation scope

Only Act I should be implemented now.

Do not implement Acts II–VII yet.

The first implementation is a pipeline test.

Success means Act I is understandable, not perfect.
