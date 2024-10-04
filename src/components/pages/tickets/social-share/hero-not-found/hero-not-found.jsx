'use client';

import Button from 'components/pages/deploy/button';
import DynamicTicket from 'components/pages/deploy/dynamic-ticket';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

const HeroNotFound = () => (
  <section className="overflow-hidden">
    <Container
      className="relative mx-auto grid flex-grow grid-cols-12 gap-10 py-40 xl:h-[-webkit-fill-available] xl:grid-cols-1 xl:pb-11 xl:pt-28 lg:gap-y-8 lg:py-9 md:gap-y-7 md:pb-20 md:pt-5"
      size="1344"
    >
      <div className="col-span-4 col-start-1 self-center 2xl:col-start-1 xl:col-span-full xl:self-end xl:text-center">
        <Link to={LINKS.deploy} theme="green" size="sm" className="mb-2 font-semibold">
          Neon Deploy
        </Link>
        <h1 className="text-[62px] font-semibold leading-none tracking-[-0.05em] text-white xl:mx-auto xl:text-center md:text-[52px]">
          Ooops!
          <br /> Ticket not found...
        </h1>
        <p className="mt-5 font-mono text-[1.15rem] font-light leading-tight tracking-tight text-white 2xl:max-w-[420px] xl:mx-auto xl:max-w-xl xl:text-center xl:text-lg xl:leading-[1.375] xl:tracking-tighter lg:mt-4 lg:text-base">
          Sorry, the ticket you are looking for doesn't exist.
        </p>
        <Button className="mt-11" size="md" theme="primary" href={LINKS.deploy} isAnimated>
          Grab yours
        </Button>
      </div>
      <div className="col-span-6 col-start-6 self-center 2xl:col-start-6 2xl:-ml-10 xl:col-span-full xl:mr-0 xl:self-start lg:ml-0">
        <DynamicTicket
          userData={{
            id: 0,
            name: 'Your Name',
            image: '',
            login: 'github-account',
            colorSchema: '0',
          }}
          isBlankTicket
        />
      </div>
    </Container>
  </section>
);

export default HeroNotFound;
