'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import XIcon from 'icons/x-icon.inline.svg';

const objectToGetParams = (object) => {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return params.length > 0 ? `?${params.join('&')}` : '';
};

const getBoxPositionOnWindowCenter = (width, height) => ({
  left: window.outerWidth / 2 + (window.screenX || window.screenLeft || 0) - width / 2,
  top: window.outerHeight / 2 + (window.screenY || window.screenTop || 0) - height / 2,
});

const windowOpen = (url, { width, height, ...configRest }) => {
  const config = {
    width,
    height,
    location: 'no',
    toolbar: 'no',
    status: 'no',
    directories: 'no',
    menubar: 'no',
    scrollbars: 'yes',
    resizable: 'no',
    centerscreen: 'yes',
    chrome: 'yes',
    ...configRest,
  };

  return window.open(
    url,
    '',
    Object.keys(config)
      .map((key) => `${key}=${config[key]}`)
      .join(', ')
  );
};

const TwitterShareButton = ({
  url,
  shareText,
  children = null,
  iconSize = 'default',
  className: additionalClassName = null,
}) => {
  const handleTwitterShare = (event) => {
    const link = `https://twitter.com/intent/tweet${objectToGetParams({
      url,
      text: shareText,
    })}`;

    const windowConfig = {
      width: 550,
      height: 400,
      ...getBoxPositionOnWindowCenter(550, 400),
    };

    event.preventDefault();

    windowOpen(link, windowConfig);
  };

  return (
    <button
      className={clsx(
        'relative flex items-center justify-center gap-3.5 whitespace-nowrap rounded-md px-6 py-[18px] pr-7 font-sans text-xl font-medium leading-none tracking-[-0.02em] text-white transition duration-200 lg:px-8 sm:text-base xs:px-3 xs:py-2',
        additionalClassName
      )}
      type="button"
      onClick={handleTwitterShare}
    >
      <XIcon className={clsx('shrink-0', iconSize === 'default' ? 'h-[26px]' : 'h-[14px]')} />
      <span>{children}</span>
    </button>
  );
};

TwitterShareButton.propTypes = {
  shareText: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  iconSize: PropTypes.oneOf(['small', 'default']),
};

export default TwitterShareButton;
