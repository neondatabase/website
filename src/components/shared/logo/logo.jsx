'use client';

import * as Toast from '@radix-ui/react-toast';
import clsx from 'clsx';
import copyToClipboard from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import { useState } from 'react';

import LINKS from 'constants/links';
import useContextMenu from 'hooks/use-context-menu';
import LogoDarkIcon from 'icons/logo-dark.inline.svg';
import LogoLightIcon from 'icons/logo-light.inline.svg';
import logoDarkSvg from 'images/logo-dark.svg';
import logoLightSvg from 'images/logo-light.svg';

import Link from '../link';

import CheckIcon from './images/check.inline.svg';

const copySvgToClipboard = async () => {
  try {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const logoToUse = isDarkMode ? logoDarkSvg : logoLightSvg;

    const response = await fetch(logoToUse);
    const svgContent = await response.text();
    copyToClipboard(svgContent);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to copy SVG content: ', error);
  }
};

const data = [
  {
    name: 'Copy logo as SVG',
  },
  {
    name: 'Download logo pack',
    url: '/brand/neon-brand-assets.zip',
  },
  {
    name: 'View brand guidelines',
    url: LINKS.brand,
  },
];

const Logo = ({ className = null, width, height, isHeader = false }) => {
  const { clicked, setClicked } = useContextMenu();
  const [open, setOpen] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setClicked(true);
  };

  const handleCopySvg = () => {
    copySvgToClipboard();
    setOpen(true);
  };

  return (
    <div className="relative shrink-0">
      <Link
        className="block w-fit focus-visible:outline-offset-4"
        to="/"
        onContextMenu={isHeader ? handleContextMenu : undefined}
      >
        <span className="sr-only">Neon</span>
        <LogoLightIcon className={clsx('dark:hidden', className)} width={width} height={height} />
        <LogoDarkIcon
          className={clsx('hidden dark:block', className)}
          width={width}
          height={height}
        />
      </Link>
      {isHeader && clicked && (
        <div
          className={clsx(
            'absolute top-10 z-50 flex min-w-[200px] flex-col items-start gap-1',
            'border border-gray-new-80 bg-gray-new-98 p-2',
            'shadow-[0_10px_20px_0_rgba(0,0,0,0.06)]',
            'dark:border-gray-new-20 dark:bg-[#0A0A0B]',
            'dark:shadow-[0_8px_20px_0_rgba(0,0,0,0.40)]'
          )}
        >
          {data.map(({ name, url }) => {
            const Tag = url ? 'a' : 'button';
            return (
              <Tag
                className={clsx(
                  'group flex w-full items-center gap-x-2 whitespace-nowrap p-3',
                  'text-left text-[15px] leading-dense tracking-extra-tight text-gray-new-10',
                  'transition-colors duration-200',
                  'hover:bg-gray-new-90 hover:text-gray-new-10',
                  'dark:text-gray-new-90 dark:hover:bg-gray-new-8'
                )}
                key={name}
                href={url}
                onClick={url ? undefined : handleCopySvg}
              >
                {name}
              </Tag>
            );
          })}
        </div>
      )}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className={clsx(
            'rounded-lg border border-gray-new-94 bg-white px-[18px] py-3.5 text-gray-new-30',
            'shadow-[rgba(14,18,22,0.35)_0px_10px_38px_-10px,_rgba(14,18,22,0.2)_0px_10px_20px_-15px]',
            'data-[state=open]:animate-slideIn data-[state=closed]:animate-hide',
            'data-[swipe=end]:animate-swipeOut data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
            'data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out]',
            'dark:border-[#16181D] dark:bg-[#0B0C0F] dark:text-gray-new-70',
            'dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,0.50)]'
          )}
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className="flex items-center gap-x-2 whitespace-nowrap text-sm leading-none tracking-snug">
            <CheckIcon />
            Copied to clipboard!
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport
          className={clsx(
            'fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[245px] max-w-[100vw] list-none flex-col gap-[10px]',
            'p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]'
          )}
        />
      </Toast.Provider>
    </div>
  );
};

Logo.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isHeader: PropTypes.bool,
};

export default Logo;
