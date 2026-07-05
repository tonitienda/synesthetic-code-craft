import {makeProject} from '@motion-canvas/core';

import commandCorrection from '../videos/containers-image-to-running-process-v2/scenes/01-command-correction?scene';
import vocabularyAndWorkflow from '../videos/containers-image-to-running-process-v2/scenes/02-vocabulary-and-workflow?scene';
import openTheImage from '../videos/containers-image-to-running-process-v2/scenes/03-open-the-image?scene';
import runtimePreparation from '../videos/containers-image-to-running-process-v2/scenes/04-runtime-preparation?scene';
import twoContainersCopyOnWrite from '../videos/containers-image-to-running-process-v2/scenes/05-two-containers-copy-on-write?scene';
import hostBoundaries from '../videos/containers-image-to-running-process-v2/scenes/06-host-boundaries?scene';
import finalModel from '../videos/containers-image-to-running-process-v2/scenes/07-final-model?scene';

export default makeProject({
  name: 'containers-image-to-running-process-v2',
  scenes: [
    commandCorrection,
    vocabularyAndWorkflow,
    openTheImage,
    runtimePreparation,
    twoContainersCopyOnWrite,
    hostBoundaries,
    finalModel,
  ],
});
