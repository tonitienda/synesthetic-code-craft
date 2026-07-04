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

NARRATE
"Backpropagation."

WAIT 0.6

CREATE Text
id: subtitle
text: How neural networks learn from mistakes
position: below title
size: medium
animation: fade in

NARRATE
"How neural networks learn from mistakes."

WAIT 1.0

FADE_OUT
targets: title, subtitle
duration: 0.8

---

# Scene 1.2 — The story starts smaller

CREATE Text
id: rewind_text
text: But the story does not start with a deep network.
position: center
size: medium
animation: fade in

NARRATE
"But the story does not start with a deep network."

WAIT 0.8

MOVE
target: rewind_text
position: top center
duration: 0.8

CREATE Circle
id: neuron
position: center
radius: 48
style: soft glow
animation: fade in

NARRATE
"It starts with a single artificial neuron."

CREATE Text
id: neuron_label
text: artificial neuron
position: below neuron
size: small
animation: fade in

WAIT 0.8

FADE_OUT
targets: rewind_text, neuron_label
duration: 0.5

---

# Scene 1.3 — Historical anchor

MOVE
target: neuron
position: right center
duration: 0.8

CREATE PortraitPlaceholder
id: rosenblatt
position: left center
style: monochrome outline
animation: fade in

CREATE Text
id: rosenblatt_name
text: Frank Rosenblatt
position: below rosenblatt
size: medium
animation: fade in

CREATE Text
id: rosenblatt_date
text: 1958
position: below rosenblatt_name
size: small
animation: fade in

NARRATE
"In the late nineteen fifties, Frank Rosenblatt introduced the perceptron."

WAIT 0.8

CREATE Text
id: perceptron_word
text: Perceptron
position: above neuron
size: large
animation: fade in

NARRATE
"It was one of the first learning machines."

WAIT 0.8

FADE_OUT
targets: rosenblatt, rosenblatt_name, rosenblatt_date, perceptron_word
duration: 0.6

MOVE
target: neuron
position: center
duration: 0.8

---

# Scene 1.4 — Inputs arrive

CREATE Line
id: input_1
from: left upper
to: neuron left edge
animation: grow toward neuron

CREATE Line
id: input_2
from: left center
to: neuron left edge
animation: grow toward neuron
stagger: 0.15

CREATE Line
id: input_3
from: left lower
to: neuron left edge
animation: grow toward neuron
stagger: 0.15

NARRATE
"The perceptron receives input values."

CREATE Text
id: x1
text: x₁
position: left of input_1
animation: fade in

CREATE Text
id: x2
text: x₂
position: left of input_2
animation: fade in

CREATE Text
id: x3
text: x₃
position: left of input_3
animation: fade in

NARRATE
"Each input is just a number."

WAIT 0.7

---

# Scene 1.5 — Signals move through inputs

CREATE Signal
id: signal_1
path: input_1
style: small glowing dot
animation: travel left to right

CREATE Signal
id: signal_2
path: input_2
style: small glowing dot
animation: travel left to right
stagger: 0.15

CREATE Signal
id: signal_3
path: input_3
style: small glowing dot
animation: travel left to right
stagger: 0.15

NARRATE
"The inputs carry information into the neuron."

WAIT 0.6

REMOVE
targets: signal_1, signal_2, signal_3

---

# Scene 1.6 — Weights appear

CREATE Text
id: w1
text: w₁
position: above input_1
animation: fade in

CREATE Text
id: w2
text: w₂
position: above input_2
animation: fade in

CREATE Text
id: w3
text: w₃
position: above input_3
animation: fade in

NARRATE
"Each connection has a weight."

HIGHLIGHT
target: input_1
style: thicken line

HIGHLIGHT
target: w1
style: glow

NARRATE
"The weight controls how strongly that input matters."

WAIT 0.4

HIGHLIGHT
target: input_2
style: thicken line less than input_1

HIGHLIGHT
target: w2
style: glow

WAIT 0.3

HIGHLIGHT
target: input_3
style: thicken line more than input_2

HIGHLIGHT
target: w3
style: glow

WAIT 0.6

---

# Scene 1.7 — Weighted sum

