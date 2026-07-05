import { Txt } from '@motion-canvas/2d';
import { Pipeline } from '../videos/containers-image-to-running-process/components';
import { makeContainersScene } from '../videos/containers-image-to-running-process/sceneFactory';
import { containerTheme as c } from '../videos/containers-image-to-running-process/theme';
export default makeContainersScene({
  title: 'Workflow returns',
  sub: 'sharper labels from earlier acts',
  panels: [
    {
      hold: 13,
      element: (
        <Pipeline
          items={[
            'build',
            'image',
            'push',
            'registry',
            'pull',
            'local image',
            'run',
            'container',
          ]}
          highlight={'run'}
        />
      ),
    },
    {
      hold: 11,
      element: (
        <Txt
          text={
            'image = layers + config · run = runtime setup · container = bounded process'
          }
          fontSize={34}
          fill={c.muted}
        />
      ),
    },
  ],
});
