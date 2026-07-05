import {Layout} from '@motion-canvas/2d';
import {Card, ImageBox, RegistryBox} from '../videos/containers-image-to-running-process/components';
import {makeContainersScene} from '../videos/containers-image-to-running-process/sceneFactory';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';

export default makeContainersScene({
  title: 'Four nouns, four roles',
  sub: 'Image · Registry · Runtime · Container',
  panels: [
    {hold: 11, element: <Layout layout gap={28}><Card title={'Image'} body={'packaged starting point'} /><Card title={'Registry'} body={'stores images'} color={c.violet} /><Card title={'Runtime'} body={'prepares and starts'} color={c.amber} /><Card title={'Container'} body={'running instance'} color={c.green} /></Layout>},
    {hold: 11, element: <Layout layout gap={70} alignItems={'center'}><ImageBox label={'image'} /><Card title={'filesystem layers'} body={'base · packages · runtime deps · app files'} /><Card title={'config / metadata'} body={'default command · environment'} color={c.amber} /></Layout>},
    {hold: 10, element: <Layout layout gap={80} alignItems={'center'}><ImageBox label={'image artifact'} /><RegistryBox /><Card title={'no process pulse'} body={'a registry stores and distributes; it does not run containers'} color={c.violet} width={420} /></Layout>},
  ],
});
