import { Layout, Txt } from '@motion-canvas/2d';
import {
  ContainerInstance,
  KernelLayer,
} from '../videos/containers-image-to-running-process/components';
import { makeContainersScene } from '../videos/containers-image-to-running-process/sceneFactory';
import { containerTheme as c } from '../videos/containers-image-to-running-process/theme';
export default makeContainersScene({
  title: 'Host sees a process with boundaries',
  sub: 'not a tiny machine booting from scratch',
  panels: [
    {
      hold: 14,
      element: (
        <Layout layout direction={'column'} gap={34} alignItems={'center'}>
          <ContainerInstance label={'process / process group'} />
          <KernelLayer />
        </Layout>
      ),
    },
    {
      hold: 13,
      element: (
        <Txt
          text={'container = process with prepared boundaries'}
          fontSize={42}
          fill={c.cyan}
        />
      ),
    },
  ],
});
