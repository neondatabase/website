'use client';

import clsx from 'clsx';
import Image from 'next/image';

import DownloadIcon from 'icons/download.inline.svg';

import Section from '../section';
import { handleDownload } from '../utils';

const logos = [
  {
    svgSrc: '/brand/neon-logomark-light-color.svg?updated=2026-01-21',
    svgName: 'neon-logomark-light-color.svg',
    pngSrc: '/brand/neon-logomark-light-color@2x.png?updated=2026-01-21',
    pngName: 'neon-logomark-light-color@2x.png',
  },
  {
    svgSrc: '/brand/neon-logomark-light-mono.svg?updated=2026-01-21',
    svgName: 'neon-logomark-light-mono.svg',
    pngSrc: '/brand/neon-logomark-light-mono@2x.png?updated=2026-01-21',
    pngName: 'neon-logomark-light-mono@2x.png',
  },
  {
    svgSrc: '/brand/neon-logomark-dark-color.svg?updated=2026-01-21',
    svgName: 'neon-logomark-dark-color.svg',
    pngSrc: '/brand/neon-logomark-dark-color@2x.png?updated=2026-01-21',
    pngName: 'neon-logomark-dark-color@2x.png',
  },
  {
    svgSrc: '/brand/neon-logomark-dark-mono.svg?updated=2026-01-21',
    svgName: 'neon-logomark-dark-mono.svg',
    pngSrc: '/brand/neon-logomark-dark-mono@2x.png?updated=2026-01-21',
    pngName: 'neon-logomark-dark-mono@2x.png',
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
          <div className="group relative flex h-[200px] items-center justify-center lg:h-[164px] md:h-[152px]">
            <Image
              className="md:w-[52px]"
              src={logo.svgSrc}
              alt="Neon logomark"
              width={64}
              height={64}
              unoptimized
            />
            <div
              className={clsx(
                'absolute right-2.5 top-2.5 flex gap-2',
                'opacity-0 transition-opacity duration-300',
                'group-hover:opacity-100'
              )}
            >
              <button
                className={clsx(
                  'flex h-7 items-center gap-1.5 border px-2.5',
                  'border-gray-new-30 bg-gray-new-8 text-gray-new-94',
                  'transition-colors duration-200 hover:bg-gray-new-15'
                )}
                type="button"
                onClick={() => handleDownload(logo.pngSrc, logo.pngName)}
              >
                <span className="text-xs font-medium">PNG</span>
                <DownloadIcon className="h-3.5 w-3.5" />
              </button>
              <button
                className={clsx(
                  'flex h-7 items-center gap-1.5 border px-2.5',
                  'border-gray-new-30 bg-gray-new-8 text-gray-new-94',
                  'transition-colors duration-200 hover:bg-gray-new-15'
                )}
                type="button"
                onClick={() => handleDownload(logo.svgSrc, logo.svgName)}
              >
                <span className="text-xs font-medium">SVG</span>
                <DownloadIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

export default Logomark;
