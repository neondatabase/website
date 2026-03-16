import clsx from 'clsx';

import Container from 'components/shared/container';
import RiveAnimation from 'components/shared/rive-animation';

import Heading from '../heading';

const Checkpoints = () => (
  <div className="mt-60 flex flex-col gap-14 md:mt-[104px] md:gap-[52px] lg:mt-36 xl:mt-[184px]">
    <Container size="832" className="flex justify-center">
      <Heading className="text-center text-balance md:text-left lg:max-w-xl lg:text-pretty xl:max-w-[640px]">
        <strong>Database checkpoints. </strong> Copy-on-write storage makes it cheap and fast to
        save point-in-time versions of your database and restore a previous state when necessary.
      </Heading>
    </Container>
    <div className="border-t border-b border-gray-new-20">
      <RiveAnimation
        className={clsx(
          'pointer-events-none relative mx-auto aspect-[1920/500] w-full max-w-[1920px]',
          'md:w-[204vw] lg:left-1/2 lg:w-[140vw] lg:-translate-x-1/2',
          '[&_canvas]:h-full! [&_canvas]:w-full!'
        )}
        wrapperClassName="relative"
        src="/animations/pages/home/checkpoints.riv?20260114"
        autoBind={false}
      />
    </div>
  </div>
);

export default Checkpoints;
