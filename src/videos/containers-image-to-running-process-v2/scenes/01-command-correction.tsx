import {Layout, Txt} from '@motion-canvas/2d';
import {
  Arrow,
  Caption,
  CommandCallout,
  ContainerInstance,
  ImageArtifact,
  ProcessPulse,
} from '../components';
import {makeContainersV2Scene} from '../sceneFactory';
import {c} from '../theme';

export default makeContainersV2Scene({
  title: 'docker run nginx',
  subtitle: 'the familiar command, corrected',
  moments: [
    {
      label: 'n001 — familiar doorway',
      hold: 2.4,
      render: () => (
        <Layout layout direction={'column'} gap={30} alignItems={'center'}>
          <CommandCallout />
          <Caption text={'A familiar command hides a precise chain of events.'} />
        </Layout>
      ),
    },
    {
      label: 'n002 — what runs?',
      hold: 2.5,
      render: () => (
        <Layout layout direction={'column'} gap={28} alignItems={'center'}>
          <CommandCallout />
          <Txt text={'what actually runs?'} fontSize={44} fontWeight={800} fill={c.amber} />
        </Layout>
      ),
    },
    {
      label: 'n003 — image is inert, process is alive',
      hold: 3.2,
      render: () => (
        <Layout layout gap={64} alignItems={'center'}>
          <ImageArtifact label={'nginx image'} />
          <Txt text={'≠'} fontSize={80} fill={c.amber} />
          <ProcessPulse label={'running'} />
        </Layout>
      ),
    },
    {
      label: 'thesis chain',
      hold: 3.4,
      render: () => (
        <Layout layout direction={'column'} gap={30} alignItems={'center'}>
          <Caption text={'An image does not run. A process runs.'} tone={'warning'} />
          <Layout layout gap={30} alignItems={'center'}>
            <ImageArtifact />
            <Arrow label={'runtime setup'} color={c.amber} />
            <ContainerInstance label={'container process'} />
          </Layout>
        </Layout>
      ),
    },
  ],
});