CREATE Text
id: sigma
text: Σ
position: inside neuron
size: large
animation: fade in

NARRATE
"The neuron multiplies each input by its weight."

CREATE Equation
id: weighted_terms
text: x₁w₁ + x₂w₂ + x₃w₃
position: bottom center
animation: write on

CREATE Signal
id: weighted_signal_1
path: input_1
animation: travel left to right

CREATE Signal
id: weighted_signal_2
path: input_2
animation: travel left to right
stagger: 0.15

CREATE Signal
id: weighted_signal_3
path: input_3
animation: travel left to right
stagger: 0.15

NARRATE
"Then it adds the weighted values together."

HIGHLIGHT
target: sigma
style: pulse

WAIT 0.8

---

# Scene 1.8 — Activation and output

CREATE Line
id: output_line
from: neuron right edge
to: right center
animation: grow away from neuron

CREATE Text
id: output_label
text: output
position: above output_line
animation: fade in

NARRATE
"If the combined signal is strong enough, the neuron activates."

CREATE Signal
id: output_signal
path: output_line
animation: travel left to right

NARRATE
"And it produces one output."

WAIT 0.8

---

# Scene 1.9 — Learning as weight change

FOCUS
target: w1
style: zoom slightly

NARRATE
"Now comes the important idea."

ANIMATE
target: input_1
property: thickness
from: normal
to: thick
duration: 0.8

ANIMATE
target: w1
property: scale
from: 1.0
to: 1.3
duration: 0.8

NARRATE
"Changing a weight changes how the neuron decides."

CREATE Signal
id: replay_signal_1
path: input_1
animation: travel left to right

CREATE Signal
id: replay_output
path: output_line
animation: travel left to right after replay_signal_1

HIGHLIGHT
target: output_signal
style: bright pulse

NARRATE
"This is the seed of learning."

WAIT 0.8

---

# Scene 1.10 — Geometry appears

FADE_OUT
targets: neuron, input_1, input_2, input_3, output_line, x1, x2, x3, w1, w2, w3, sigma, weighted_terms, output_label
duration: 0.8

CREATE Axis
id: graph_axes
position: center
x_label: x₁
y_label: x₂
animation: draw axes

CREATE Point
id: red_1
class: red
position: upper left
animation: fade in

CREATE Point
id: red_2
class: red
position: upper center
animation: fade in

CREATE Point
id: blue_1
class: blue
position: lower right
animation: fade in

CREATE Point
id: blue_2
class: blue
position: lower center
animation: fade in

NARRATE
"With two inputs, the perceptron becomes geometry."

CREATE Line
id: decision_boundary
position: between red and blue points
style: clean bright line
animation: draw line

NARRATE
"It draws a line between two classes."

WAIT 0.8

---

# Scene 1.11 — Moving the boundary

ANIMATE
target: decision_boundary
property: rotation
from: current
to: slightly rotated
duration: 1.0

NARRATE
"Changing the weights moves the line."

ANIMATE
target: decision_boundary
property: position
from: current
to: slightly shifted
duration: 1.0

NARRATE
"Learning means moving the boundary until the mistakes get smaller."

WAIT 0.8

---

# Scene 1.12 — The limitation

CREATE Point
id: xor_a
class: red
position: upper left
animation: fade in

CREATE Point
id: xor_b
class: red
position: lower right
animation: fade in

CREATE Point
id: xor_c
class: blue
position: upper right
animation: fade in

CREATE Point
id: xor_d
class: blue
position: lower left
animation: fade in

FADE_OUT
targets: red_1, red_2, blue_1, blue_2
duration: 0.4

NARRATE
"But some patterns cannot be separated by one line."

ANIMATE
target: decision_boundary
property: rotation
sequence: try several angles
duration: 2.0

HIGHLIGHT
target: decision_boundary
style: subtle failure shake

NARRATE
"A single perceptron is powerful, but limited."

WAIT 0.8

CREATE Text
id: next_question
text: What if one line is not enough?
position: center bottom
animation: fade in

NARRATE
"So what happens if one line is not enough?"

WAIT 1.0

FADE_OUT
targets: all
duration: 1.0
