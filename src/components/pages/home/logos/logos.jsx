import clsx from 'clsx';

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
    className: 'lg:h-7',
  },
  {
    logo: replitIcon,
    alt: 'Replit',
    width: 116,
  },
  {
    logo: outfrontIcon,
    alt: 'Outfront Media',
    width: 123,
  },

  {
    logo: doordashIcon,
    alt: 'DoorDash',
    height: 20,
    width: 171,
    className: 'lg:h-[14px]',
  },
  {
    logo: bcgIcon,
    alt: 'Boston Consulting Group',
    width: 101,
  },
  {
    logo: zimmerBiometIcon,
    alt: 'Zimmer Biomet',
    width: 146,
  },
  {
    logo: retoolIcon,
    alt: 'Retool',
    width: 100,
    height: 20,
    className: 'lg:h-[14px]',
  },

  {
    logo: metaIcon,
    alt: 'Meta',
    height: 20,
    width: 100,
    className: 'lg:h-[14px]',
  },
];

const Logos = () => (
  <section className="safe-paddings mt-[176px] xl:mt-24 lg:mt-20 sm:mt-24">
    <Container
      className="z-20 flex items-center gap-x-[109px] gap-y-6 xl:gap-x-[42px] xl:px-8 lg:max-w-[960px] lg:justify-center lg:gap-x-6 md:flex-col sm:items-start"
      size="1100"
    >
      <h2 className="w-full max-w-[400px] text-[36px] font-medium leading-dense tracking-extra-tight text-white xl:max-w-[350px] xl:text-[32px] lg:max-w-[286px] lg:text-[26px] md:w-full md:max-w-full md:text-center sm:text-[22px]">
        Trusted in production <br /> by thousands of teams.
      </h2>
      <ul className="flex shrink flex-wrap items-center gap-11 xl:gap-x-10 xl:gap-y-9 lg:justify-normal lg:gap-x-6 lg:gap-y-7 md:justify-center sm:gap-x-7 sm:gap-y-5">
        {logos.map(({ logo, width, height, alt, className }, index) => (
          <li className={clsx('flex', index !== 0 && index !== 3 && 'justify-center')} key={index}>
            <img
              className={clsx(className || 'lg:h-5', 'lg:w-auto')}
              src={logo}
              height={height || 28}
              width={width}
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
