import {Layout, Txt} from '@motion-canvas/2d';
import {Caption, ContainerPair, FileToken, LayerStack, ReadTrace, WritableLayer} from '../components';
import {makeContainersV2Scene} from '../sceneFactory';
import {c} from '../theme';

export default makeContainersV2Scene({
  title: 'same image, two containers',
  subtitle: 'shared foundation, private changes',
  moments: [
    {
      label: 'n017 shared image layers',
      hold: 3.3,
      render: () => (
        <Layout layout direction={'column'} gap={26} alignItems={'center'}>
          <ContainerPair />
          <Caption text={'one shared read-only foundation, two running containers'} tone={'ok'} />
        </Layout>
      ),
    },
    {
      label: 'n018 private writable layers',
      hold: 3,
      render: () => (
        <Layout layout gap={120} alignItems={'center'}>
          <Layout layout direction={'column'} gap={16} alignItems={'center'}>
            <WritableLayer label={'Writable A'} />
            <Txt text={'runtime changes are private'} fontSize={24} fill={c.amber} />
          </Layout>
          <Layout layout direction={'column'} gap={16} alignItems={'center'}>
            <WritableLayer label={'Writable B'} />
            <Txt text={'separate private top'} fontSize={24} fill={c.amber} />
          </Layout>
        </Layout>
      ),
    },
    {
      label: 'n020 read shared original',
      hold: 3.2,
      render: () => (
        <Layout layout direction={'column'} gap={28} alignItems={'center'}>
          <Layout layout gap={36} alignItems={'center'}>
            <Txt text={'Container A'} fontSize={30} fill={c.text} />
            <ReadTrace label={'read'} />
            <FileToken />
            <ReadTrace label={'read'} />
            <Txt text={'Container B'} fontSize={30} fill={c.text} />
          </Layout>
          <LayerStack shared compact />
          <Caption text={'both containers read the same shared original'} />
        </Layout>
      ),
    },
    {
      label: 'n021 write records private change',
      hold: 3.6,
      render: () => (
        <Layout layout direction={'column'} gap={30} alignItems={'center'}>
          <Layout layout gap={40} alignItems={'center'}>
            <Txt text={'Container A writes'} fontSize={31} fill={c.amber} fontWeight={800} />
            <ReadTrace label={'write'} />
            <FileToken variant={'modified'} />
          </Layout>
          <Caption text={'the shared original stays locked; the changed file rises into Writable A'} tone={'warning'} />
        </Layout>
      ),
    },
    {
      label: 'n022 independent views',
      hold: 4,
      render: () => (
        <Layout layout direction={'column'} gap={28} alignItems={'center'}>
          <Layout layout gap={72} alignItems={'center'}>
            <Layout layout direction={'column'} gap={14} alignItems={'center'}>
              <WritableLayer label={'Writable A'} />
              <FileToken variant={'modified'} />
              <Txt text={'A sees: modified'} fontSize={25} fill={c.amber} />
            </Layout>
            <Layout layout direction={'column'} gap={14} alignItems={'center'}>
              <WritableLayer label={'Writable B'} />
              <FileToken />
              <Txt text={'B sees: original'} fontSize={25} fill={c.cyan} />
            </Layout>
          </Layout>
          <Caption text={'copy-on-write: independent writable layers explain independent containers'} tone={'strong'} />
        </Layout>
      ),
    },
  ],
});
