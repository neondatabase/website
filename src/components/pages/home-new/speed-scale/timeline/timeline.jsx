import Image from 'next/image';

import Container from 'components/shared/container';
import timeline from 'images/pages/home-new/speed-scale/timeline.jpg';

import Heading from '../heading';

const Timeline = () => (
  <div className="mt-60 flex flex-col items-center gap-14 xl:mt-[184px] lg:mt-36 md:mt-[104px] md:gap-[52px]">
    <Container size="832" className="flex justify-center">
      <Heading className="text-balance text-center xl:max-w-[640px] lg:max-w-xl lg:text-pretty md:text-left">
        <strong>Build checkpoints & versioning.</strong> Neon branching makes&nbsp;it
        straightforward to iterate between app versions, or to restore to a previous state in case
        something goes wrong.
      </Heading>
    </Container>
    <Image
      className="max-w-none xl:h-[356px] xl:w-auto lg:h-[280px] sm:h-[132px]"
      src={timeline}
      width={1920}
      height={500}
      alt="Timeline"
    />
  </div>
);

export default Timeline;
