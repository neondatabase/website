import clsx from 'clsx';
import Image from 'next/image';

import DownloadIcon from 'icons/download.inline.svg';

import Section from '../section';

const logos = [
  {
    src: '/brand/neon-logomark-light-color.svg?updated=2026-01-15',
    name: 'neon-logomark-light-color.svg',
  },
  {
    src: '/brand/neon-logomark-light-mono.svg?updated=2026-01-15',
    name: 'neon-logomark-light-mono.svg',
  },
  {
    src: '/brand/neon-logomark-dark-color.svg?updated=2026-01-15',
    name: 'neon-logomark-dark-color.svg',
  },
  {
    src: '/brand/neon-logomark-dark-mono.svg?updated=2026-01-15',
    name: 'neon-logomark-dark-mono.svg',
  },
];

const Logomark = () => (
  <Section
    title="Logomark"
    description="The Neon logomark should only be used in places where there is not enough room to display the full logo, or in cases where only brand symbols of multiple brands are displayed."
  >
    <ul className="grid grid-cols-4 gap-4 md:grid-cols-2">
      {logos.map((logo, index) => (
        <li
          className={clsx(
            index < 2 && 'bg-white',
            index >= 2 && 'border border-gray-new-30 bg-black-pure'
          )}
          key={index}
        >
          <a
            className="group relative flex h-[200px] items-center justify-center lg:h-[164px] md:h-[152px]"
            href={logo.src}
            download={logo.name}
          >
            <Image
              className="md:w-[52px]"
              src={logo.src}
              alt="Neon logomark"
              width={64}
              height={64}
              unoptimized
            />
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

export default Logomark;
