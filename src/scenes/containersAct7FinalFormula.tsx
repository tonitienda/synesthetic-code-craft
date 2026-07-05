import {Layout, Txt} from '@motion-canvas/2d';
import {makeContainersScene} from '../videos/containers-image-to-running-process/sceneFactory';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';
export default makeContainersScene({title: 'Final model', sub: 'An image does not run. A process runs.', panels: [
{hold: 13, element: <Txt text={'container = process + filesystem view + namespaces + cgroups'} fontSize={44} fill={c.text} />},
{hold: 13, element: <Layout layout direction={'column'} gap={28} alignItems={'center'}><Txt text={'Registry → Image = layers + config → Runtime'} fontSize={34} fill={c.cyan} /><Txt text={'→ Container = process + writable layer + namespaces + cgroups'} fontSize={34} fill={c.green} /><Txt text={'The container is the bounded running process.'} fontSize={34} fill={c.amber} /></Layout>},
]});
