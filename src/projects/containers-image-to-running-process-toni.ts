import {makeProject} from '@motion-canvas/core';

import segmentedNarrationPlugin from '../videos/containers-toni/segmentedNarrationPlugin';
import Act01TheFamiliarCommand from '../videos/containers-toni/scenes/Act-01-the-familiar-command?scene';

export default makeProject({
  name: 'containers-image-to-running-process-toni',
  plugins: [segmentedNarrationPlugin()],
  scenes: [Act01TheFamiliarCommand],
});
