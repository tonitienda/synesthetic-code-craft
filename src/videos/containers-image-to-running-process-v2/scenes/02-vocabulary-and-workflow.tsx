import {Layout} from '@motion-canvas/2d';
import {Caption, ConceptBox, ImageArtifact, RegistryShelf, WorkflowRail} from '../components';
import {makeContainersV2Scene} from '../sceneFactory';

export default makeContainersV2Scene({
  title: 'four nouns, four roles',
  subtitle: 'image, registry, runtime, container',
  moments: [
    {
      label: 'n004 vocabulary map',
      hold: 3,
      render: () => (
        <Layout layout direction={'column'} gap={34} alignItems={'center'}>
          <Layout layout gap={34} alignItems={'center'}>
            <ConceptBox title={'Image'} body={'packaged starting point'} tone={'image'} />
            <ConceptBox title={'Registry'} body={'stores images'} tone={'registry'} />
          </Layout>
          <Layout layout gap={34} alignItems={'center'}>
            <ConceptBox title={'Runtime'} body={'prepares and starts'} tone={'runtime'} />
            <ConceptBox title={'Container'} body={'running instance'} tone={'container'} />
          </Layout>
        </Layout>
      ),
    },
    {
      label: 'n005 image internals preview',
      hold: 3,
      render: () => (
        <Layout layout direction={'column'} gap={26} alignItems={'center'}>
          <ImageArtifact label={'image'} open />
          <Caption text={'filesystem layers + config / metadata + default command + environment'} />
        </Layout>
      ),
    },
    {
      label: 'n006 registry is storage',
      hold: 3,
      render: () => (
        <Layout layout gap={52} alignItems={'center'}>
          <ImageArtifact label={'image artifact'} />
          <RegistryShelf />
        </Layout>
      ),
    },
    {
      label: 'n007 n008 workflow verbs',
      hold: 4,
      render: () => (
        <Layout layout direction={'column'} gap={32} alignItems={'center'}>
          <WorkflowRail />
          <Caption text={'push and pull move images; run creates the container process'} tone={'strong'} />
        </Layout>
      ),
    },
  ],
});
