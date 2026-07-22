import {makeProject} from '@motion-canvas/core';

import glass from '../videos/showcase-experiments/scenes/01-glass?scene';
import bubble from '../videos/showcase-experiments/scenes/02-bubble?scene';
import marble from '../videos/showcase-experiments/scenes/03-marble?scene';
import wood from '../videos/showcase-experiments/scenes/04-wood?scene';
import metal from '../videos/showcase-experiments/scenes/05-metal?scene';
import paper from '../videos/showcase-experiments/scenes/06-paper?scene';
import frosted from '../videos/showcase-experiments/scenes/07-frosted?scene';
import acrylic from '../videos/showcase-experiments/scenes/08-acrylic?scene';
import gel from '../videos/showcase-experiments/scenes/09-gel?scene';
import eink from '../videos/showcase-experiments/scenes/10-eink?scene';
import copper from '../videos/showcase-experiments/scenes/11-copper?scene';
import concrete from '../videos/showcase-experiments/scenes/12-concrete?scene';
import glassGel from '../videos/showcase-experiments/scenes/13-glass-gel?scene';
import marbleGlass from '../videos/showcase-experiments/scenes/14-marble-glass?scene';
import acrylicCopper from '../videos/showcase-experiments/scenes/15-acrylic-copper?scene';
import materialSystem from '../videos/showcase-experiments/scenes/16-material-system?scene';
import neuralGraph from '../videos/showcase-experiments/scenes/17-neural-graph?scene';
import tokenCache from '../videos/showcase-experiments/scenes/18-token-cache?scene';
import rocketPropulsion from '../videos/showcase-experiments/scenes/19-rocket-propulsion?scene';
import waterNetwork from '../videos/showcase-experiments/scenes/20-water-network?scene';
import physicsPlayground from '../videos/showcase-experiments/scenes/21-physics-playground?scene';
import matterPhysics from '../videos/showcase-experiments/scenes/22-matter-physics?scene';
import matterMaterialStack from '../videos/showcase-experiments/scenes/23-matter-material-stack?scene';
import rocketDimension from '../videos/showcase-experiments/scenes/24-rocket-dimension?scene';

export default makeProject({
  name: 'showcase-experiments',
  scenes: [
    glass,
    bubble,
    marble,
    wood,
    metal,
    paper,
    frosted,
    acrylic,
    gel,
    eink,
    copper,
    concrete,
    glassGel,
    marbleGlass,
    acrylicCopper,
    materialSystem,
    neuralGraph,
    tokenCache,
    rocketPropulsion,
    waterNetwork,
    physicsPlayground,
    matterPhysics,
    matterMaterialStack,
    rocketDimension,
  ],
});
