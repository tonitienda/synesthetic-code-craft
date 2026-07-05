import {makeProject} from '@motion-canvas/core';

import aliveStory from '../scenes/containersAliveTimelinePaced.tsx?scene';

export default makeProject({
  name: 'containers-image-to-running-process-alive',
  scenes: [aliveStory],
});
