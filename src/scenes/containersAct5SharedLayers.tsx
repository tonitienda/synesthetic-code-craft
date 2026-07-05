import {Layout, Txt} from '@motion-canvas/2d';
import {ContainerInstance, LayerStack} from '../videos/containers-image-to-running-process/components';
import {makeContainersScene} from '../videos/containers-image-to-running-process/sceneFactory';
import {containerTheme as c} from '../videos/containers-image-to-running-process/theme';
export default makeContainersScene({title: 'Same image, two containers', sub: 'shared lower layers, private top layers', panels: [
{hold: 15, element: <Layout layout direction={'column'} gap={28} alignItems={'center'}><Layout layout gap={180}><ContainerInstance label={'Container A'} /><ContainerInstance label={'Container B'} /></Layout><LayerStack /></Layout>},
{hold: 16, element: <Layout layout gap={70} alignItems={'center'}><LayerStack writable={'Writable A'} /><LayerStack /><LayerStack writable={'Writable B'} /></Layout>},
{hold: 10, element: <Txt text={'Both containers read the same lower layers; neither changes the image.'} fontSize={36} fill={c.muted} />},
]});
