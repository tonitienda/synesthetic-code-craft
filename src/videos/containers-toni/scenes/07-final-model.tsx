import {Layout} from '@motion-canvas/2d';
import {Caption, CommandCallout, Formula, SecondaryLoop, WorkflowRail} from '../components';
import {makeContainersV2Scene} from '../sceneFactory';

export default makeContainersV2Scene({
  title: 'reassemble the model',
  subtitle: 'the same command with sharper words',
  moments: [
    {
      label: 'n028 corrected workflow',
      hold: 3.8,
      render: () => (
        <Layout layout direction={'column'} gap={30} alignItems={'center'}>
          <WorkflowRail compact />
          <Caption text={'build produces, push stores, pull retrieves, run creates a container process'} tone={'strong'} />
        </Layout>
      ),
    },
    {
      label: 'n029 final formula',
      hold: 4,
      render: () => <Formula />,
    },
    {
      label: 'n030 optional commit loop',
      hold: 3,
      render: () => (
        <Layout layout direction={'column'} gap={34} alignItems={'center'}>
          <SecondaryLoop />
          <Caption text={'useful sometimes, but not the main model; usually rebuild from source plus Dockerfile'} />
        </Layout>
      ),
    },
    {
      label: 'n031 final memory',
      hold: 4.2,
      render: () => (
        <Layout layout direction={'column'} gap={34} alignItems={'center'}>
          <WorkflowRail compact />
          <CommandCallout />
          <Caption text={'The image is the packaged source. The runtime prepares the environment. The container is the bounded running process.'} tone={'ok'} />
          <Caption text={'An image does not run. A process runs.'} tone={'warning'} />
        </Layout>
      ),
    },
  ],
});
