import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import Button from 'components/shared/button';
import Link from 'components/shared/link';
import ArrowIcon from 'icons/arrow-right.inline.svg';
import PlayIcon from 'icons/play.inline.svg';

const ItemsList = ({ className, items, setIsOpenModal }) => (
  <div
    className={clsx(
      'absolute top-8 left-[38px] min-h-[520px] max-w-[330px] rounded-2xl px-5 pt-7 pb-8 lg:top-6 lg:left-6 lg:min-h-[442px] lg:max-w-[290px] lg:pb-7 lg:pt-6 md:static md:mx-auto md:-mt-2 md:min-h-0 md:w-[85%] md:max-w-none md:rounded-t-none',
      className
    )}
  >
    <Button
      className="w-full px-8 !text-lg lg:!text-base"
      theme="secondary"
      size="sm"
      style={{ boxShadow: '0px 10px 30px rgba(26, 26, 26, 0.6)' }}
      onClick={() => {
        setIsOpenModal(true);
      }}
    >
      <PlayIcon className="mr-4 h-[22px] w-4 shrink-0 leading-none lg:h-4 lg:w-[11px] xs:mr-3" />
      <span>Watch broadcast</span>
    </Button>
    <ul className="mt-7 lg:mt-6">
      {items.map(({ text, linkText, linkUrl }, index) => (
        <li
          className="group flex flex-col border-t border-dashed border-black border-opacity-40 py-6 text-black last:pb-0 lg:py-5"
          key={index}
        >
          {linkUrl ? (
            <Link to={linkUrl}>
              <p className="text-lg font-semibold leading-snug opacity-[85%] lg:text-base">
                {text}
              </p>
              <span className="mt-3.5 inline-flex items-center space-x-2 font-semibold leading-none lg:mt-2">
                <span>{linkText}</span>
                <ArrowIcon className="h-auto w-[18px] transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          ) : (
            <div>
              <p className="text-lg font-semibold leading-snug opacity-[85%] lg:text-base">
                {text}
              </p>
              <span className="mt-3.5 inline-flex items-center space-x-2 font-semibold leading-none opacity-60 lg:mt-2">
                {linkText}
              </span>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
);

ItemsList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      linkText: PropTypes.string.isRequired,
      linkUrl: PropTypes.string,
    })
  ).isRequired,
  setIsOpenModal: PropTypes.func.isRequired,
};

ItemsList.defaultProps = {
  className: null,
};

export default ItemsList;
