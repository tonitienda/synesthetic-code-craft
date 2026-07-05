import {Layout, Txt} from '@motion-canvas/2d';
import {Card, Pipeline} from '../videos/containers-image-to-running-process/components';
import {makeContainersScene} from '../videos/containers-image-to-running-process/sceneFactory';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';

export default makeContainersScene({
  title: 'Workflow verbs',
  sub: 'run is the only verb that creates a container',
  panels: [
    {hold: 12, element: <Pipeline items={['build', 'image', 'push', 'registry', 'pull', 'local image', 'run', 'container']} highlight={'run'} />},
    {hold: 12, element: <Layout layout gap={34} alignItems={'center'}><Card title={'push / pull'} body={'move images'} color={c.violet} /><Card title={'run'} body={'creates a container'} color={c.green} /><Card title={'Docker doorway'} body={'broader OCI-style model'} color={c.cyan} /></Layout>},
    {hold: 8, element: <Txt text={'Push and pull move images. Run creates containers.'} fontSize={40} fill={c.amber} />},
  ],
});
