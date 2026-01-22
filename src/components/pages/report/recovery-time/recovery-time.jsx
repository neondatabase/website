import Image from 'next/image';

import Container from 'components/shared/container/container';
import percentIcon from 'icons/report/percent-icon.svg';

const RecoveryTime = () => (
  <section className="recovery-time safe-paddings mt-20">
    <Container
      className="relative z-10 flex !max-w-xl flex-col items-center text-center lg:!max-w-[642px]"
      size="xxs"
    >
      <Image
        className="ml-2 xl:max-w-[295px] sm:max-w-[260px]"
        src={percentIcon}
        width={330}
        height={178}
        alt=""
      />
      <h2 className="mx-auto -mt-10 max-w-[465px] font-title text-[36px] font-medium leading-dense tracking-tighter lg:-mt-10 lg:max-w-[405px] lg:text-[32px] sm:-mt-[30px] sm:text-[28px]">
        <span className="sr-only">68%</span> of teams requested faster point-in-time recovery
        solutions
      </h2>
      <p className="mx-auto mt-2 max-w-[356px] text-sm leading-snug tracking-tight text-gray-new-60">
        Faster restores are essential for increasing team confidence and reducing customer impact.
      </p>
    </Container>
  </section>
);

export default RecoveryTime;
