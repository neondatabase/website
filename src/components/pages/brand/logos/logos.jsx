import Image from 'next/image';

import Container from 'components/shared/container';

import DownloadIcon from './images/download.inline.svg';
import logoSpacingSm from './images/logo-spacing-sm.svg';
import logoSpacing from './images/logo-spacing.svg';

const logos = [
  { src: '/brand/neon-logo-light-color.svg', name: 'neon-logo-light-color.svg' },
  { src: '/brand/neon-logo-dark-color.svg', name: 'neon-logo-dark-color.svg' },
  { src: '/brand/neon-logo-light-mono.svg', name: 'neon-logo-light-mono.svg' },
  { src: '/brand/neon-logo-dark-mono.svg', name: 'neon-logo-dark-mono.svg' },
];
const logosSm = [
  { src: '/brand/neon-logomark-light-color.svg', name: 'neon-logomark-light-color.svg' },
  { src: '/brand/neon-logomark-light-mono.svg', name: 'neon-logomark-light-mono.svg' },
  { src: '/brand/neon-logomark-dark-color.svg', name: 'neon-logomark-dark-color.svg' },
  { src: '/brand/neon-logomark-dark-mono.svg', name: 'neon-logomark-dark-mono.svg' },
];

const Logos = () => (
  <section className="logos pb-40 pt-[104px] xl:pb-28 xl:pt-20 lg:pb-[88px] lg:pt-16 md:pb-[72px]">
    <Container className="flex flex-col gap-y-[104px] xl:gap-y-20 lg:gap-y-16" size="768">
      <div>
        <h2 className="font-title text-4xl font-medium leading-none tracking-extra-tight xl:text-[36px] lg:text-[32px] md:text-[28px]">
          Logo
        </h2>
        <p className="mt-3.5 max-w-[512px] font-light leading-snug tracking-extra-tight text-gray-new-80 lg:mt-2.5 md:mt-2">
          Default to using the complete full-color logo below. Use the monochrome version when the
          context requires it. Do not edit, change, distort, recolor, or reconfigure the Neon logo.
        </p>
        <ul className="mt-10 grid auto-cols-fr grid-cols-2 gap-4 xl:mt-9 lg:mt-8 md:mt-7 md:grid-cols-1">
          {logos.map((logo, index) => (
            <li className="group rounded-md odd:bg-white even:bg-black" key={index}>
              <a
                className="group/link relative flex h-[180px] items-center justify-center"
                href={logo.src}
                download={logo.name}
              >
                <Image src={logo.src} alt="Neon logo" width={158} height={44} priority />
                <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded border opacity-0 transition-opacity duration-300 group-odd:border-gray-new-80 group-odd:text-gray-new-30 group-even:border-gray-new-20 group-even:text-gray-new-94 group-hover/link:opacity-100">
                  <DownloadIcon />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-title text-4xl font-medium leading-none tracking-extra-tight xl:text-[36px] lg:text-[32px] md:text-[28px]">
          Logomark
        </h2>
        <p className="mt-3.5 max-w-[512px] font-light leading-snug tracking-extra-tight text-gray-new-80 lg:mt-2.5 md:mt-2">
          The Neon logomark should only be used in places where there is not enough room to display
          the full logo, or in cases where only brand symbols of multiple brands are displayed.
        </p>
        <ul className="mt-10 grid auto-cols-fr grid-cols-4 gap-4 xl:mt-9 lg:mt-8 md:mt-7 md:grid-cols-2">
          {logosSm.map((logo, index) => (
            <li
              className="group rounded-md [&:nth-child(-n+2)]:bg-white [&:nth-child(-n+2)_span]:border-gray-new-80 [&:nth-child(-n+2)_span]:text-gray-new-30 [&:nth-last-child(-n+2)]:bg-black [&:nth-last-child(-n+2)_span]:border-gray-new-20 [&:nth-last-child(-n+2)_span]:text-gray-new-94"
              key={index}
            >
              <a
                className="group/link relative flex h-[200px] items-center justify-center lg:h-[164px] md:h-[152px]"
                href={logo.src}
                download={logo.name}
              >
                <Image
                  className="lg:h-auto lg:w-[52px]"
                  src={logo.src}
                  alt="Neon logo"
                  width={58}
                  height={58}
                />
                <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded border opacity-0 transition-opacity duration-200 group-hover/link:opacity-100">
                  <DownloadIcon />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-title text-4xl font-medium leading-none tracking-extra-tight xl:text-[36px] lg:text-[32px] md:text-[28px]">
          Spacing considerations
        </h2>
        <p className="mt-3.5 max-w-[512px] font-light leading-snug tracking-extra-tight text-gray-new-80 lg:mt-2.5 md:mt-2">
          The safety area surrounding the Logo is defined by the height of our symbol.
        </p>
        <div className="mt-10 flex gap-x-14 rounded-md bg-black-new px-14 pb-[54px] pt-[26px] xl:mt-9 lg:mt-8 lg:gap-x-[76px] lg:pb-[67px] lg:pl-[49px] lg:pt-10 md:mt-7 md:flex-col md:justify-center md:gap-y-6 md:p-6">
          <Image
            className="lg:h-[190px] lg:w-auto md:mx-auto md:h-40 md:w-[166px]"
            src={logoSpacingSm}
            alt="Logo spacing"
            width={225}
            height={217}
          />
          <Image
            className="lg:h-[190px] lg:w-auto md:mx-auto md:h-[158px] md:w-[272px]"
            src={logoSpacing}
            alt="Logo spacing"
            width={372}
            height={217}
          />
        </div>
      </div>
    </Container>
  </section>
);

export default Logos;
