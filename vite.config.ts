import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

const project = process.env.MOTION_CANVAS_PROJECT ?? './src/project.ts';

export default defineConfig({
  plugins: [motionCanvas({project}), ffmpeg()],
});
