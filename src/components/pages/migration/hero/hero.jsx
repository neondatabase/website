import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import LINKS from 'constants/links';

import claude from './images/claude.png';

const Hero = () => (
  <section className="hero safe-paddings relative pt-[134px] lg:pt-16 md:pt-12">
    <Container className="lg:mx-8 md:mx-auto md:max-w-[640px]" size="768">
      <div className="relative mb-10 size-[72px] lg:mb-8 lg:size-16 lg:rounded-[14px] md:mb-7 md:size-14">
        <Image
          className="relative z-10 size-full rounded-2xl shadow-[0px_5px_14px_0px_rgba(0,0,0,0.6)] md:rounded-xl"
          src={claude}
          alt=""
          width={72}
          height={72}
          quality={100}
          priority
        />
        <span
          className="absolute -right-1 -top-1 size-1/2 rounded-full bg-[#4265CD] blur-xl"
          aria-hidden
        />
        <span
          className="absolute -bottom-1 -left-1 size-1/2 rounded-full bg-[#39D6BE] blur-xl"
          aria-hidden
        />
      </div>
      <h1 className="max-w-[646px] font-title text-[64px] font-medium leading-none tracking-extra-tight xl:text-[56px] lg:max-w-xl lg:text-5xl md:max-w-full md:text-4xl">
        Tools to migrate <br className="xs:hidden" />
        your database to Neon
      </h1>
      <p className="mt-4 max-w-[570px] text-lg font-light leading-snug tracking-extra-tight text-gray-new-80 lg:mt-3 lg:text-base">
        Transfer data from AWS RDS, Azure Database for PostgreSQL, Supabase, and Heroku to Neon with
        minimal downtime.
      </p>
      <Button
        className="mt-9 h-12 min-w-40 px-[38px] font-semibold tracking-tighter lg:mt-7 lg:h-11 lg:px-8 lg:text-sm md:mt-6"
        theme="primary"
        to={LINKS.docsMigration}
        target="_blank"
        tagName="Migration Page Hero"
      >
        Get started
      </Button>
    </Container>
  </section>
);

export default Hero;
