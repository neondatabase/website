'use client';

import * as Toast from '@radix-ui/react-toast';
import clsx from 'clsx';
import copyToClipboard from 'copy-to-clipboard';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useState } from 'react';

import LINKS from 'constants/links';
import useContextMenu from 'hooks/use-context-menu';
import logoBlack from 'images/logo-black.svg';
import logoWhite from 'images/logo-white.svg';

import Link from '../link';

import CheckIcon from './images/check.inline.svg';
import DownloadIcon from './images/download.inline.svg';
import FileIcon from './images/file.inline.svg';
import NeonIcon from './images/neon.inline.svg';

const copySvgToClipboard = async () => {
  try {
    const response = await fetch(logoWhite);
    const svgContent = await response.text();
    copyToClipboard(svgContent);
  } catch (error) {
    console.error('Failed to copy SVG content: ', error);
  }
};

const data = [
  {
    icon: NeonIcon,
    name: 'Copy logo as SVG',
  },
  {
    icon: DownloadIcon,
    name: 'Download logo pack',
    url: '/brand/neon-brand-assets.zip',
  },
  {
    icon: FileIcon,
    name: 'View brand guidelines',
    url: LINKS.brand,
  },
];

const Logo = ({
  className = null,
  isDarkTheme,
  width,
  height,
  priority = undefined,
  isHeader = false,
}) => {
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
      <Link to="/" onContextMenu={isHeader ? handleContextMenu : undefined}>
        <span className="sr-only">Neon</span>
        {isDarkTheme ? (
          <Image
            className={clsx(className)}
            src={logoWhite}
            alt=""
            width={width}
            height={height}
            priority={priority}
            aria-hidden
          />
        ) : (
          <>
            <Image
              className={clsx('dark:hidden', className)}
              src={logoBlack}
              alt=""
              width={width}
              height={height}
              priority={priority}
              aria-hidden
            />
            <Image
              className={clsx('hidden dark:block', className)}
              src={logoWhite}
              alt=""
              width={width}
              height={height}
              priority={priority}
              aria-hidden
            />
          </>
        )}
      </Link>
      {isHeader && clicked && (
        <div
          className="absolute z-10 flex flex-col items-start rounded-lg border border-gray-new-94 bg-white p-1 shadow-[0px_14px_20px_0px_rgba(0,0,0,0.10)] dark:border-[#16181D] dark:bg-[#0B0C0F]"
          style={{ left: 0, top: 44 }}
        >
          {data.map(({ icon: Icon, name, url }) => {
            const Tag = url ? 'a' : 'button';
            return (
              <Tag
                className="group flex w-full items-center gap-x-2 whitespace-nowrap rounded-[5px] p-2.5 text-left text-[13px] leading-none -tracking-[0.01em] text-gray-new-30 transition-colors duration-200 hover:bg-[#F5F5F5] hover:text-gray-new-10 dark:text-gray-new-70 dark:hover:bg-[#16181D] dark:hover:text-gray-new-94"
                key={name}
                href={url}
                onClick={url ? undefined : handleCopySvg}
              >
                <Icon className="h-3.5 w-3.5 text-gray-new-50 transition-colors duration-200 group-hover:text-gray-new-10 dark:group-hover:text-gray-new-94" />
                <span>{name}</span>
              </Tag>
            );
          })}
        </div>
      )}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut rounded-lg border border-gray-new-94 bg-white px-[18px] py-3.5 text-gray-new-30 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out] dark:border-[#16181D] dark:bg-[#0B0C0F] dark:text-gray-new-70 dark:shadow-[0px_14px_20px_0px_rgba(0,0,0,0.50)]"
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className="flex items-center gap-x-2 whitespace-nowrap text-sm leading-none tracking-[-0.01em]">
            <CheckIcon />
            Copied to clipboard!
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[245px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
      </Toast.Provider>
    </div>
  );
};

Logo.propTypes = {
  className: PropTypes.string,
  isDarkTheme: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  priority: PropTypes.bool,
  isHeader: PropTypes.bool,
};

export default Logo;
