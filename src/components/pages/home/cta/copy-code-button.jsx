'use client';

import copyToClipboard from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from 'components/shared/button';
import CopiedIcon from 'icons/home/copied.inline.svg';
import CopyIcon from 'icons/home/copy.inline.svg';

const CopyCodeButton = ({ className, code = '', copyText = code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = () => {
    try {
      copyToClipboard(copyText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (e) {
      setIsCopied(false);
    }
  };

  return (
    <Button className={className} theme="green-filled" size="new" onClick={handleCopyToClipboard}>
      $ {code}
      {isCopied ? (
        <CopiedIcon className="text-gray-new-20" aria-hidden />
      ) : (
        <CopyIcon className="text-gray-new-20" aria-hidden />
      )}
    </Button>
  );
};

CopyCodeButton.propTypes = {
  className: PropTypes.string,
  code: PropTypes.string.isRequired,
  copyText: PropTypes.string,
};

export default CopyCodeButton;
