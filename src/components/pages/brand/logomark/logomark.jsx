'use client';

import Image from 'next/image';

import DownloadIcon from 'icons/download.inline.svg';
import { cn } from 'utils/cn';

import Section from '../section';
import { handleDownloads } from '../utils';

const logos = [
  {
    svgSrc: '/brand/neon-logomark-light-color.svg?updated=2026-06-03',
    svgName: 'neon-logomark-light-color.svg',
    svgSafeSrc: '/brand/neon-logomark-light-color-safe-area.svg?updated=2026-06-03',
    svgSafeName: 'neon-logomark-light-color-safe-area.svg',
    pngSrc: '/brand/neon-logomark-light-color.png?updated=2026-06-03',
    pngName: 'neon-logomark-light-color.png',
    pngSafeSrc: '/brand/neon-logomark-light-color-safe-area.png?updated=2026-06-03',
    pngSafeName: 'neon-logomark-light-color-safe-area.png',
  },
  {
    svgSrc: '/brand/neon-logomark-light-mono.svg?updated=2026-06-03',
    svgName: 'neon-logomark-light-mono.svg',
    svgSafeSrc: '/brand/neon-logomark-light-mono-safe-area.svg?updated=2026-06-03',
    svgSafeName: 'neon-logomark-light-mono-safe-area.svg',
    pngSrc: '/brand/neon-logomark-light-mono.png?updated=2026-06-03',
    pngName: 'neon-logomark-light-mono.png',
    pngSafeSrc: '/brand/neon-logomark-light-mono-safe-area.png?updated=2026-06-03',
    pngSafeName: 'neon-logomark-light-mono-safe-area.png',
  },
  {
    svgSrc: '/brand/neon-logomark-dark-color.svg?updated=2026-06-03',
    svgName: 'neon-logomark-dark-color.svg',
    svgSafeSrc: '/brand/neon-logomark-dark-color-safe-area.svg?updated=2026-06-03',
    svgSafeName: 'neon-logomark-dark-color-safe-area.svg',
    pngSrc: '/brand/neon-logomark-dark-color.png?updated=2026-06-03',
    pngName: 'neon-logomark-dark-color.png',
    pngSafeSrc: '/brand/neon-logomark-dark-color-safe-area.png?updated=2026-06-03',
    pngSafeName: 'neon-logomark-dark-color-safe-area.png',
  },
  {
    svgSrc: '/brand/neon-logomark-dark-mono.svg?updated=2026-06-03',
    svgName: 'neon-logomark-dark-mono.svg',
    svgSafeSrc: '/brand/neon-logomark-dark-mono-safe-area.svg?updated=2026-06-03',
    svgSafeName: 'neon-logomark-dark-mono-safe-area.svg',
    pngSrc: '/brand/neon-logomark-dark-mono.png?updated=2026-06-03',
    pngName: 'neon-logomark-dark-mono.png',
    pngSafeSrc: '/brand/neon-logomark-dark-mono-safe-area.png?updated=2026-06-03',
    pngSafeName: 'neon-logomark-dark-mono-safe-area.png',
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
          className={cn(
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

export default Logomark;
