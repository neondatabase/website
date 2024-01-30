'use client';

import clsx from 'clsx';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { useState } from 'react';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';

const CodeTabs = ({ items, highlightedCodeSnippets }) => {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <div className="col-span-6 col-start-1 row-start-1 max-w-[716px] pt-[71px] 2xl:-mr-8 2xl:pt-12 xl:hidden">
      <div className="flex gap-x-2.5 xs:gap-x-1.5">
        {items.map(({ name }, index) => (
          <button
            className={clsx(
              'relative rounded-t-md border-[5px] border-b-0 border-[#333] px-[15px] py-3 font-mono text-sm font-bold uppercase leading-none transition-colors duration-200 after:transition-colors after:duration-200',
              index === activeItem
                ? 'text-green-45 after:absolute after:inset-x-0 after:bottom-[-6px] after:z-10 after:h-[6px] after:bg-black'
                : 'bg-[#333] text-white hover:text-green-45'
            )}
            type="button"
            key={index}
            onClick={() => setActiveItem(index)}
          >
            {name}
          </button>
        ))}
      </div>
      <CodeBlockWrapper className="dark prose max-w-none rounded-b-md rounded-tr-md border-[5px] border-[#333] 2xl:rounded-tr-none sm:border-[3px] [&_code]:!text-[15px] [&_pre]:my-0 [&_pre]:!bg-black [&_pre]:px-0 [&_pre]:pb-5 [&_pre]:pt-7">
        {parse(highlightedCodeSnippets[activeItem])}
      </CodeBlockWrapper>
    </div>
  );
};

CodeTabs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      language: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    })
  ).isRequired,
  highlightedCodeSnippets: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CodeTabs;
