import {makeProject} from '@motion-canvas/core';

import backpropPerceptron from '../scenes/backpropPerceptron?scene';
import backpropDepth from '../scenes/backpropDepth?scene';
import backpropMechanics from '../scenes/backpropMechanics?scene';
import backpropOutro from '../scenes/backpropOutro?scene';

export default makeProject({
  name: 'backpropagation-basics',
  scenes: [backpropPerceptron, backpropDepth, backpropMechanics, backpropOutro],
});
