import Image from 'next/image';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import arjunanRajeswaran from 'images/pages/about/leadership/arjunan-rajeswaran.jpg';
import bryanClark from 'images/pages/about/leadership/bryan-clark.jpg';
import heikkiLinnakangas from 'images/pages/about/leadership/heikki-linnakangas.jpg';
import jamesBroadhead from 'images/pages/about/leadership/james-broadhead.jpg';
import lukeFlanagan from 'images/pages/about/leadership/luke-flanagan.jpg';
import nikitaShamgunov from 'images/pages/about/leadership/nikita-shamgunov.jpg';
import stasKelvich from 'images/pages/about/leadership/stas-kelvich.jpg';

const ITEMS = [
  {
    image: nikitaShamgunov,
    name: 'Nikita Shamgunov',
    role: 'CEO',
  },
  {
    image: heikkiLinnakangas,
    name: 'Heikki Linnakangas',
    role: 'Co-Founder',
  },
  {
    image: stasKelvich,
    name: 'Stas Kelvich',
    role: 'Co-Founder',
  },
  {
    image: jamesBroadhead,
    name: 'James Broadhead',
    role: 'VP Engineering',
  },
  {
    image: bryanClark,
    name: 'Bryan Clark',
    role: 'VP Product',
  },
  {
    image: arjunanRajeswaran,
    name: 'Arjunan Rajeswaran',
    role: 'Head of Revenue',
  },
  {
    image: lukeFlanagan,
    name: 'Luke Flanagan',
    role: 'VP Finance',
  },
];

const Leadership = () => (
  <section className="leadership safe-paddings mt-[200px] xl:mt-[136px] lg:mt-[104px] md:mt-20">
    <Container className="xl:px-8 md:!px-5" size="1152">
      <Heading
        className="max-w-[800px] text-[68px] font-medium leading-[0.9] tracking-extra-tight xl:max-w-[663px] xl:text-[56px] lg:max-w-[564px] lg:text-5xl md:text-[36px]"
        tag="h2"
        theme="black"
      >
        Leadership
      </Heading>
      <p className="mt-7 max-w-[740px] text-xl leading-snug tracking-extra-tight text-gray-new-50 xl:mt-5 xl:max-w-xl lg:mt-[18px] lg:max-w-lg lg:text-lg md:mt-3.5 md:text-base">
        Neon was founded by a team of{' '}
        <span className="text-white">database builders and Postgres hackers</span>.
      </p>
      <ul className="mt-16 grid grid-cols-7 gap-x-[42px] gap-y-10 xl:mt-14 xl:gap-x-[38px] lg:mt-12 lg:grid-cols-5 lg:pr-8 md:grid-cols-3 md:pr-7 sm:mt-8 sm:grid-cols-2 sm:gap-x-9">
        {ITEMS.map(({ image, name, role }, index) => (
          <li className="flex flex-col" key={index}>
            <Image
              className="w-full rounded-sm"
              src={image}
              alt={name}
              width={128}
              height={128}
              quality={100}
            />
            <span className="mt-5 max-w-[80px] text-[15px] font-medium leading-tight tracking-extra-tight xl:mt-4 md:mt-5">
              {name}
            </span>
            <span className="mt-1.5 text-sm font-light leading-tight tracking-extra-tight text-gray-new-70">
              {role}
            </span>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Leadership;
