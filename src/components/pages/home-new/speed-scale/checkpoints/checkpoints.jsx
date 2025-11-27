import Container from 'components/shared/container';

import Heading from '../heading';

import Animation from './animation';

const Checkpoints = () => (
  <div className="mt-60 flex flex-col gap-14 xl:mt-[184px] lg:mt-36 md:mt-[104px] md:gap-[52px]">
    <Container size="832" className="flex justify-center">
      <Heading className="text-balance text-center xl:max-w-[640px] lg:max-w-xl lg:text-pretty md:text-left">
        <strong>Build checkpoints & versioning.</strong> Neon branching makes&nbsp;it
        straightforward to iterate between app versions, or to restore to a previous state in case
        something goes wrong.
      </Heading>
    </Container>
    <Animation />
  </div>
);

export default Checkpoints;
