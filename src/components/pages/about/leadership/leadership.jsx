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
  <section className="leadership safe-paddings mt-[216px] xl:mt-[152px] lg:mt-[112px] md:mt-[96px]">
    <Container size={768} className="lg:!max-w-[640px] lg:!px-0 md:!px-5 ">
      <Heading
        className="max-w-[800px] text-[68px] font-medium leading-[0.9] tracking-extra-tight xl:max-w-[663px] xl:text-[56px] lg:max-w-[564px] lg:text-5xl md:text-[36px]"
        tag="h2"
      >
        Leadership
      </Heading>
      <p className="mt-7 max-w-[647px] text-xl leading-snug tracking-extra-tight text-gray-new-50 xl:mt-5 xl:max-w-xl lg:mt-[18px] lg:max-w-lg lg:text-lg md:mt-4 md:text-base">
        It&apos;s all about the people. We are a team of{' '}
        <span className="text-white">Postgres hackers, systems and cloud engineers.</span> We
        believe that in the ever-changing technology stack Postgres is here to stay.
      </p>
      <ul className="mt-16 grid grid-cols-4 gap-x-[85px] gap-y-12 xl:mt-14 lg:mt-12 lg:gap-11 md:mt-8 md:grid-cols-2 md:gap-8 md:gap-y-10 md:px-4">
        {ITEMS.map(({ image, name, role }, index) => (
          <li className="flex flex-col" key={index}>
            <Image
              className="w-full rounded-sm"
              src={image}
              alt={`${name} image`}
              width={128}
              height={128}
              quality={100}
            />
            <span className="mt-5 max-w-[80px] text-[15px] font-medium leading-tight tracking-extra-tight">
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
