'use client';

import clsx from 'clsx';
import copyToClipboard from 'copy-to-clipboard';
import Image from 'next/image';
import PropTypes from 'prop-types';

import LINKS from 'constants/links';
import useContextMenu from 'hooks/use-context-menu';
import useWindowSize from 'hooks/use-window-size';
import logoBlack from 'images/logo-black.svg';
import logoWhite from 'images/logo-white.svg';

import DownloadIcon from './images/download.inline.svg';
import FileIcon from './images/file.inline.svg';
import NeonIcon from './images/neon.inline.svg';

const copySvgToClipboard = async () => {
  try {
    const response = await fetch(logoWhite);
    const svgContent = await response.text();
    copyToClipboard(svgContent);

    console.log('SVG content copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy SVG content: ', error);
  }
};

const data = [
  {
    icon: NeonIcon,
    name: 'Copy logo as SVG',
    isButton: true,
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

const ContextMenu = ({ points, isDarkTheme }) => (
  <div
    className="absolute z-10 flex flex-col items-start rounded-lg border border-gray-new-94 bg-white p-1 shadow-[0px_14px_20px_0px_rgba(0,0,0,0.10)] dark:border-[#16181D] dark:bg-[#0B0C0F]"
    style={{ left: points.x, top: points.y }}
  >
    {data.map(({ icon: Icon, name, isButton, url }) => {
      const Tag = url ? 'a' : 'button';
      return (
        <Tag
          className="group flex w-full items-center gap-x-2 whitespace-nowrap rounded-[5px] p-2.5 text-left text-[13px] leading-none -tracking-[0.01em] text-gray-new-30 transition-colors duration-200 hover:bg-[#F5F5F5] hover:text-gray-new-10 dark:text-gray-new-70 dark:hover:bg-[#16181D] dark:hover:text-gray-new-94"
          key={name}
          href={url}
          onClick={isButton ? () => copySvgToClipboard(isDarkTheme) : null}
        >
          <Icon className="h-3.5 w-3.5 text-gray-new-50 transition-colors duration-200 group-hover:text-gray-new-10 dark:group-hover:text-gray-new-94" />
          <span>{name}</span>
        </Tag>
      );
    })}
  </div>
);

ContextMenu.propTypes = {
  points: PropTypes.object.isRequired,
  isDarkTheme: PropTypes.bool.isRequired,
};

const Logo = ({
  className = null,
  isDarkTheme,
  width,
  height,
  priority = undefined,
  isDocPage = false,
}) => {
  const { clicked, setClicked, points, setPoints } = useContextMenu();
  const { width: screenWidth } = useWindowSize();

  const doxPageX = screenWidth > 1280 ? 52 : 32;

  const handleContextMenu = (e) => {
    e.preventDefault();
    setClicked(true);
    setPoints({ x: isDocPage ? doxPageX : 0, y: isDocPage ? 56 : 44 });
  };

  return (
    <div onContextMenu={handleContextMenu}>
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
      {clicked && <ContextMenu points={points} isDarkTheme={isDarkTheme} />}
    </div>
  );
};

Logo.propTypes = {
  className: PropTypes.string,
  isDarkTheme: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  priority: PropTypes.bool,
  isDocPage: PropTypes.bool,
};

export default Logo;
