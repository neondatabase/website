import cn from 'clsx';

import Container from 'components/shared/container';

import Features from './features';
import Header from './header';
import StatusLine from './status-line';
import Timeline from './timeline';

const SpeedScale = () => (
  <section
    className={cn(
      'speed-scale safe-paddings overflow-hidden border-t border-gray-new-40 pb-[120px]',
      'xl:pb-[136px] lg:pb-[116px] md:pb-[70px]'
    )}
  >
    <StatusLine className="mt-2.5" />
    <Container className="max-w-[1344px] px-16 xl:max-w-5xl">
      <Header />
      <Features />
    </Container>
    <Timeline />
  </section>
);

export default SpeedScale;
