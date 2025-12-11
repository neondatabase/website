import clsx from 'clsx';

import Container from 'components/shared/container';
import RiveAnimation from 'components/shared/rive-animation';

import Heading from '../heading';

const Checkpoints = () => (
  <div className="mt-60 flex flex-col gap-14 xl:mt-[184px] lg:mt-36 md:mt-[104px] md:gap-[52px]">
    <Container size="832" className="flex justify-center">
      <Heading className="text-balance text-center xl:max-w-[640px] lg:max-w-xl lg:text-pretty md:text-left">
        <strong>Build checkpoints & versioning.</strong> Neon branching makes&nbsp;it
        straightforward to iterate between app versions, or to restore to a previous state in case
        something goes wrong.
      </Heading>
    </Container>
    <div className="border-b border-t border-gray-new-20">
      <RiveAnimation
        className={clsx(
          'pointer-events-none relative mx-auto aspect-[1920/500] w-full max-w-[1920px]',
          'lg:left-1/2 lg:w-[140vw] lg:-translate-x-1/2 md:w-[204vw]',
          '[&_canvas]:!h-full [&_canvas]:!w-full'
        )}
        wrapperClassName="relative"
        src="/animations/pages/home-new/checkpoints.riv?20251210"
      />
    </div>
  </div>
);

export default Checkpoints;
