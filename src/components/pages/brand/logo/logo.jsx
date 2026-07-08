'use client';

import Image from 'next/image';

import DownloadIcon from 'icons/download.inline.svg';
import { cn } from 'utils/cn';

import Section from '../section';
import { handleDownloads } from '../utils';

const logos = [
  {
    className: 'bg-white',
    svgSrc: '/brand/neon-logo-light-color.svg?updated=2026-06-03',
    svgName: 'neon-logo-light-color.svg',
    svgSafeSrc: '/brand/neon-logo-light-color-safe-area.svg?updated=2026-06-03',
    svgSafeName: 'neon-logo-light-color-safe-area.svg',
    pngSrc: '/brand/neon-logo-light-color.png?updated=2026-06-03',
    pngName: 'neon-logo-light-color.png',
    pngSafeSrc: '/brand/neon-logo-light-color-safe-area.png?updated=2026-06-03',
    pngSafeName: 'neon-logo-light-color-safe-area.png',
  },
  {
    className: 'bg-black-pure border-gray-new-30 border',
    svgSrc: '/brand/neon-logo-dark-color.svg?updated=2026-06-03',
    svgName: 'neon-logo-dark-color.svg',
    svgSafeSrc: '/brand/neon-logo-dark-color-safe-area.svg?updated=2026-06-03',
    svgSafeName: 'neon-logo-dark-color-safe-area.svg',
    pngSrc: '/brand/neon-logo-dark-color.png?updated=2026-06-03',
    pngName: 'neon-logo-dark-color.png',
    pngSafeSrc: '/brand/neon-logo-dark-color-safe-area.png?updated=2026-06-03',
    pngSafeName: 'neon-logo-dark-color-safe-area.png',
  },
  {
    className: 'bg-[#5280FF]',
    svgSrc: '/brand/neon-logo-dark-mono.svg?updated=2026-06-03',
    svgName: 'neon-logo-dark-mono.svg',
    svgSafeSrc: '/brand/neon-logo-dark-mono-safe-area.svg?updated=2026-06-03',
    svgSafeName: 'neon-logo-dark-mono-safe-area.svg',
    pngSrc: '/brand/neon-logo-dark-mono.png?updated=2026-06-03',
    pngName: 'neon-logo-dark-mono.png',
    pngSafeSrc: '/brand/neon-logo-dark-mono-safe-area.png?updated=2026-06-03',
    pngSafeName: 'neon-logo-dark-mono-safe-area.png',
  },
  {
    className: 'bg-[#4DDBA7]',
    svgSrc: '/brand/neon-logo-light-mono.svg?updated=2026-06-03',
    svgName: 'neon-logo-light-mono.svg',
    svgSafeSrc: '/brand/neon-logo-light-mono-safe-area.svg?updated=2026-06-03',
    svgSafeName: 'neon-logo-light-mono-safe-area.svg',
    pngSrc: '/brand/neon-logo-light-mono.png?updated=2026-06-03',
    pngName: 'neon-logo-light-mono.png',
    pngSafeSrc: '/brand/neon-logo-light-mono-safe-area.png?updated=2026-06-03',
    pngSafeName: 'neon-logo-light-mono-safe-area.png',
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
            className={cn(
              'group relative flex h-[180px] items-center justify-center',
              logo.className
            )}
          >
            <Image src={logo.svgSrc} alt="Neon logo" width={157} height={45} priority unoptimized />
            <div
              className={cn(
                'absolute top-2.5 right-2.5 flex gap-2',
                'opacity-0 transition-opacity duration-300',
                'group-hover:opacity-100'
              )}
            >
              <button
                className={cn(
                  'flex h-7 items-center gap-1.5 border px-2.5',
                  'border-gray-new-30 bg-gray-new-8 text-gray-new-94',
                  'transition-colors duration-200 hover:bg-gray-new-15'
                )}
                type="button"
                onClick={() =>
                  handleDownloads([
                    { url: logo.pngSrc, filename: logo.pngName },
                    { url: logo.pngSafeSrc, filename: logo.pngSafeName },
                  ])
                }
              >
                <span className="text-xs font-medium">PNG</span>
                <DownloadIcon className="h-3.5 w-3.5" />
              </button>
              <button
                className={cn(
                  'flex h-7 items-center gap-1.5 border px-2.5',
                  'border-gray-new-30 bg-gray-new-8 text-gray-new-94',
                  'transition-colors duration-200 hover:bg-gray-new-15'
                )}
                type="button"
                onClick={() =>
                  handleDownloads([
                    { url: logo.svgSrc, filename: logo.svgName },
                    { url: logo.svgSafeSrc, filename: logo.svgSafeName },
                  ])
                }
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
