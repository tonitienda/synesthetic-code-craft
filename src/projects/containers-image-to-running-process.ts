import {makeProject} from '@motion-canvas/core';

import act1 from '../scenes/containersAct1CommandDoorway?scene';
import act2Vocabulary from '../scenes/containersAct2VocabularyMap?scene';
import act2Workflow from '../scenes/containersAct2WorkflowVerbs?scene';
import act3 from '../scenes/containersAct3ImageInternals?scene';
import act4Runtime from '../scenes/containersAct4RuntimePreparation?scene';
import act4Startup from '../scenes/containersAct4StartupBoundaries?scene';
import act5Shared from '../scenes/containersAct5SharedLayers?scene';
import act5CopyOnWrite from '../scenes/containersAct5CopyOnWrite?scene';
import act6Host from '../scenes/containersAct6HostBoundaries?scene';
import act6Boundaries from '../scenes/containersAct6NamespacesCgroups?scene';
import act7Workflow from '../scenes/containersAct7WorkflowReturn?scene';
import act7Formula from '../scenes/containersAct7FinalFormula?scene';

export default makeProject({
  name: 'containers-image-to-running-process',
  scenes: [
    act1,
    act2Vocabulary,
    act2Workflow,
    act3,
    act4Runtime,
    act4Startup,
    act5Shared,
    act5CopyOnWrite,
    act6Host,
    act6Boundaries,
    act7Workflow,
    act7Formula,
  ],
});
