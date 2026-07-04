import {makeProject} from '@motion-canvas/core';

import introHook from '../scenes/introHook?scene';
import introOutro from '../scenes/introOutro?scene';

export default makeProject({
  name: 'youtube-intro',
  scenes: [introHook, introOutro],
});
