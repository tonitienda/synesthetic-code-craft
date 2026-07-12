import { makeProject } from "@motion-canvas/core"

import splashAssembly from "../videos/brand/scenes/splash-assembly?scene"
import splashSongbird from "../videos/brand/scenes/splash-songbird?scene"

export default makeProject({
  name: "brand-splash",
  scenes: [splashAssembly, splashSongbird],
})
