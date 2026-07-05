import { Layout, Rect, Txt } from '@motion-canvas/2d';
import {
  ImageBox,
  Pipeline,
  ProcessBox,
} from '../videos/containers-image-to-running-process/components';
import { makeContainersScene } from '../videos/containers-image-to-running-process/sceneFactory';
import { containerTheme as c } from '../videos/containers-image-to-running-process/theme';

export default makeContainersScene({
  title: 'docker run nginx',
  sub: 'the familiar command, corrected',
  panels: [
    {
      hold: 9,
      element: (
        <Rect
          width={760}
          height={150}
          radius={26}
          fill={c.panel}
          stroke={c.stroke}
          lineWidth={4}
        >
          <Txt
            text={'docker run nginx'}
            fontFamily={'monospace'}
            fontSize={62}
            fill={c.text}
          />
        </Rect>
      ),
    },
    {
      hold: 10,
      element: (
        <Layout layout direction={'column'} gap={20} alignItems={'center'}>
          <Txt
            text={'docker  run  nginx'}
            fontFamily={'monospace'}
            fontSize={62}
            fill={c.text}
          />
          <Txt text={'what runs?'} fontSize={42} fill={c.amber} />
        </Layout>
      ),
    },
    {
      hold: 13,
      element: (
        <Layout layout gap={70} alignItems={'center'}>
          <ImageBox label={'nginx image'} />
          <Txt text={'≠'} fontSize={82} fill={c.amber} />
          <ProcessBox label={'process'} />
        </Layout>
      ),
    },
    {
      hold: 12,
      element: (
        <Layout layout direction={'column'} gap={28} alignItems={'center'}>
          <Txt
            text={'An image does not run. A process runs.'}
            fontSize={38}
            fill={c.amber}
          />
          <Pipeline
            items={['image', 'runtime', 'container process']}
            highlight={'runtime'}
          />
        </Layout>
      ),
    },
  ],
});
