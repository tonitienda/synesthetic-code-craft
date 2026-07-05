import {Layout} from '@motion-canvas/2d';
import {Arrow, Card, LayerStack} from '../videos/containers-image-to-running-process/components';
import {makeContainersScene} from '../videos/containers-image-to-running-process/sceneFactory';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';
export default makeContainersScene({title: 'What run prepares', sub: 'layers + config + run options', panels: [
{hold: 12, element: <Layout layout gap={30} alignItems={'center'}><LayerStack /><Card title={'image config'} body={'default command · env'} color={c.amber} /><Card title={'run options'} body={'ports · mounts · limits'} color={c.violet} /></Layout>},
{hold: 13, element: <Layout layout gap={40} alignItems={'center'}><LayerStack writable={'private writable layer'} /><Arrow /><Card title={'Runtime'} body={'prepares filesystem view'} color={c.amber} /><Arrow /><Card title={'one filesystem view'} body={'layer seams remain faint'} color={c.green} /></Layout>},
]});
