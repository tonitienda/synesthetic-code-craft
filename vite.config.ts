import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';
import {PLUGIN_OPTIONS} from '@motion-canvas/vite-plugin/lib/plugins';

const project = process.env.MOTION_CANVAS_PROJECT ?? './src/project.ts';

const agentPreviewPlugin = {
  name: 'synesthetic-code-craft:agent-preview',
  [PLUGIN_OPTIONS]: {
    entryPoint: '/src/tools/agentPreviewPlugin.ts',
  },
};

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.mts', '.jsx', '.json'],
  },
  plugins: [agentPreviewPlugin, motionCanvas({project}), ffmpeg()],
});
