'use client';

import PropTypes from 'prop-types';

import CheckIcon from 'components/shared/code-block-wrapper/images/check.inline.svg';
import CopyIcon from 'components/shared/code-block-wrapper/images/copy.inline.svg';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import { cn } from 'utils/cn';

import Section from '../section';

const colors = [
  {
    name: 'Neon Green',
    hex: '#34D59A',
    className: 'bg-green-52 text-black-pure',
  },
  {
    name: 'Black',
    hex: '#000000',
    className: 'border border-gray-new-30 bg-black-pure text-white',
  },
  {
    name: 'Off-White',
    hex: '#E4F1EB',
    className: 'bg-[#E4F1EB] text-black-pure',
  },
];

const Color = ({ name, hex, className }) => {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  return (
    <li className={cn('group relative flex h-[180px] flex-col justify-end p-4', className)}>
      <span className="flex flex-col gap-px text-sm leading-snug tracking-extra-tight">
        <span>{name}</span>
        <span>{hex}</span>
      </span>
      <div
        className={cn(
          'absolute top-2.5 right-2.5',
          'opacity-0 transition-opacity duration-300',
          'group-hover:opacity-100 focus-within:opacity-100 lg:opacity-100'
        )}
      >
        <button
          className={cn(
            'flex size-7 items-center justify-center border',
            'border-gray-new-30 bg-gray-new-8 text-gray-new-94',
            'transition-colors duration-200 hover:bg-gray-new-15'
          )}
          type="button"
          aria-label={isCopied ? 'Copied' : `Copy ${name} hex code`}
          disabled={isCopied}
          onClick={() => handleCopy(hex)}
        >
          {isCopied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        </button>
      </div>
    </li>
  );
};

Color.propTypes = {
  name: PropTypes.string.isRequired,
  hex: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const Colors = () => (
  <Section
    title="Colors"
    description="The Neon colors keep Neon Green as a primary color and pair it with a neutral black-and-white duo for a clean, high-contrast style."
    className="mb-40 xl:mb-32 lg:mb-28 md:mb-[88px]"
  >
    <ul className="grid grid-cols-3 gap-4 sm:grid-cols-1">
      {colors.map((color) => (
        <Color {...color} key={color.hex} />
      ))}
    </ul>
  </Section>
);

export default Colors;
