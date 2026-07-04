# Research — Act I

## Goal

Introduce the perceptron, why it was exciting, and the core mechanism behind it.

Act I should not explain backpropagation yet. It should create the need for it.

## Historical background

### 1943 — McCulloch and Pitts

Warren McCulloch and Walter Pitts proposed one of the earliest mathematical neuron models.

Their model showed that simple artificial neurons could represent logical computation.

### 1957–1958 — Frank Rosenblatt

Frank Rosenblatt introduced the perceptron.

The perceptron was inspired by biological neurons and became one of the first widely discussed learning machines.

It was exciting because it could adjust its own weights from examples instead of being explicitly programmed with every rule.

## Problem the perceptron tried to solve

Can a machine learn to classify examples from data?

For example:

- is this point red or blue?
- is this pattern one class or another?
- can a machine learn a decision boundary?

## Core concepts

### Inputs

The perceptron receives input values.

Each input is a number.

### Weights

Each input connection has a weight.

The weight controls how strongly that input contributes to the decision.

### Weighted sum

The perceptron multiplies each input by its weight and adds the results.

### Activation

The weighted sum is passed through a simple decision function.

In the classic perceptron, this is often a step function.

### Output

The output is usually a binary decision.

Example:

- class 0 or class 1
- no or yes
- inactive or active

## Learning idea

If the perceptron makes a mistake, its weights are adjusted.

Changing the weights changes the decision boundary.

This is the first important intuition for neural network training:

> learning means changing weights so future predictions become better.

## Capability

A single perceptron can learn linearly separable problems.

Examples:

- AND
- OR
- simple two-class separation where one straight line can divide the classes

## Limitation

A single perceptron can only form a linear decision boundary.

It cannot solve problems that require non-linear separation.

The classic example is XOR.

## Act I ending

The perceptron is powerful enough to be interesting, but limited enough to create the next question:

> If one neuron is not enough, what happens if we connect many of them?
