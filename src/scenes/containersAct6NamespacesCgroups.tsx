import { Layout, Txt } from '@motion-canvas/2d';
import {
  Card,
  ProcessBox,
} from '../videos/containers-image-to-running-process/components';
import { makeContainersScene } from '../videos/containers-image-to-running-process/sceneFactory';
import { containerTheme as c } from '../videos/containers-image-to-running-process/theme';
export default makeContainersScene({
  title: 'Namespaces and cgroups',
  sub: 'view plus budget',
  panels: [
    {
      hold: 14,
      element: (
        <Layout layout gap={50} alignItems={'center'}>
          <Card
            title={'namespaces'}
            body={
              'what the process can see: processes, mounts, network, hostname'
            }
            color={c.violet}
            width={430}
          />
          <ProcessBox />
          <Card
            title={'cgroups'}
            body={'what the process can use: CPU, memory, I/O'}
            color={c.amber}
            width={430}
          />
        </Layout>
      ),
    },
    {
      hold: 12,
      element: (
        <Txt
          text={'Namespaces shape the view. Cgroups shape the budget.'}
          fontSize={38}
          fill={c.text}
        />
      ),
    },
  ],
});
