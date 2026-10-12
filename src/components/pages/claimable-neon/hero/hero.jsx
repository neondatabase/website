import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import Logos from 'components/shared/logos';
import SectionLabel from 'components/shared/section-label';

import Provisioner from './provisioner';

const logos = [
  'replit',
  'outfront',
  'doordash',
  'bcg',
  'pepsi',
  'retool',
  'meta',
  'bitso',
  'framer',
];

const Hero = () => (
  <section className="hero relative overflow-hidden pt-43.5 safe-paddings xl:pt-36 lg:pt-28 md:pt-24">
    <Container size="1344">
      <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,6fr)] grid-rows-[1fr_auto] items-start gap-x-24 xl:grid-cols-2 xl:gap-x-12 lg:grid-cols-1 lg:grid-rows-none lg:gap-y-12">
        <div className="flex min-w-0 flex-col items-start lg:order-1">
          <SectionLabel theme="white">Claimable Neon</SectionLabel>
          <h1 className="mt-5 text-6xl leading-dense tracking-tighter text-pretty xl:text-5xl lg:max-w-2xl md:mt-4 md:text-4xl sm:text-3xl">
            A project when your agent needs one.
          </h1>
          <p className="mt-6 max-w-142 text-lg leading-normal tracking-extra-tight text-pretty text-gray-new-70 xl:text-base lg:max-w-xl md:mt-5">
            Agents can provision a Neon project before a human creates an account. Start building,
            then claim the project into a Neon organization before it expires. Powered by{' '}
            <Link
              to="https://workos.com/auth-md"
              theme="white"
              target="_blank"
              rel="noopener noreferrer"
            >
              auth.md
            </Link>
            .
          </p>
          <Button
            className="mt-8"
            size="new"
            theme="white-filled"
            to="/docs/reference/claimable-neon"
            tagName="Claimable Neon Hero"
          >
            Read the docs
          </Button>
        </div>
        <div
          className="col-start-1 row-start-2 w-full pt-16 lg:order-3 lg:col-auto lg:row-auto lg:pt-0"
          aria-hidden="true"
        >
          <Logos className="max-w-full p-0! [&_.logos]:[--gap:4rem]" logos={logos} size="md" />
        </div>
        <div
          id="provision"
          className="col-start-2 row-span-2 row-start-1 min-w-0 scroll-mt-24 lg:order-2 lg:col-auto lg:row-auto lg:row-span-1"
        >
          <Provisioner />
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
