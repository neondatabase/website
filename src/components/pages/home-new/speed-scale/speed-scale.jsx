import clsx from 'clsx';

import Container from 'components/shared/container';

import Checkpoints from './checkpoints';
import Features from './features';
import Header from './header';
import StatusLine from './status-line';

const SpeedScale = () => (
  <section
    className={clsx(
      'speed-scale safe-paddings relative overflow-hidden border-t border-gray-new-40 pb-[120px]',
      'xl:pb-[136px] lg:pb-20 md:pb-[52px]'
    )}
  >
    <StatusLine className="mt-2.5" />
    <div className="overflow-hidden">
      <Container className="xl:max-w-5xl xl:px-16 lg:!px-16 md:!px-5" size="1280">
        <Header />
        <Features />
      </Container>
      <Checkpoints />
    </div>
    <span
      className={clsx(
        'pointer-events-none absolute -top-[130px] left-1/2 -z-10 aspect-[1.3] w-[1200px] -translate-x-[30%] rounded-[100%] opacity-15',
        'bg-[url("/images/pages/home-new/speed-scale/noise.png")] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_20%,transparent)]',
        'xl:-top-20 xl:left-2/3 xl:w-[1000px] xl:opacity-10 lg:hidden'
      )}
      aria-hidden
    />
  </section>
);

export default SpeedScale;
