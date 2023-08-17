import Container from 'components/shared/container';
import GradientLabel from 'components/shared/gradient-label';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

import airplaneLogo from './images/airplane.svg';
import bunnyshellLogo from './images/bunnyshell.svg';
import cloudflareLogo from './images/cloudflare.svg';
import hasuraLogo from './images/hasura.svg';
import illaLogo from './images/illa.svg';
import octolisLogo from './images/octolis.svg';
import replitLogo from './images/replit.svg';
import snapletLogo from './images/snaplet.svg';
import fabricIoLogo from './images/the-fabric-io.svg';
import vercelLogo from './images/vercel.svg';
import wundergraphLogo from './images/wundergraph.svg';

const logos = [
  {
    logo: vercelLogo,
    alt: 'Vercel',
    width: 125,
  },
  {
    logo: bunnyshellLogo,
    alt: 'Bunnyshell',
    width: 167,
  },
  {
    logo: replitLogo,
    alt: 'Replit',
    width: 132,
  },
  {
    logo: illaLogo,
    alt: 'Illa',
    width: 57,
  },
  {
    logo: hasuraLogo,
    alt: 'Hasura',
    width: 123,
  },
  {
    logo: octolisLogo,
    alt: 'Octolis',
    width: 98,
  },
  {
    logo: cloudflareLogo,
    alt: 'Cloudflare',
    width: 204,
  },
  {
    logo: snapletLogo,
    alt: 'Snaplet',
    width: 129,
  },
  {
    logo: airplaneLogo,
    alt: 'Airplane',
    width: 156,
  },
  {
    logo: wundergraphLogo,
    alt: 'Wundergraph',
    width: 169,
  },
  {
    logo: fabricIoLogo,
    alt: 'The Fabric',
    width: 192,
  },
];

const Partners = () => (
  <section className="partners safe-paddings mt-40 xl:mt-[120px] lg:mt-28 md:mt-20">
    <Container className="grid grid-cols-12 gap-x-10 xl:gap-x-6 lg:gap-x-4" size="medium">
      <div className="col-span-10 col-start-2 grid grid-cols-[auto,362px] items-center gap-x-[94px] rounded-2xl bg-gray-new-8 p-12 2xl:gap-x-20 xl:col-span-full xl:col-start-1 xl:p-8 lt:grid-cols-1 lt:gap-y-10 lg:pb-10 lg:pt-9 md:p-8">
        <div className="flex flex-wrap gap-x-[38px] gap-y-10 2xl:gap-x-8 2xl:gap-y-9 lt:order-1">
          {logos.map(({ logo, alt, width }, index) => (
            <img
              className="h-9 w-auto 2xl:h-7 xl:h-8 lg:h-7"
              src={logo}
              alt={alt}
              loading="lazy"
              key={index}
              width={width}
              height={36}
            />
          ))}
        </div>
        <div className="flex flex-col items-start lt:max-w-lg">
          <GradientLabel>Apply now</GradientLabel>
          <h2 className="mt-3 text-[52px] font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px]">
            Become a Partner
          </h2>
          <p className="mt-4 text-lg font-light leading-snug xl:text-base md:max-w-xs">
            Unlock new revenue streams by partnering with Neon.{' '}
            <Link
              className="inline-flex tracking-extra-tight underline-offset-[5px]"
              theme="green-underlined"
              to={LINKS.partners}
            >
              Learn more
            </Link>{' '}
            about how to participate in the Partners program.
          </p>
        </div>
      </div>
    </Container>
  </section>
);

export default Partners;
