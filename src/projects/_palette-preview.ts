// TEMPORARY — audio-free project for palette-frame capture. Delete after picking.
import { makeProject } from "@motion-canvas/core"

import video from "../videos/containers-to-running-process/scenes/_previewNoAudio?scene"

export default makeProject({
  name: "palette-preview",
  plugins: [],
  scenes: [video],
})
