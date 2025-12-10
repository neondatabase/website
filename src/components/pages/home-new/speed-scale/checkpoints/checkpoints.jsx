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
          'pointer-events-none relative mx-auto aspect-[1920/500] w-full max-w-[1920px] 3xl:left-1/2 3xl:-translate-x-1/2',
          'xl:aspect-[1024/356] xl:h-auto xl:w-full lg:aspect-[768/280] md:aspect-[320/170] sm:w-[640px]',
          '[&_canvas]:!h-full [&_canvas]:!w-full'
        )}
        wrapperClassName="relative"
        src="/animations/pages/home-new/checkpoints.riv"
        artboard="main"
        stateMachines="SM"
        threshold={0.4}
      />
    </div>
  </div>
);

export default Checkpoints;
