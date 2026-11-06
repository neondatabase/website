'use client';

import PropTypes from 'prop-types';

import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import CopiedIcon from 'icons/home/copied.inline.svg';
import { cn } from 'utils/cn';

import { strongBorder } from './docs-home-tokens';
import IndexCopyIcon from './images/index-copy.inline.svg';

// Agent-file URL presented as a code line with a separate icon-only copy button.
const DocsHomeCopyChip = ({ label, url }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(1400);
  return (
    <div className="py-2">
      <div
        className={cn(
          'flex min-h-15 min-w-0 items-center justify-between gap-5 rounded-none border bg-white px-[15px] dark:bg-gray-new-8',
          strongBorder
        )}
      >
        <code className="min-w-0 font-mono text-sm leading-[21px] tracking-[-0.02em] break-all text-[#8458D0] dark:text-green-52">
          {label}
        </code>
        <button
          type="button"
          onClick={() => handleCopy(url)}
          aria-label={isCopied ? `Copied ${url}` : `Copy ${url}`}
          title={isCopied ? 'Copied' : 'Copy'}
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-none border text-gray-new-40 transition-colors hover:border-gray-new-60 dark:text-gray-new-70 dark:hover:border-gray-new-40',
            strongBorder
          )}
        >
          {isCopied ? (
            <CopiedIcon className="size-3.5" aria-hidden />
          ) : (
            <IndexCopyIcon className="dark:[&_[stroke]]:stroke-gray-new-70" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
};

DocsHomeCopyChip.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default DocsHomeCopyChip;
