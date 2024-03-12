import Image from 'next/image';

import Container from 'components/shared/container';
import phoneIllustration from 'images/pages/home/lightning/phone.png';

const Lightning = () => (
  <section className="lightning safe-paddings mt-[216px]">
    <Container className="pb-[311px]" size="960">
      <h2 className="text-[128px] font-medium leading-[0.95] -tracking-wider text-white">
        Lightning fast. Edge&nbsp;ready.
      </h2>
      <div className="ml-32 mt-[104px] font-medium leading-none text-white">
        <span className="text-[128px] tracking-[-0.06em]">10</span>
        <span className="text-[38px] tracking-extra-tight">ms</span>
      </div>
      <p className="ml-32 mt-8 max-w-[288px] leading-snug tracking-extra-tight text-gray-new-80">
        <span className="font-medium text-white">Achieve low-latency</span> from an edge function to
        your regional compute.
      </p>
      <p className="ml-32 mt-5 max-w-[288px] leading-snug tracking-extra-tight text-gray-new-80">
        The Neon serverless driver, designed for JavaScript and TypeScript, ensures{' '}
        <span className="font-medium text-white">low-latency Postgres queries</span>. It facilitates
        seamless data retrieval from both serverless and edge environments, utilizing HTTP.
      </p>
      <Image
        className="absolute -right-9 top-32"
        src={phoneIllustration}
        width={482}
        height={893}
      />
    </Container>
  </section>
);

export default Lightning;
