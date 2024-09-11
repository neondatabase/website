'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import CopyIcon from 'icons/copy.inline.svg';

import TwitterShareButton from './twitter-share-button';

const SocialShare = ({ className = null, url }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  return (
    <div
      className={clsx(
        'pointer-events-none relative z-50 flex items-center xl:justify-center md:flex-col md:gap-y-3.5',
        className
      )}
    >
      <div className="pointer-events-auto flex gap-6 lg:gap-3.5">
        <TwitterShareButton
          className="social-share shadow-social"
          url={url}
          shareText="Just got my ticket to @neondatabase Developer Days. Claim yours!"
        >
          Post
        </TwitterShareButton>
        <button
          className={clsx(
            'social-share relative flex items-center justify-center gap-3.5 whitespace-nowrap rounded-md px-6 py-[18px] pr-7 font-sans text-xl font-medium leading-none tracking-[-0.02em] text-white shadow-social transition duration-200 lg:px-8 xs:px-3 xs:py-2',
            isCopied && 'pointer-events-none'
          )}
          type="button"
          disabled={isCopied}
          onClick={() => handleCopy(url)}
        >
          <CopyIcon className="h-[26px] shrink-0" aria-hidden />
          <p className="min-w-[82px] font-sans text-xl font-medium leading-none tracking-[-0.02em] text-white sm:text-base">
            {isCopied ? 'Copied!' : 'Copy link'}
          </p>
        </button>
      </div>
      {/* <h2 className="ml-6 shrink-0 font-sans text-sm leading-[1.375] tracking-[0.04em] text-gray-5 flat-none md:flat-breaks md:ml-0 text-start">
        Share with <br /> your friends
      </h2> */}
    </div>
  );
};

SocialShare.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string.isRequired,
};

export default SocialShare;
