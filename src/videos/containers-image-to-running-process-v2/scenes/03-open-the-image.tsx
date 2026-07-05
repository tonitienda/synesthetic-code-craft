import {Layout, Txt} from '@motion-canvas/2d';
import {Caption, ConceptBox, ImageArtifact, LayerStack} from '../components';
import {makeContainersV2Scene} from '../sceneFactory';
import {c} from '../theme';

export default makeContainersV2Scene({
  title: 'open the image',
  subtitle: 'layers plus configuration',
  moments: [
    {
      label: 'n009 sealed artifact',
      hold: 2.6,
      element: (
        <Layout layout direction={'column'} gap={28} alignItems={'center'}>
          <ImageArtifact label={'IMAGE'} />
          <Caption text={'not one mysterious blob'} tone={'warning'} />
        </Layout>
      ),
    },
    {
      label: 'n009 layers plus config',
      hold: 3,
      element: (
        <Layout layout gap={54} alignItems={'center'}>
          <LayerStack />
          <ConceptBox title={'config'} body={'default command\nenvironment\nworking directory'} tone={'runtime'} width={320} height={220} />
        </Layout>
      ),
    },
    {
      label: 'n010 ordered filesystem changes',
      hold: 3.5,
      element: (
        <Layout layout direction={'column'} gap={24} alignItems={'center'}>
          <Txt text={'ordered filesystem changes'} fontSize={38} fontWeight={800} fill={c.text} />
          <LayerStack />
        </Layout>
      ),
    },
    {
      label: 'n011 read-only reusable foundation',
      hold: 3.5,
      element: (
        <Layout layout direction={'column'} gap={28} alignItems={'center'}>
          <LayerStack shared />
          <Caption text={'read-only, reusable, shared by multiple containers'} tone={'ok'} />
        </Layout>
      ),
    },
  ],
});
