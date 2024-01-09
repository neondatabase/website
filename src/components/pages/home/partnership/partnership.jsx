import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container/container';
import Heading from 'components/shared/heading';
import LINKS from 'constants/links';
import airplane from 'images/partners-logos/airplane.svg';
import clouflare from 'images/partners-logos/cloudflare.svg';
import hasura from 'images/partners-logos/hasura.svg';
import replit from 'images/partners-logos/replit.svg';
import vercel from 'images/partners-logos/vercel.svg';
import wundergraph from 'images/partners-logos/wundergraph.svg';

const logos = [
  {
    logo: hasura,
    alt: 'Hasura',
    width: 111,
  },
  {
    logo: replit,
    alt: 'Replit',
    width: 119,
  },
  {
    logo: clouflare,
    alt: 'Cloudflare',
    width: 160,
  },
  {
    logo: vercel,
    alt: 'Vercel',
    width: 112,
  },
  {
    logo: airplane,
    alt: 'Airplane',
    width: 140,
  },
  {
    logo: wundergraph,
    alt: 'WunderGraph',
    width: 152,
  },
];

const Partnership = () => (
  <section className="partnership safe-paddings bg-black pb-52 text-white 2xl:pb-40 xl:pb-32 lg:pb-24 md:pb-20">
    <Container className="flex flex-col items-center justify-center text-center" size="md">
      <Heading className="leading-dense" tag="h2" size="md" theme="white">
        Discover Neon Partnership Program
      </Heading>
      <p className="mt-5 text-[30px] xl:text-2xl lg:text-lg md:text-base">
        Integrate Neon into any application seamlessly.
      </p>
      <Button
        id="saas-button"
        className="mt-10 2xl:mt-8 xl:mt-7 md:mt-6"
        to={LINKS.partners}
        size="md"
        theme="primary"
      >
        Become a partner
      </Button>
      <ul className="mt-20 grid w-full grid-cols-12 gap-x-10 xl:flex xl:flex-wrap xl:justify-center xl:gap-x-8 xl:gap-y-8 lg:mt-12 sm:gap-y-6">
        {logos.map(({ logo, alt, width }, index) => (
          <li
            className="relative col-span-2 mr-1.5 after:absolute after:-bottom-1.5 after:-right-1.5 after:h-full after:w-full after:rounded-md after:bg-gray-1"
            key={index}
          >
            <div className="relative z-10 flex items-center justify-center rounded-md border-4 border-gray-1 bg-[#191919] px-[18px] py-[18px] md:py-4">
              <Image
                className="h-8 w-auto lg:h-7 md:h-6 sm:h-5"
                src={logo}
                alt={alt}
                width={width}
                height={32}
              />
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Partnership;
