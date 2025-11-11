import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import bcgIcon from 'icons/home/logos/bcg.svg';
import doordashIcon from 'icons/home/logos/doordash.svg';
import metaIcon from 'icons/home/logos/meta.svg';
import outfrontIcon from 'icons/home/logos/outfront.svg';
import pepsiIcon from 'icons/home/logos/pepsi.svg';
import replitIcon from 'icons/home/logos/replit.svg';
import retoolIcon from 'icons/home/logos/retool.svg';
import zimmerBiometIcon from 'icons/home/logos/zimmer-biomet.svg';

const logos = [
  {
    logo: pepsiIcon,
    alt: 'Pepsi',
    width: 36,
    height: 36,
  },
  {
    logo: replitIcon,
    alt: 'Replit',
    width: 116,
    height: 28,
  },
  {
    logo: outfrontIcon,
    alt: 'Outfront Media',
    width: 123,
    height: 28,
  },

  {
    logo: doordashIcon,
    alt: 'DoorDash',
    width: 171,
    height: 20,
  },
  {
    logo: bcgIcon,
    alt: 'Boston Consulting Group',
    width: 101,
    height: 28,
  },
  {
    logo: zimmerBiometIcon,
    alt: 'Zimmer Biomet',
    width: 146,
    height: 28,
  },
  {
    logo: retoolIcon,
    alt: 'Retool',
    width: 100,
    height: 20,
  },

  {
    logo: metaIcon,
    alt: 'Meta',
    width: 100,
    height: 20,
  },
];

const sizes = {
  20: 'lg:h-[14px]',
  28: 'lg:h-5',
  36: 'lg:h-7',
};

const Logos = () => (
  <section className="safe-paddings mt-[176px] xl:mt-24 lg:mt-20 sm:mt-24">
    <Container
      className={clsx(
        'z-20 flex items-center gap-x-[109px] gap-y-6',
        'xl:max-w-5xl xl:gap-x-[42px] xl:px-8',
        'lg:!max-w-3xl lg:justify-center lg:gap-x-6',
        'md:!max-w-[620px] md:flex-col md:items-start'
      )}
      size="1100"
    >
      <h2
        className={clsx(
          'w-full max-w-[400px] text-[36px] font-medium leading-dense tracking-extra-tight text-white',
          'xl:max-w-[350px] xl:text-[32px] lg:max-w-[286px] lg:text-[26px]',
          'md:w-full md:max-w-full sm:text-[22px]'
        )}
      >
        Trusted in production <br /> by thousands of teams.
      </h2>
      <ul
        className={clsx(
          'flex shrink flex-wrap items-center gap-11',
          'xl:gap-x-10 xl:gap-y-9 lg:justify-normal lg:gap-x-6 lg:gap-y-7',
          'md:max-w-[480px] sm:gap-x-7 sm:gap-y-5'
        )}
      >
        {logos.map(({ logo, width, height, alt }, index) => (
          <li key={index}>
            <Image
              className={clsx(sizes[height], 'lg:w-auto')}
              src={logo}
              width={width}
              height={height}
              alt={alt}
              loading="lazy"
            />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Logos;
