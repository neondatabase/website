'use client';

import clsx from 'clsx';
import Image from 'next/image';

import DownloadIcon from 'icons/download.inline.svg';

import Section from '../section';
import { handleDownload } from '../utils';

const logos = [
  {
    className: 'bg-white',
    svgSrc: '/brand/neon-logo-light-color.svg?updated=2026-01-21',
    svgName: 'neon-logo-light-color.svg',
    pngSrc: '/brand/neon-logo-light-color@2x.png?updated=2026-01-21',
    pngName: 'neon-logo-light-color@2x.png',
  },
  {
    className: 'bg-black-pure border-gray-new-30 border',
    svgSrc: '/brand/neon-logo-dark-color.svg?updated=2026-01-21',
    svgName: 'neon-logo-dark-color.svg',
    pngSrc: '/brand/neon-logo-dark-color@2x.png?updated=2026-01-21',
    pngName: 'neon-logo-dark-color@2x.png',
  },
  {
    className: 'bg-[#5280FF]',
    svgSrc: '/brand/neon-logo-dark-mono.svg?updated=2026-01-21',
    svgName: 'neon-logo-dark-mono.svg',
    pngSrc: '/brand/neon-logo-dark-mono@2x.png?updated=2026-01-21',
    pngName: 'neon-logo-dark-mono@2x.png',
  },
  {
    className: 'bg-[#4DDBA7]',
    svgSrc: '/brand/neon-logo-light-mono.svg?updated=2026-01-21',
    svgName: 'neon-logo-light-mono.svg',
    pngSrc: '/brand/neon-logo-light-mono@2x.png?updated=2026-01-21',
    pngName: 'neon-logo-light-mono@2x.png',
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
          <div
            className={clsx(
              'group relative flex h-[180px] items-center justify-center',
              logo.className
            )}
          >
            <Image src={logo.svgSrc} alt="Neon logo" width={157} height={45} priority unoptimized />
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

export default Logo;
