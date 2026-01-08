import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import HashIcon from 'components/shared/anchor-heading/images/hash.inline.svg';

const TwoColumnLayout = ({ children }) => (
  <ol
    className="two-column-layout !mt-0 inline-flex w-full flex-col !pl-0"
    style={{
      counterReset: 'section',
    }}
  >
    {React.Children.map(children, (child, index) => React.cloneElement(child, { index }))}
  </ol>
);

TwoColumnLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const TwoColumnStep = ({ title, children }) => (
  <li
    className={clsx(
      'two-column-step relative !mb-0 !mt-12 flex gap-4 !pl-0',
      'after:absolute after:-bottom-[34px] after:left-[11px] after:top-[34px] after:w-px after:bg-gray-new-90',
      'first:!mt-7 last:after:bottom-0',
      'dark:after:bg-gray-new-20'
    )}
  >
    {/* Step number badge */}
    <div
      className={clsx(
        'flex size-6 shrink-0 items-center justify-center rounded-full border border-gray-new-80',
        'text-sm leading-none tracking-extra-tight text-gray-new-40',
        'before:content-[counter(section)] before:[counter-increment:section]',
        'dark:border-gray-new-30 dark:text-gray-new-70'
      )}
    />

    <div className="w-full">
      {title && (
        <h3 className="col-span-2 !mb-3 !mt-0 text-xl font-semibold leading-tight tracking-extra-tight">
          {title}
        </h3>
      )}

      {/* Content grid */}
      <div className="grid flex-1 grid-cols-2 gap-x-6 xl:grid-cols-1 xl:gap-x-0 xl:gap-y-6">
        {children}
      </div>
    </div>
  </li>
);

TwoColumnStep.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const TwoColumnItem = ({ title, method, id, children }) => (
  <li className="two-column-item relative !mb-0 !mt-12 block !pl-0">
    {title && (
      <>
        <h2
          id={id}
          className="anchor-heading group relative !mb-1 !mt-0 w-fit scroll-mt-20 text-2xl font-semibold leading-tight tracking-extra-tight lg:scroll-mt-5"
        >
          <span>{title}</span>
          {id && (
            <a
              className="px-2 no-underline opacity-0 transition-opacity duration-200 hover:border-none hover:opacity-100 group-hover:opacity-100 sm:hidden"
              href={`#${id}`}
              aria-label={`Link to ${title}`}
            >
              <HashIcon className="inline w-3.5 text-green-45" />
            </a>
          )}
        </h2>
        {method && (
          <div className="mb-4 mt-2 flex flex-wrap gap-2">
            {method.split(',').map((m, index) => (
              <span
                key={index}
                className="inline-block rounded border border-gray-new-70 bg-gray-new-94 px-2.5 py-1 font-mono text-xs font-medium leading-normal text-gray-new-30 dark:border-gray-new-30 dark:bg-gray-new-15 dark:text-gray-new-60"
              >
                {m.trim()}
              </span>
            ))}
          </div>
        )}
      </>
    )}
    {/* Content grid */}
    <div className="grid flex-1 grid-cols-2 gap-x-6 xl:grid-cols-1 xl:gap-x-0 xl:gap-y-6">
      {children}
    </div>
  </li>
);

TwoColumnItem.propTypes = {
  title: PropTypes.string,
  method: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const TwoColumnBlock = ({ label, children }) => (
  <div className="flex flex-col items-start gap-2">
    {label && (
      <div className="inline-block rounded border border-gray-new-70 bg-gray-new-94 px-2 py-0.5 text-[11px] font-medium text-gray-new-30 dark:border-gray-new-30 dark:bg-gray-new-15 dark:text-gray-new-60">
        {label}
      </div>
    )}
    <div className="size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_img]:!m-0">
      {children}
    </div>
  </div>
);

TwoColumnBlock.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const TwoColumnFooter = ({ children }) => (
  <div className="col-span-2 xl:col-span-1">{children}</div>
);

TwoColumnFooter.propTypes = {
  children: PropTypes.node.isRequired,
};

// Attach sub-components
TwoColumnLayout.Step = TwoColumnStep;
TwoColumnLayout.Item = TwoColumnItem;
TwoColumnLayout.Block = TwoColumnBlock;
TwoColumnLayout.Footer = TwoColumnFooter;

export default TwoColumnLayout;
