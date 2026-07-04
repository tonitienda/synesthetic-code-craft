# 04 — Timeline

This file is the source of truth for Act I timing, narration, and animation intent.

It is designed to guide both Motion Canvas implementation and future TTS generation.

The older `04-animation-spec.md` and `05-narration.md` are kept for reference during this migration, but this timeline should drive the next Act I implementation pass.

## Act I — The First Artificial Neuron

Target duration: approximately 100 seconds.

Acceptable range: 90–120 seconds.

Pacing goal: calm, clear, enough time for narration and comprehension.

## Timing rules

- Times are relative to each scene, not absolute video time.
- Scene durations are budgets, not frame-perfect constraints.
- Codex may adjust by a few seconds if needed for readability.
- Do not compress the act below 90 seconds.
- Prefer silence/visual pauses over rushing.

## Implementation rule

For the next iteration, update Motion Canvas from this file first.

If this file conflicts with `04-animation-spec.md` or `05-narration.md`, prefer this file.

---

# Scene 1.1 — Title

Duration: 8s

## 0.0s

Animation:
- Create dark gradient background.
- Fade in title: `Backpropagation`.
- Title drifts slightly upward.

Narration:
"Backpropagation."

## 2.0s

Animation:
- Fade in subtitle below title: `How neural networks learn from mistakes`.

Narration:
"How neural networks learn from mistakes."

## 5.5s

Animation:
- Hold title and subtitle briefly.
- Fade out title and subtitle.

Narration:
[silent]

---

# Scene 1.2 — The story starts smaller

Duration: 11s

## 0.0s

Animation:
- Fade in text: `But the story does not start with a deep network.`

Narration:
"But the story does not start with a deep network."

## 3.2s

Animation:
- Move text gently to top center.
- Fade in a single glowing circle at center.

Narration:
"It starts with a single artificial neuron."

## 6.5s

Animation:
- Label the circle: `artificial neuron`.
- Hold the circle and label.

Narration:
[silent]

## 9.0s

Animation:
- Fade out explanatory text and label.
- Keep the neuron circle.

Narration:
[silent]

---

# Scene 1.3 — Historical anchor

Duration: 13s

## 0.0s

Animation:
- Move neuron circle to the right.
- Fade in a minimal portrait placeholder on the left.

Narration:
"In the late nineteen fifties, Frank Rosenblatt introduced the perceptron."

## 4.5s

Animation:
- Add labels under portrait: `Frank Rosenblatt` and `1958`.

Narration:
[silent]

## 6.5s

Animation:
- Fade in word `Perceptron` above the neuron.

Narration:
"It was one of the first learning machines."

## 10.0s

Animation:
- Hold the historical composition.
- Fade out portrait, name, date, and `Perceptron`.
- Move neuron back to center.

Narration:
[silent]

---

# Scene 1.4 — Concrete inputs

Duration: 17s

## 0.0s

Animation:
- Fade in title at top: `Example: predicting an exam result`.
- Keep neuron at center.

Narration:
"For example, imagine we want to predict whether a student passes an exam."

## 4.0s

Animation:
- Grow first input line from left to neuron.
- Label it: `x₁ = hours studied`.

Narration:
"One input could be hours studied."

## 7.5s

Animation:
- Grow second input line from left to neuron.
- Label it: `x₂ = hours slept`.

Narration:
"Another input could be hours slept."

## 11.0s

Animation:
- Create one signal dot on each input line.
- Move both signals toward the neuron, slightly staggered.

Narration:
"The perceptron receives both numbers."

## 15.0s

Animation:
- Hold the complete input diagram.

Narration:
[silent]

---

# Scene 1.5 — Weights appear

Duration: 14s

## 0.0s

Animation:
- Keep neuron and two input lines visible.
- Slightly dim the input labels.

Narration:
"But not every input has the same importance."

## 3.0s

Animation:
- Fade in weight labels `w₁` and `w₂` above the two connections.

Narration:
"Each connection has a weight."

## 6.0s

Animation:
- Highlight first connection and `w₁`.
- Make first connection slightly thicker.

Narration:
"A weight controls how strongly that input matters."

## 10.0s

Animation:
- Highlight second connection and `w₂`.
- Make second connection slightly thicker.
- Hold both weighted connections.

Narration:
[silent]

---

