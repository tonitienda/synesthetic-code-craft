import {Layout, Txt} from '@motion-canvas/2d';
import {Card, ImageBox, LayerStack} from '../videos/containers-image-to-running-process/components';
import {makeContainersScene} from '../videos/containers-image-to-running-process/sceneFactory';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';

export default makeContainersScene({title: 'Open the image', sub: 'image = layers + config, not a mysterious blob', panels: [
{hold: 11, element: <Layout layout gap={80} alignItems={'center'}><ImageBox /><Txt text={'='} fontSize={64} fill={c.muted} /><LayerStack /><Txt text={'+'} fontSize={64} fill={c.muted} /><Card title={'config'} body={'command · environment'} color={c.amber} /></Layout>},
{hold: 16, element: <LayerStack labels={['base filesystem', 'packages', 'runtime dependencies', 'application files']} />},
{hold: 12, element: <Layout layout direction={'column'} gap={24} alignItems={'center'}><Card title={'one filesystem view'} body={'layers restack into a readable tree'} color={c.green} width={520} /><Txt text={'read-only layers can be shared by future containers'} fontSize={30} fill={c.muted} /></Layout>},
]});
