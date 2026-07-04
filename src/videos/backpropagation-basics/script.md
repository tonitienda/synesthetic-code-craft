# Backpropagation Basics — timestamped script

Target length: ~2 minutes. Visual timing is designed to match the Motion Canvas project in `src/projects/backpropagation-basics.ts`.

| Time | Visual beat | Narration |
| --- | --- | --- |
| 0:00-0:12 | Perceptron card appears: inputs flow through weighted lines into one neuron. A decision boundary draws across two classes. | "Start with the perceptron: a tiny machine that multiplies inputs by weights, adds them up, and turns the result into a yes-or-no decision." |
| 0:12-0:25 | Limitation banner appears under the decision boundary. | "It is useful when the world can be separated by a simple line: spam or not spam, pass or fail, signal or noise. But one line cannot bend around richer patterns." |
| 0:25-0:42 | A multilayer network fades in with inputs, hidden layers, and outputs. | "So we stack layers. Early neurons can notice edges or simple signals. Later neurons combine them into parts, concepts, and predictions." |
| 0:42-0:55 | Capability timeline appears, then the red training question appears. | "Depth gives us expressive power, but it creates a new problem: when the final answer is wrong, which hidden weight deserves the blame?" |
| 0:55-1:10 | Forward arrow travels from input to hidden state to output to loss. | "Training starts with a forward pass. The network predicts, compares the prediction to the target, and produces a loss: one number for how wrong it was." |
| 1:10-1:32 | Backward arrow travels from loss to output to hidden state to input. | "Backpropagation sends that error signal backward. At each operation it asks: if this value changed a little, how much would the loss change?" |
| 1:32-1:48 | Formula card appears: local sensitivity times downstream error. | "That is the chain rule in motion: a gradient is local sensitivity multiplied by downstream error. Each layer only needs its local derivative and the gradient arriving from the layer after it." |
| 1:48-2:03 | Weight update line appears. | "Then every weight takes a small step downhill: old weight minus learning rate times gradient. Repeat this over many examples, and the network reshapes itself." |
| 2:03-2:12 | Outro card. | "Backprop is not magic. It is the chain rule turned into a training algorithm — credit assignment, one layer at a time." |

## Production notes

- Palette: midnight background, cyan forward motion, amber backward gradients, violet hidden representations.
- Keep narration calm and spacious; the animation should reveal one idea at a time.
- Screenshots in `screenshots/` are representative stills for PR review and planning.
