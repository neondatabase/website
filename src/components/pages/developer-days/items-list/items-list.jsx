import clsx from 'clsx';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import Link from 'components/shared/link';
import ArrowIcon from 'icons/arrow-right.inline.svg';
import PlayIcon from 'icons/play.inline.svg';

const ItemsList = ({
  className = null,
  items,
  setIsOpenModal,
  isUpcoming = false,
  buttonText = null,
}) => (
  <div
    className={clsx(
      'absolute left-[38px] top-8 z-10 min-h-[520px] max-w-[330px] rounded-2xl px-5 pb-8 pt-7 lg:left-6 lg:top-6 lg:min-h-[442px] lg:max-w-[290px] lg:pb-7 lg:pt-6 md:static md:mx-auto md:-mt-2 md:min-h-0 md:max-w-none md:rounded-t-none',
      className
    )}
  >
    <Button
      className="w-full px-8 !text-lg lg:!text-base"
      theme="secondary"
      size="sm"
      style={{ boxShadow: '0px 10px 30px rgba(26, 26, 26, 0.6)' }}
      disabled={isUpcoming}
      onClick={() => {
        setIsOpenModal(true);
      }}
    >
      {!isUpcoming && (
        <PlayIcon className="mr-4 h-[22px] w-4 shrink-0 leading-none lg:h-4 lg:w-[11px] xs:mr-3" />
      )}
      <span>{buttonText}</span>
    </Button>
    <ul className="mt-7 lg:mt-6">
      {items.map(({ time, text, linkText, linkUrl }, index) => {
        const isExternal = linkUrl?.startsWith('http');

        return (
          <li
            className="flex flex-col border-t border-dashed border-black border-opacity-40 py-[18px] text-black last:pb-0 lg:py-5"
            key={index}
          >
            {linkUrl ? (
              <Link
                className="group"
                to={linkUrl}
                target={isExternal ? '_blank' : null}
                rel={isExternal ? 'noopener noreferrer' : null}
              >
                {time && (
                  <time className="text-sm leading-snug opacity-[0.85]" dateTime="2022-12-07">
                    {time}
                  </time>
                )}
                <p className="mt-1.5 text-xl font-semibold leading-[1.2] opacity-[85%] lg:text-lg">
                  {text}
                </p>
                <span className="mt-3.5 inline-flex items-center space-x-2 font-semibold leading-none lg:mt-2">
                  <span>{linkText}</span>
                  <ArrowIcon className="h-auto w-[18px] transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            ) : (
              <>
                <time className="text-sm leading-snug opacity-[0.85]" dateTime="2022-12-07">
                  {time}
                </time>
                <p className="mt-1.5 text-xl font-semibold leading-[1.2] opacity-[85%] lg:text-lg">
                  {text}
                </p>
                <span className="mt-3.5 font-semibold leading-none opacity-60 lg:mt-2">
                  {linkText}
                </span>
              </>
            )}
          </li>
        );
      })}
    </ul>
  </div>
);

ItemsList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string,
      text: PropTypes.string.isRequired,
      linkText: PropTypes.string.isRequired,
      linkUrl: PropTypes.string,
    })
  ).isRequired,
  setIsOpenModal: PropTypes.func.isRequired,
  isUpcoming: PropTypes.bool,
  buttonText: PropTypes.string,
};

export default ItemsList;
