import clsx from 'clsx';

import Container from 'components/shared/container';

import Features from './features';
import Header from './header';
import StatusLine from './status-line';
import Timeline from './timeline';

const SpeedScale = () => (
  <section
    className={clsx(
      'speed-scale safe-paddings relative border-t border-gray-new-40 pb-[120px]',
      'xl:pb-[136px] lg:pb-20 md:pb-[52px]'
    )}
  >
    <StatusLine className="mt-2.5" />
    <div className="overflow-hidden">
      <Container className="max-w-[1344px] px-16 xl:max-w-5xl lg:px-16">
        <Header />
        <Features />
      </Container>
      <Timeline />
    </div>
    <span
      className={clsx(
        'pointer-events-none absolute -top-[130px] left-1/2 -z-10 aspect-[1.3] w-[70%] -translate-x-[30%] rounded-[100%] lg:hidden',
        'bg-[url("/images/pages/home-new/noise.png")] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_50%,transparent)]'
      )}
      aria-hidden
    />
  </section>
);

export default SpeedScale;
