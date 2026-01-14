'use client';

import clsx from 'clsx';
import copyToClipboard from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from 'components/shared/button';
import CopiedIcon from 'icons/home/copied.inline.svg';
import CopyIcon from 'icons/home/copy.inline.svg';

const CopyCodeButton = ({ code = '' }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = () => {
    try {
      copyToClipboard(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (e) {
      setIsCopied(false);
    }
  };

  return (
    <Button
      className="group inline-flex w-[34.2%] items-center justify-between gap-x-3 !rounded-none !px-4 font-mono !font-medium hover:bg-[#F6FDFA] xl:w-[300px] lg:w-[36%] lg:!px-3 sm:w-full"
      theme="white-off-filled"
      size="new"
      onClick={handleCopyToClipboard}
    >
      <span className="text-gray-new-30">
        $ <span className="text-gray-new-8">{code}</span>
      </span>
      {isCopied ? (
        <CopiedIcon
          className={clsx(
            'text-gray-new-40 transition-colors duration-200 group-hover:text-black-pure',
            isCopied && 'text-black-pure'
          )}
          aria-hidden
        />
      ) : (
        <CopyIcon
          className={clsx(
            'text-gray-new-40 transition-colors duration-200 group-hover:text-black-pure',
            isCopied && 'text-black-pure'
          )}
          aria-hidden
        />
      )}
    </Button>
  );
};

CopyCodeButton.propTypes = {
  code: PropTypes.string.isRequired,
};

export default CopyCodeButton;
