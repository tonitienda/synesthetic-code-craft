# 04 — Animation Specification

This is the source-of-truth animation description for Act I.

It is intentionally written as human-readable pseudo-code.

Codex should translate this into Motion Canvas scenes and reusable components.

---

# Act I — The First Artificial Neuron

## Visual language

- dark background
- soft glow
- minimal geometry
- slow movement
- no crowded screens
- motion should explain the concept

## Timing guidance

Target duration: 90–120 seconds.

The first implementation was approximately 37 seconds, which was too fast.

Use pauses generously:

- short pause after each important label appears
- medium pause after the weighted sum appears
- medium pause before and after the concrete example becomes a graph
- do not overlap too many concepts at once

---

# Scene 1.1 — Title

CREATE Background
id: bg
style: dark gradient

CREATE Text
id: title
text: Backpropagation
position: center
size: large
animation: fade in, slight upward drift
duration: 1.0

NARRATE
"Backpropagation."

WAIT 0.8

CREATE Text
id: subtitle
text: How neural networks learn from mistakes
position: below title
size: medium
animation: fade in
duration: 1.0

NARRATE
"How neural networks learn from mistakes."

WAIT 1.4

FADE_OUT
targets: title, subtitle
duration: 1.0

---

# Scene 1.2 — The story starts smaller

CREATE Text
id: rewind_text
text: But the story does not start with a deep network.
position: center
size: medium
animation: fade in
duration: 1.0

NARRATE
"But the story does not start with a deep network."

WAIT 1.0

MOVE
target: rewind_text
position: top center
duration: 1.0

CREATE Circle
id: neuron
position: center
radius: 48
style: soft glow
animation: fade in
duration: 1.0

NARRATE
"It starts with a single artificial neuron."

CREATE Text
id: neuron_label
text: artificial neuron
position: below neuron
size: small
animation: fade in
duration: 0.8

WAIT 1.2

FADE_OUT
targets: rewind_text, neuron_label
duration: 0.8

---

# Scene 1.3 — Historical anchor

MOVE
target: neuron
position: right center
duration: 1.0

CREATE PortraitPlaceholder
id: rosenblatt
position: left center
style: monochrome outline
animation: fade in
duration: 1.0

CREATE Text
id: rosenblatt_name
text: Frank Rosenblatt
position: below rosenblatt
size: medium
animation: fade in
duration: 0.8

CREATE Text
id: rosenblatt_date
text: 1958
position: below rosenblatt_name
size: small
animation: fade in
duration: 0.8

NARRATE
"In the late nineteen fifties, Frank Rosenblatt introduced the perceptron."

WAIT 1.2

CREATE Text
id: perceptron_word
text: Perceptron
position: above neuron
size: large
animation: fade in
duration: 0.8

NARRATE
"It was one of the first learning machines."

WAIT 1.2

FADE_OUT
targets: rosenblatt, rosenblatt_name, rosenblatt_date, perceptron_word
duration: 0.8

MOVE
target: neuron
position: center
duration: 1.0

---

# Scene 1.4 — Concrete inputs

CREATE Text
id: example_title
text: Example: predicting an exam result
position: top center
size: medium
animation: fade in
duration: 0.8

NARRATE
"For example, imagine we want to predict whether a student passes an exam."

WAIT 1.0

CREATE Line
id: input_1
from: left upper
to: neuron left edge
animation: grow toward neuron
duration: 1.0

CREATE Text
id: x1
text: x₁ = hours studied
position: left of input_1
animation: fade in
duration: 0.8

NARRATE
"One input could be hours studied."

WAIT 0.8

CREATE Line
id: input_2
from: left lower
to: neuron left edge
animation: grow toward neuron
duration: 1.0

CREATE Text
id: x2
text: x₂ = hours slept
position: left of input_2
animation: fade in
duration: 0.8

NARRATE
"Another input could be hours slept."

WAIT 1.0

NARRATE
"The perceptron receives both numbers."

CREATE Signal
id: signal_1
path: input_1
style: small glowing dot
animation: travel left to right
duration: 1.2

CREATE Signal
id: signal_2
path: input_2
style: small glowing dot
animation: travel left to right
duration: 1.2
stagger: 0.25

WAIT 1.0

REMOVE
targets: signal_1, signal_2

---

# Scene 1.5 — Weights appear

NARRATE
"But not every input has the same importance."

WAIT 0.6

CREATE Text
id: w1
text: w₁
position: above input_1
animation: fade in
duration: 0.8

CREATE Text
id: w2
text: w₂
position: above input_2
animation: fade in
duration: 0.8

NARRATE
"Each connection has a weight."

WAIT 0.8

HIGHLIGHT
target: input_1
style: thicken line

HIGHLIGHT
target: w1
style: glow

NARRATE
"A weight controls how strongly that input matters."

WAIT 1.0

HIGHLIGHT
target: input_2
style: thicken line

HIGHLIGHT
target: w2
style: glow

WAIT 1.0

---

# Scene 1.6 — Weighted sum

CREATE Text
id: sigma
text: Σ
position: inside neuron
size: large
animation: fade in
duration: 0.8

NARRATE
"The neuron multiplies each input by its weight."

