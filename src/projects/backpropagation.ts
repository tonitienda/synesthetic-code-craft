import {makeProject} from '@motion-canvas/core';

import title from '../videos/backpropagation/scenes/scene-01-title?scene';
import singleNeuron from '../videos/backpropagation/scenes/scene-02-single-neuron?scene';
import rosenblatt from '../videos/backpropagation/scenes/scene-03-rosenblatt?scene';
import inputs from '../videos/backpropagation/scenes/scene-04-inputs?scene';
import weights from '../videos/backpropagation/scenes/scene-05-weights?scene';
import weightedSum from '../videos/backpropagation/scenes/scene-06-weighted-sum?scene';
import activation from '../videos/backpropagation/scenes/scene-07-activation?scene';
import learning from '../videos/backpropagation/scenes/scene-08-learning?scene';
import geometry from '../videos/backpropagation/scenes/scene-09-geometry?scene';
import decisionBoundary from '../videos/backpropagation/scenes/scene-10-decision-boundary?scene';
import limitation from '../videos/backpropagation/scenes/scene-11-limitation?scene';

// Act I — The First Artificial Neuron.
// Implemented from content/videos/backpropagation/04-timeline.md (source of truth).
export default makeProject({
  name: 'backpropagation',
  scenes: [
    title,
    singleNeuron,
    rosenblatt,
    inputs,
    weights,
    weightedSum,
    activation,
    learning,
    geometry,
    decisionBoundary,
    limitation,
  ],
});
