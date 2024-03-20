import Image from 'next/image';

import Container from 'components/shared/container';
import clouflareIcon from 'icons/home/logos/cloudflare.svg';
import hasuraIcon from 'icons/home/logos/hasura.svg';
import koyebIcon from 'icons/home/logos/koyeb.svg';
import replitIcon from 'icons/home/logos/replit.svg';
import vercelIcon from 'icons/home/logos/vercel.svg';
import wundergraphIcon from 'icons/home/logos/wundergraph.svg';

const logos = [
  {
    logo: vercelIcon,
    alt: 'Vercel',
    width: 100,
  },
  {
    logo: koyebIcon,
    alt: 'Koyeb',
    width: 107,
  },
  {
    logo: wundergraphIcon,
    alt: 'WunderGraph',
    width: 133,
  },
  {
    logo: hasuraIcon,
    alt: 'Hasura',
    width: 97,
  },
  {
    logo: replitIcon,
    alt: 'Replit',
    width: 104,
  },
  {
    logo: clouflareIcon,
    alt: 'Cloudflare',
    width: 161,
  },
];

const Logos = () => (
  <section className="safe-paddings mt-[172px] xl:mt-24 lg:mt-20 sm:mt-16">
    <Container
      className="z-20 flex flex-wrap items-center justify-between gap-y-6 xl:max-w-[960px] sm:flex-col sm:items-start"
      size="1100"
    >
      <h2 className="max-w-[370px] text-[36px] font-medium leading-dense tracking-extra-tight text-white xl:text-[32px] lg:max-w-[300px] lg:text-[26px] sm:text-[22px]">
        We separated storage and&nbsp;compute.
      </h2>
      <ul className="mr-[108px] grid shrink grid-cols-[0.61fr_.664fr_1fr] justify-center gap-x-14 gap-y-12 xl:mr-[69px] xl:gap-x-12 xl:gap-y-10 lg:mr-6 lg:gap-x-8 lg:gap-y-7 md:mr-0 sm:gap-y-5">
        {logos.map(({ logo, width, alt }) => (
          <li className="flex" key={alt}>
            <Image
              className="h-7 w-auto xl:h-6 lg:h-5"
              src={logo}
              height={28}
              width={width}
              alt={alt}
            />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Logos;
