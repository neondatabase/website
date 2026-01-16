import clsx from 'clsx';
import Image from 'next/image';

import DownloadIcon from 'icons/download.inline.svg';

import Section from '../section';

const logos = [
  {
    src: '/brand/neon-logo-light-color.svg?updated=2026-01-15',
    name: 'neon-logo-light-color.svg',
    className: 'bg-white',
  },
  {
    src: '/brand/neon-logo-dark-color.svg?updated=2026-01-15',
    name: 'neon-logo-dark-color.svg',
    className: 'bg-black-pure border-gray-new-30 border',
  },
  {
    src: '/brand/neon-logo-dark-mono.svg?updated=2026-01-15',
    name: 'neon-logo-dark-mono.svg',
    className: 'bg-[#5280FF]',
  },
  {
    src: '/brand/neon-logo-light-mono.svg?updated=2026-01-15',
    name: 'neon-logo-light-mono.svg',
    className: 'bg-[#4DDBA7]',
  },
];

const Logo = () => (
  <Section
    title="Logo"
    description="Default to using the complete full-color logo below. Use the monochrome version when the context requires it. Do not edit, change, distort, recolor, or reconfigure the Neon logo."
  >
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-1">
      {logos.map((logo, index) => (
        <li key={index}>
          <a
            className={clsx(
              'group relative flex h-[180px] items-center justify-center',
              logo.className
            )}
            href={logo.src}
            download={logo.name}
          >
            <Image src={logo.src} alt="Neon logo" width={157} height={45} priority unoptimized />
            <span
              className={clsx(
                'absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center border',
                'opacity-0 transition-opacity duration-300',
                'border-gray-new-30 bg-gray-new-8 text-gray-new-94',
                'group-hover:opacity-100'
              )}
            >
              <DownloadIcon />
            </span>
          </a>
        </li>
      ))}
    </ul>
  </Section>
);

export default Logo;
