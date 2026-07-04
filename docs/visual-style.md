# Visual Style Guide

This repository favors calm, precise educational visuals.

The goal is not to impress with motion. The goal is to make abstract systems understandable.

## General direction

- dark background
- minimal geometric objects
- large readable text
- generous spacing
- few objects on screen at once
- slow intentional transitions
- high contrast

## Motion principles

Every motion should answer one of these questions:

- where did this object come from?
- what is connected to what?
- what changed?
- what caused the next thing to happen?
- where should the viewer look now?

Avoid motion that only decorates the scene.

## Suggested visual meanings

These are starting conventions, not permanent rules.

- circles: units, nodes, neurons, components
- lines: connections or dependencies
- moving dots: signals, data, information flow
- line thickness: importance, strength, or weight
- glow/pulse: current focus
- red: error, failure, mismatch, impossible case
- blue: input/data
- green: output/success
- orange/yellow: weights or adjustable parameters

## Text

- Prefer short labels.
- Avoid full paragraphs on screen.
- Narration should carry the explanation.
- Text should support the visual, not replace it.

## Camera

- Camera movement should be subtle.
- Prefer object movement over camera movement.
- Do not shake the camera.
- Do not use fast zooms.

## For Act I backpropagation

The viewer should be able to visually understand:

1. a neuron appears
2. inputs connect to it
3. weights appear on connections
4. signals move through weighted inputs
5. the neuron combines information
6. an output is produced
7. changing a weight changes the decision
8. the perceptron becomes a linear decision boundary
9. one line cannot separate every pattern
