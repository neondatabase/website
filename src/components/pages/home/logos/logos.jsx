import clsx from 'clsx';

import Container from 'components/shared/container';
import bcgIcon from 'icons/home/logos/bcg.svg';
import outfrontIcon from 'icons/home/logos/outfront7.svg';
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
    logo: bcgIcon,
    alt: 'Boston Consulting Group',
    width: 101,
  },
  {
    logo: outfrontIcon,
    alt: 'Outfront Media',
    width: 123,
  },
  {
    logo: replitIcon,
    alt: 'Replit',
    width: 116,
  },
];

const Logos = () => (
  <section className="safe-paddings mt-[176px] xl:mt-24 lg:mt-20 sm:mt-24">
    <Container
      className="z-20 flex flex-wrap items-center gap-x-[111px] gap-y-6 xl:max-w-[960px] xl:gap-x-20 lg:justify-center lg:gap-x-[42px] md:flex-col sm:items-start"
      size="1100"
    >
      <h2 className="max-w-[400px] text-[36px] font-medium leading-dense tracking-extra-tight text-white xl:text-[32px] lg:max-w-xs lg:text-[26px] md:max-w-full sm:text-[22px]">
        Trusted in production by&nbsp;thousands of&nbsp;teams.
      </h2>
      <ul className="flex max-w-[452px] shrink flex-wrap items-center gap-x-14 gap-y-12 xl:gap-x-12 xl:gap-y-9 lg:max-w-xs lg:gap-x-8 lg:gap-y-7 md:max-w-full sm:max-w-xs sm:gap-x-7 sm:gap-y-5">
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
