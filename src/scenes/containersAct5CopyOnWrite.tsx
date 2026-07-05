import { Layout, Txt } from '@motion-canvas/2d';
import { Card } from '../videos/containers-image-to-running-process/components';
import { makeContainersScene } from '../videos/containers-image-to-running-process/sceneFactory';
import { containerTheme as c } from '../videos/containers-image-to-running-process/theme';
export default makeContainersScene({
  title: 'Copy-on-write mental model',
  sub: '/etc/app.conf',
  panels: [
    {
      hold: 13,
      element: (
        <Layout layout gap={60}>
          <Card
            title={'Container A'}
            body={'read /etc/app.conf'}
            color={c.amber}
          />
          <Card
            title={'shared original'}
            body={'/etc/app.conf'}
            color={c.cyan}
          />
          <Card
            title={'Container B'}
            body={'read /etc/app.conf'}
            color={c.green}
          />
        </Layout>
      ),
    },
    {
      hold: 18,
      element: (
        <Layout layout gap={60}>
          <Card
            title={'Writable A'}
            body={'private changed copy'}
            color={c.amber}
          />
          <Card title={'shared original'} body={'unchanged'} color={c.cyan} />
          <Card
            title={'Writable B'}
            body={'empty; still sees original'}
            color={c.green}
          />
        </Layout>
      ),
    },
    {
      hold: 12,
      element: (
        <Txt
          text={
            'A write records a private copy for one container. The shared image layer remains unchanged.'
          }
          fontSize={34}
          fill={c.text}
          width={1100}
          textAlign={'center'}
        />
      ),
    },
  ],
});
