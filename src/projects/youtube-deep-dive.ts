import {makeProject} from '@motion-canvas/core';

import deepDiveHook from '../scenes/deepDiveHook?scene';
import deepDiveSummary from '../scenes/deepDiveSummary?scene';

export default makeProject({
  name: 'youtube-deep-dive',
  scenes: [deepDiveHook, deepDiveSummary],
});
