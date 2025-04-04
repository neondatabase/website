import Image from 'next/image';

import Container from 'components/shared/container/container';
import percentIcon from 'icons/report/percent-icon.svg';

const RecoveryTime = () => (
  <section className="recovery-time safe-paddings mt-[120px]">
    <Container
      className="relative z-10 flex !max-w-[576px] flex-col items-center text-center"
      size="xxs"
    >
      <Image className="ml-2" src={percentIcon} width={330} height={178} alt="68%" />
      <h2 className="mx-auto -mt-10 max-w-[465px] font-title text-[36px] font-medium leading-dense tracking-tighter">
        of teams requested faster point-in-time recovery solutions
      </h2>
      <p className="mx-auto mt-2 max-w-[356px] text-sm leading-snug tracking-tight text-gray-new-60">
        Faster restores are essential for increasing team confidence and reducing customer impact.
      </p>
    </Container>
  </section>
);

export default RecoveryTime;
