# 01 — Research

## Purpose

This file contains factual and conceptual source material for Act I.

It is not narration.
It is not animation.
It is the reference layer.

## Act I goal

Introduce the perceptron and make the viewer understand why backpropagation eventually became necessary.

Backpropagation should not be explained yet.
Act I should create the first puzzle.

## Historical notes

### 1943 — McCulloch and Pitts

Warren McCulloch and Walter Pitts proposed an early mathematical model of a neuron.

Their model showed that simple artificial neurons could be used to represent logical computation.

This was not yet modern learning, but it helped establish the idea that computation could be described using neuron-like units.

### 1957–1958 — Frank Rosenblatt

Frank Rosenblatt introduced the perceptron.

The perceptron was inspired by biological neurons and became one of the earliest learning machines.

The exciting idea was that the machine could improve by adjusting internal weights from examples.

## Problem the perceptron tried to solve

Can a machine learn to classify examples?

Examples:

- classify points into two groups
- decide whether an input pattern belongs to class 0 or class 1
- learn a boundary from data instead of being manually programmed

## The perceptron mechanism

A perceptron receives numbers as inputs.

Each input travels through a connection.

Each connection has a weight.

The perceptron multiplies each input by its weight.

Then it adds the weighted values together.

The result goes through a simple activation function.

The output is usually a binary decision.

## Intuition

Inputs answer:

> What information do we have?

Weights answer:

> How much should each piece of information matter?

The activation answers:

> Is the combined evidence enough to activate the neuron?

## Learning intuition

If the perceptron makes a mistake, its weights can be adjusted.

Changing the weights changes the decision boundary.

This is the first important intuition:

> learning means changing weights so future decisions become better.

## Capability

A single perceptron can learn linearly separable problems.

Examples:

- AND
- OR
- simple two-class datasets that can be separated by one straight line

## Limitation

A single perceptron can only represent a linear decision boundary.

It cannot solve XOR.

XOR is the classic motivation for needing multiple neurons and hidden layers.

## Act I ending

The viewer should finish Act I with this thought:

> A perceptron can learn, but one perceptron can only draw a line.

This naturally opens Act II:

> What if one line is not enough?