# Scene 1.6 — Weighted sum

Duration: 14s

## 0.0s

Animation:
- Fade in `Σ` inside the neuron.

Narration:
"The neuron multiplies each input by its weight."

## 3.5s

Animation:
- Write equation near bottom: `x₁w₁ + x₂w₂`.
- Highlight the terms one by one.

Narration:
[silent]

## 6.5s

Animation:
- Move weighted signals along both input lines into the neuron.
- Pulse `Σ` when the signals arrive.

Narration:
"Then it adds the weighted values together."

## 11.0s

Animation:
- Hold the equation and sigma.

Narration:
[silent]

---

# Scene 1.7 — Activation and output

Duration: 12s

## 0.0s

Animation:
- Grow output line from neuron to the right.
- Label output line: `pass / not pass`.

Narration:
"If the combined signal is strong enough, the neuron activates."

## 4.5s

Animation:
- Move output signal through output line.

Narration:
"And it produces one output."

## 7.0s

Animation:
- Emphasize output label.

Narration:
"Pass, or not pass."

## 10.0s

Animation:
- Hold full perceptron diagram.

Narration:
[silent]

---

# Scene 1.8 — Learning as weight change

Duration: 13s

## 0.0s

Animation:
- Focus on `w₁`.
- Slightly zoom or spotlight the first weighted connection.

Narration:
"Now comes the important idea."

## 2.5s

Animation:
- Increase first connection thickness.
- Scale `w₁` from normal to slightly larger.

Narration:
"Changing a weight changes how the neuron decides."

## 6.5s

Animation:
- Replay a signal through the first input.
- Replay output signal.
- Pulse the output.

Narration:
"This is the seed of learning."

## 10.0s

Animation:
- Hold the changed connection and output.

Narration:
[silent]

---

# Scene 1.9 — Concrete example becomes geometry

Duration: 18s

## 0.0s

Animation:
- Fade out perceptron diagram.
- Fade in text: `The same example can be drawn as geometry.`

Narration:
"Now look at the same example as geometry."

## 3.0s

Animation:
- Draw 2D axes.
- X-axis label: `hours studied`.
- Y-axis label: `hours slept`.

Narration:
"The horizontal position is hours studied."

## 6.0s

Animation:
- Highlight Y-axis label.

Narration:
"The vertical position is hours slept."

## 8.5s

Animation:
- Add two `pass` points in upper/right-ish area.
- Add two `not pass` points in lower/left-ish area.

Narration:
"Each student becomes a point."

## 12.0s

Animation:
- Label or color the two groups: `pass` and `not pass`.

Narration:
"Some students pass. Some students do not."

## 15.0s

Animation:
- Hold graph with points.

Narration:
[silent]

---

# Scene 1.10 — Decision boundary line

Duration: 17s

## 0.0s

Animation:
- Draw a clean line between the pass and not-pass groups.

Narration:
"With two inputs, a perceptron tries to separate these two groups with a line."

## 5.0s

Animation:
- Add label near line: `decision boundary`.

Narration:
"That line is called a decision boundary."

## 8.0s

Animation:
- Rotate the decision boundary slightly.

Narration:
"Changing the weights moves or rotates the line."

## 12.0s

Animation:
- Shift the decision boundary slightly.
- Show that the separation changes.

Narration:
"Learning means moving the boundary until the mistakes get smaller."

## 15.5s

Animation:
- Hold final clean separation.

Narration:
[silent]

---

# Scene 1.11 — The limitation

Duration: 16s

## 0.0s

Animation:
- Fade out pass/not-pass points.
- Keep graph axes and decision boundary.
- Add four XOR-like points in alternating classes.

Narration:
"This is powerful."

## 3.0s

Animation:
- Try rotating the decision boundary once.

Narration:
"But it is also limited."

## 6.0s

Animation:
- Try several line positions/rotations.
- None separate all points.
- Add subtle failure shake to line.

Narration:
"Some patterns cannot be separated by one line."

## 10.0s

Animation:
- Hold the failed separation.

Narration:
"A single perceptron can learn, but only within this linear world."

## 13.0s

Animation:
- Fade in bottom question: `What if one line is not enough?`

Narration:
"So what happens if one line is not enough?"

## 15.0s

Animation:
- Hold the question.
- Fade out.

Narration:
[silent]
