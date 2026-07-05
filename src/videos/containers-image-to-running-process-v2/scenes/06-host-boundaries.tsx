import {Layout} from '@motion-canvas/2d';
import {BoundaryFrame, Caption, ContainerInstance, KernelLayer, NamespaceSplitView, ProcessPulse, ResourceBudgetRing} from '../components';
import {makeContainersV2Scene} from '../sceneFactory';

export default makeContainersV2Scene({
  title: 'the host sees a process',
  subtitle: 'real process, prepared boundaries',
  moments: [
    {
      label: 'n023 host process',
      hold: 3,
      element: (
        <Layout layout direction={'column'} gap={34} alignItems={'center'}>
          <ContainerInstance label={'container'} />
          <KernelLayer />
        </Layout>
      ),
    },
    {
      label: 'n024 process with boundaries',
      hold: 3,
      element: (
        <Layout layout gap={80} alignItems={'center'}>
          <BoundaryFrame label={'process'} tone={'container'}>
            <ProcessPulse label={'real process'} />
          </BoundaryFrame>
          <BoundaryFrame label={'prepared boundaries'} tone={'namespace'}>
            <Caption text={'filesystem view + namespace views + cgroup budget'} />
          </BoundaryFrame>
        </Layout>
      ),
    },
    {
      label: 'n025 namespaces shape view',
      hold: 3.8,
      element: (
        <Layout layout direction={'column'} gap={26} alignItems={'center'}>
          <NamespaceSplitView />
          <Caption text={'namespaces shape what the process can see'} tone={'strong'} />
        </Layout>
      ),
    },
    {
      label: 'n026 cgroups shape budget',
      hold: 3.5,
      element: (
        <Layout layout direction={'column'} gap={26} alignItems={'center'}>
          <ResourceBudgetRing />
          <Caption text={'cgroups shape what the process can use'} tone={'warning'} />
        </Layout>
      ),
    },
    {
      label: 'n027 view plus budget',
      hold: 3.2,
      element: (
        <Layout layout direction={'column'} gap={24} alignItems={'center'}>
          <BoundaryFrame label={'view: namespaces'} tone={'namespace'}>
            <BoundaryFrame label={'budget: cgroups'} tone={'cgroup'}>
              <ProcessPulse />
            </BoundaryFrame>
          </BoundaryFrame>
          <Caption text={'Namespaces shape the view. Cgroups shape the budget.'} tone={'ok'} />
        </Layout>
      ),
    },
  ],
});
