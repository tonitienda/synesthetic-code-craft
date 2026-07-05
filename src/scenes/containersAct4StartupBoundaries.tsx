import {Layout} from '@motion-canvas/2d';
import {Arrow, Card, ContainerInstance} from '../videos/containers-image-to-running-process/components';
import {makeContainersScene} from '../videos/containers-image-to-running-process/sceneFactory';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';
export default makeContainersScene({title: 'Startup boundaries', sub: 'configuration becomes a bounded process', panels: [
{hold: 13, element: <Layout layout gap={40} alignItems={'center'}><Layout layout direction={'column'} gap={16}><Card title={'command'} height={110} /><Card title={'environment'} height={110} /><Card title={'working dir / user'} height={110} /></Layout><Arrow /><ContainerInstance label={'container instance'} /></Layout>},
{hold: 13, element: <Layout layout gap={34} alignItems={'center'}><Card title={'filesystem view'} /><Card title={'namespaces'} color={c.violet} /><Card title={'cgroups'} color={c.amber} /><Card title={'process starts'} color={c.green} /></Layout>},
]});
