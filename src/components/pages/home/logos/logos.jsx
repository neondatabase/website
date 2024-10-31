import clsx from 'clsx';

import Container from 'components/shared/container';
import bcgIcon from 'icons/home/logos/bcg.svg';
import mistralIcon from 'icons/home/logos/mistral.svg';
import nerdwalletIcon from 'icons/home/logos/nerdwallet.svg';
import retoolIcon from 'icons/home/logos/retool.svg';
import v0Icon from 'icons/home/logos/v0.svg';
import zimmerBiometIcon from 'icons/home/logos/zimmer-biomet.svg';

const logos = [
  {
    logo: v0Icon,
    alt: 'Vercel V0',
    width: 40,
  },
  {
    logo: zimmerBiometIcon,
    alt: 'Zimmer Biomet',
    width: 146,
  },
  {
    logo: retoolIcon,
    alt: 'Retool',
    width: 92,
  },
  {
    logo: bcgIcon,
    alt: 'Boston Consulting Group',
    width: 101,
  },
  {
    logo: nerdwalletIcon,
    alt: 'NerdWallet',
    width: 123,
  },
  {
    logo: mistralIcon,
    alt: 'mistral AI',
    width: 58,
  },
];

const Logos = () => (
  <section className="safe-paddings mt-[176px] xl:mt-24 lg:mt-20 sm:mt-24">
    <Container
      className="z-20 flex flex-wrap items-center gap-x-[111px] gap-y-6 xl:max-w-[960px] xl:gap-x-20 lg:justify-center lg:gap-x-[42px] md:items-start sm:flex-col [@media(max-width:840px)]:justify-between"
      size="1100"
    >
      <h2 className="max-w-[401px] text-[36px] font-medium leading-dense tracking-extra-tight text-white xl:text-[32px] lg:max-w-xs lg:text-[26px] sm:text-[22px]">
        Trusted in production by&nbsp;thousands of&nbsp;teams.
      </h2>
      <ul className="grid max-w-[446px] shrink grid-cols-[0.7945fr_1fr_.630137fr] justify-between gap-12 xl:gap-x-12 xl:gap-y-10 lg:gap-x-8 lg:gap-y-7 sm:gap-y-5">
        {logos.map(({ logo, width, alt }, index) => (
          <li className={clsx('flex', index !== 0 && index !== 3 && 'justify-center')} key={index}>
            <img
              className="h-7 w-auto xl:h-6 lg:h-5"
              src={logo}
              height={28}
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
