'use client';

import copyToClipboard from 'copy-to-clipboard';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import LINKS from 'constants/links';
import useContextMenu from 'hooks/use-context-menu';
import logoWhite from 'images/logo-white.svg';

import DownloadIcon from '../images/download.inline.svg';
import FileIcon from '../images/file.inline.svg';
import NeonIcon from '../images/neon.inline.svg';

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

const ContextMenu = ({ points, data }) => (
  <div
    className="absolute z-10 flex flex-col items-start gap-y-2 rounded-lg border border-[#16181D] bg-[#0B0C0F] p-1 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
    style={{ left: points.x, top: points.y }}
  >
    {data.map(({ icon: Icon, name, isButton, url }) => {
      const Tag = url ? 'a' : 'button';
      return (
        <Tag
          className="flex w-full items-center gap-x-2 whitespace-nowrap rounded-[5px] p-2.5 text-left text-[13px] leading-none -tracking-[0.01em] text-gray-new-70 transition-colors duration-200 hover:bg-[#16181D] hover:text-gray-new-94"
          key={name}
          href={url}
          onClick={isButton ? () => copySvgToClipboard() : undefined}
        >
          <Icon className="h-3.5 w-3.5" />
          <span>{name}</span>
        </Tag>
      );
    })}
  </div>
);

ContextMenu.propTypes = {
  points: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};

const LogoLink = ({ isDarkTheme }) => {
  const { clicked, setClicked, points, setPoints } = useContextMenu();
  return (
    <div className="relative">
      <Link
        to="/"
        onContextMenu={(e) => {
          e.preventDefault();
          setClicked(true);
          setPoints({
            x: 0,
            y: 44,
          });
        }}
      >
        <span className="sr-only">Neon</span>
        <Logo className="h-7" isDarkTheme={isDarkTheme} width={102} height={28} priority />
      </Link>
      {clicked && <ContextMenu points={points} data={data} isDarkTheme={isDarkTheme} />}
    </div>
  );
};

LogoLink.propTypes = {
  isDarkTheme: PropTypes.bool,
};

export default LogoLink;