CREATE Equation
id: weighted_terms
text: x₁w₁ + x₂w₂
position: bottom center
animation: write on
duration: 1.2

WAIT 1.0

CREATE Signal
id: weighted_signal_1
path: input_1
animation: travel left to right
duration: 1.2

CREATE Signal
id: weighted_signal_2
path: input_2
animation: travel left to right
duration: 1.2
stagger: 0.25

NARRATE
"Then it adds the weighted values together."

HIGHLIGHT
target: sigma
style: pulse

WAIT 1.4

---

# Scene 1.7 — Activation and output

CREATE Line
id: output_line
from: neuron right edge
to: right center
animation: grow away from neuron
duration: 1.0

CREATE Text
id: output_label
text: pass / not pass
position: above output_line
animation: fade in
duration: 0.8

NARRATE
"If the combined signal is strong enough, the neuron activates."

CREATE Signal
id: output_signal
path: output_line
animation: travel left to right
duration: 1.2

NARRATE
"And it produces one output."

WAIT 0.6

NARRATE
"Pass, or not pass."

WAIT 1.0

---

# Scene 1.8 — Learning as weight change

FOCUS
target: w1
style: zoom slightly

NARRATE
"Now comes the important idea."

WAIT 0.6

ANIMATE
target: input_1
property: thickness
from: normal
to: thick
duration: 1.2

ANIMATE
target: w1
property: scale
from: 1.0
to: 1.3
duration: 1.2

NARRATE
"Changing a weight changes how the neuron decides."

CREATE Signal
id: replay_signal_1
path: input_1
animation: travel left to right
duration: 1.2

CREATE Signal
id: replay_output
path: output_line
animation: travel left to right after replay_signal_1
duration: 1.2

HIGHLIGHT
target: replay_output
style: bright pulse

NARRATE
"This is the seed of learning."

WAIT 1.2

---

# Scene 1.9 — Concrete example becomes geometry

FADE_OUT
targets: neuron, input_1, input_2, output_line, x1, x2, w1, w2, sigma, weighted_terms, output_label, example_title
duration: 1.0

CREATE Text
id: graph_intro
text: The same example can be drawn as geometry.
position: top center
size: medium
animation: fade in
duration: 0.8

NARRATE
"Now look at the same example as geometry."

WAIT 1.0

CREATE Axis
id: graph_axes
position: center
x_label: hours studied
y_label: hours slept
animation: draw axes
duration: 1.4

NARRATE
"The horizontal position is hours studied."

WAIT 0.6

NARRATE
"The vertical position is hours slept."

WAIT 0.8

CREATE Point
id: pass_1
class: pass
position: upper right
label: pass
animation: fade in
duration: 0.6

CREATE Point
id: pass_2
class: pass
position: mid right
label: pass
animation: fade in
duration: 0.6

CREATE Point
id: fail_1
class: not pass
position: lower left
label: not pass
animation: fade in
duration: 0.6

CREATE Point
id: fail_2
class: not pass
position: mid left
label: not pass
animation: fade in
duration: 0.6

NARRATE
"Each student becomes a point."

WAIT 0.8

NARRATE
"Some students pass. Some students do not."

WAIT 1.0

---

# Scene 1.10 — Decision boundary line

CREATE Line
id: decision_boundary
position: between pass and not pass points
style: clean bright line
animation: draw line
duration: 1.2

NARRATE
"With two inputs, a perceptron tries to separate these two groups with a line."

WAIT 1.0

CREATE Text
id: boundary_label
text: decision boundary
position: near decision_boundary
animation: fade in
duration: 0.8

NARRATE
"That line is called a decision boundary."

WAIT 1.0

ANIMATE
target: decision_boundary
property: rotation
from: current
to: slightly rotated
duration: 1.4

NARRATE
"Changing the weights moves or rotates the line."

WAIT 0.6

ANIMATE
target: decision_boundary
property: position
from: current
to: slightly shifted
duration: 1.4

NARRATE
"Learning means moving the boundary until the mistakes get smaller."

WAIT 1.2

---

# Scene 1.11 — The limitation

FADE_OUT
targets: pass_1, pass_2, fail_1, fail_2, boundary_label, graph_intro
duration: 0.8

CREATE Point
id: xor_a
class: red
position: upper left
animation: fade in
duration: 0.5

CREATE Point
id: xor_b
class: red
position: lower right
animation: fade in
duration: 0.5

CREATE Point
id: xor_c
class: blue
position: upper right
animation: fade in
duration: 0.5

CREATE Point
id: xor_d
class: blue
position: lower left
animation: fade in
duration: 0.5

NARRATE
"This is powerful."

WAIT 0.8

NARRATE
"But it is also limited."

WAIT 0.8

ANIMATE
target: decision_boundary
property: rotation
sequence: try several angles
duration: 2.4

HIGHLIGHT
target: decision_boundary
style: subtle failure shake

NARRATE
"Some patterns cannot be separated by one line."

WAIT 1.0

NARRATE
"A single perceptron can learn, but only within this linear world."

WAIT 1.0

CREATE Text
id: next_question
text: What if one line is not enough?
position: center bottom
animation: fade in
duration: 1.0

NARRATE
"So what happens if one line is not enough?"

WAIT 1.4

FADE_OUT
targets: all
duration: 1.0
