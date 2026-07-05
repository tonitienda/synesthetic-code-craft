import {Layout} from '@motion-canvas/2d';
import {Arrow, BoundaryFrame, Caption, ConceptBox, ContainerInstance, LayerStack, ProcessPulse} from '../components';
import {makeContainersV2Scene} from '../sceneFactory';
import {c} from '../theme';

export default makeContainersV2Scene({
  title: 'what run prepares',
  subtitle: 'environment first, process second',
  moments: [
    {
      label: 'n012 runtime inputs',
      hold: 3,
      element: (
        <Layout layout gap={28} alignItems={'center'}>
          <Layout layout direction={'column'} gap={16} alignItems={'center'}>
            <ConceptBox title={'image layers'} tone={'image'} width={260} height={105} />
            <ConceptBox title={'image config'} tone={'runtime'} width={260} height={105} />
            <ConceptBox title={'run options'} tone={'runtime'} width={260} height={105} />
          </Layout>
          <Arrow width={120} color={c.amber} label={'prepare'} />
          <ConceptBox title={'runtime setup'} body={'prepares an environment'} tone={'runtime'} width={360} height={230} />
        </Layout>
      ),
    },
    {
      label: 'n013 filesystem view',
      hold: 3,
      element: (
        <Layout layout direction={'column'} gap={28} alignItems={'center'}>
          <LayerStack writable={'private writable layer'} shared />
          <Caption text={'one filesystem view: private top, shared read-only foundation'} tone={'strong'} />
        </Layout>
      ),
    },
    {
      label: 'n015 startup configuration',
      hold: 3,
      element: (
        <Layout layout gap={34} alignItems={'center'}>
          <Layout layout direction={'column'} gap={15} alignItems={'center'}>
            <ConceptBox title={'command'} tone={'runtime'} width={230} height={90} />
            <ConceptBox title={'environment'} tone={'runtime'} width={230} height={90} />
            <ConceptBox title={'working dir'} tone={'runtime'} width={230} height={90} />
            <ConceptBox title={'user'} tone={'runtime'} width={230} height={90} />
          </Layout>
          <Arrow width={120} color={c.green} label={'start'} />
          <ProcessPulse label={'waiting'} />
        </Layout>
      ),
    },
    {
      label: 'n016 boundaries make the container',
      hold: 3.8,
      element: (
        <Layout layout gap={32} alignItems={'center'}>
          <BoundaryFrame label={'filesystem view'} tone={'filesystem'}>
            <BoundaryFrame label={'namespace views'} tone={'namespace'}>
              <BoundaryFrame label={'cgroup budget'} tone={'cgroup'}>
                <ProcessPulse />
              </BoundaryFrame>
            </BoundaryFrame>
          </BoundaryFrame>
          <Caption text={'the process starts inside prepared boundaries'} tone={'ok'} />
        </Layout>
      ),
    },
    {
      label: 'container instance',
      hold: 2.6,
      element: <ContainerInstance label={'container instance'} />,
    },
  ],
});
