'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';

import Button from 'components/shared/button';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import checkIcon from 'icons/pricing/table/check.svg';
import plusIcon from 'icons/pricing/table/plus.svg';
import statsIcon from 'icons/pricing/table/stats.svg';

import PLANS from '../data/plans.json';

import TableCell from './table-cell';
import TableHeading from './table-heading';

const ICONS = {
  plus: plusIcon,
  check: checkIcon,
  stats: statsIcon,
};

// Styles to set fixed height for table cells
const rowHeight = {
  1: 'h-[46px]',
  2: 'h-[70px]',
  3: 'h-[90px]',
  4: 'h-[110px]',
  5: 'h-[128px]',
  6: 'h-[180px]',
};

const mobileRowHeight = {
  2: 'md:h-[70px]',
};

const DEFAULT_ROWS_TO_SHOW = 8;

const Table = () => {
  const posthog = usePostHog();

  const labelList = PLANS.headings;
  const [currentRow, setCurrentRow] = useState('');
  const [tableRows, setTableRows] = useState(PLANS.cols.slice(0, DEFAULT_ROWS_TO_SHOW));

  useEffect(() => {
    if (window.location.hash === '#plans') {
      setTableRows(PLANS.cols);
    }
  }, []);

  useEffect(() => {
    const cells = document.querySelectorAll(`[data-row-id]`);
    const handlersMap = new Map();

    cells.forEach((cell) => {
      const rowId = cell.getAttribute('data-row-id') || '';
      const handleMouseEnter = () => setCurrentRow(rowId);
      const handleMouseLeave = () => setCurrentRow('');

      handlersMap.set(cell, { handleMouseEnter, handleMouseLeave });

      cell.addEventListener('mouseenter', handleMouseEnter);
      cell.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      cells.forEach((cell) => {
        const handlers = handlersMap.get(cell);
        if (handlers) {
          cell.removeEventListener('mouseenter', handlers.handleMouseEnter);
          cell.removeEventListener('mouseleave', handlers.handleMouseLeave);
        }
      });
    };
  }, [tableRows]);

  const isHiddenItems =
    PLANS.cols.length > DEFAULT_ROWS_TO_SHOW && tableRows.length <= DEFAULT_ROWS_TO_SHOW;

  const rowsWithGroupHeader = PLANS.cols.reduce((acc, item, index) => {
    if (item.feature?.groupHeader) {
      acc.push(index);
    }
    return acc;
  }, []);

  return (
    <div className="mx-auto flex max-w-[1216px] flex-col xl:max-w-none xl:px-8 xl:pr-0 md:pl-4">
      <ul className="no-scrollbars px-4.5 relative flex w-full xl:overflow-x-auto xl:pl-0 xl:pr-8 md:pr-5">
        {Object.keys(PLANS.headings).map((key, i, arr) => {
          const isHighlightedColumn = key === 'serverless';
          const isLabelsColumn = i === 0;

          return (
            <li
              className={clsx('relative py-5 lg:py-4', {
                'z-30 flex-1 bg-black-pure xl:sticky xl:left-0 xl:top-0 xl:min-w-[288px] xl:shadow-[8px_18px_20px_0px_rgba(5,5,5,.8)] lg:min-w-[268px] md:min-w-[220px]':
                  isLabelsColumn,
                'basis-[240px] last:basis-[208px] xl:shrink-0': !isLabelsColumn,
                'before:absolute before:inset-y-0 before:-left-6 before:z-0 before:w-[208px] before:rounded-md before:bg-pricing-table-featured-column lg:before:-left-5 lg:before:w-[196px]':
                  isHighlightedColumn,
                'xl:basis-[220px]': i === 0,
              })}
              key={key}
            >
              <TableHeading
                className={clsx(i === 1 && 'xl:ml-5')}
                planId={key}
                isLabelsColumn={isLabelsColumn}
                isFeaturedPlan={isHighlightedColumn}
                {...labelList[isLabelsColumn ? arr[1] : key]}
              />
              <ul className="relative z-10 flex w-full grow flex-col pt-[18px]">
                {tableRows.map((item, index) => {
                  const { rows = 1, mobileRows, feature } = item;
                  const featureTitle = feature?.title || feature;
                  const icon = feature?.icon && ICONS[feature.icon];

                  if (i === 0) {
                    const isGroupHeader = feature?.groupHeader;
                    return (
                      <li
                        className={clsx(
                          'relative flex flex-col text-balance transition-colors',
                          rowHeight[rows],
                          mobileRows && mobileRowHeight[mobileRows],
                          isHiddenItems &&
                            'last-of-type:border-b last-of-type:border-dashed last-of-type:border-gray-new-15',
                          isGroupHeader
                            ? 'justify-end pb-3.5 pr-3'
                            : 'border-t border-dashed border-gray-new-15 py-3 lg:py-2.5',
                          currentRow === index.toString() && !isGroupHeader
                            ? 'bg-gray-new-8 before:opacity-100 lg:bg-transparent'
                            : 'before:opacity-0',
                          i === 1 && 'xl:pl-5',
                          'before:absolute before:-inset-y-px before:-left-5 before:z-0 before:w-5 before:rounded-bl-lg before:rounded-tl-lg before:bg-gray-new-8 before:transition-opacity lg:before:hidden'
                        )}
                        data-row-id={index}
                        key={index}
                      >
                        {isGroupHeader ? (
                          <>
                            {icon && (
                              <Image
                                className="mb-2"
                                src={icon}
                                width={18}
                                height={18}
                                alt={featureTitle}
                              />
                            )}
                            <span className="text-lg font-medium leading-none tracking-extra-tight">
                              {featureTitle}
                            </span>
                            {feature?.subtitle && (
                              <span
                                className="mt-2 text-sm font-light leading-snug tracking-extra-tight text-gray-new-70"
                                dangerouslySetInnerHTML={{ __html: feature.subtitle }}
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <span
                              className="relative w-fit text-balance pr-5 leading-tight tracking-extra-tight lg:text-base md:pr-4"
                              dangerouslySetInnerHTML={{ __html: featureTitle }}
                            />
                            {feature?.subtitle && (
                              <span
                                className={clsx(
                                  'mt-1 text-balance pr-5 text-sm font-light leading-snug tracking-tight text-gray-new-50 md:pr-4',
                                  '[&_a]:border-b [&_a]:border-gray-new-50',
                                  '[&_a]:transition-colors [&_a]:duration-200',
                                  '[&_a:hover]:border-green-45 [&_a:hover]:text-green-45'
                                )}
                                dangerouslySetInnerHTML={{ __html: feature.subtitle }}
                              />
                            )}
                          </>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li
                      className={clsx(
                        'relative flex flex-col text-gray-new-90 transition-colors',
                        rowHeight[rows],
                        mobileRows && mobileRowHeight[mobileRows],
                        isHiddenItems &&
                          'last-of-type:border-b last-of-type:border-dashed last-of-type:border-gray-new-15',
                        !rowsWithGroupHeader.includes(index) && 'py-3 lg:py-2.5',
                        item[key] !== undefined && 'border-t border-dashed border-gray-new-15',
                        currentRow === index.toString() &&
                          !rowsWithGroupHeader.includes(index) &&
                          'bg-gray-new-8 before:opacity-100 lg:bg-transparent',
                        i === 1 && 'xl:pl-5',
                        i === arr.length - 1 &&
                          'before:absolute before:-inset-y-px before:-right-5 before:z-0 before:w-5 before:rounded-br-lg before:rounded-tr-lg before:bg-gray-new-8 before:opacity-0 before:transition-opacity lg:before:hidden'
                      )}
                      data-row-id={index}
                      key={index}
                    >
                      <div className="max-w-[160px]">
                        <TableCell item={item[key]} id={key} index={index} />
                      </div>
                    </li>
                  );
                })}
              </ul>
              {i > 0 && !isHiddenItems && (
                <Button
                  className={clsx(
                    'relative z-20 mt-8 h-10 w-full max-w-[160px] tracking-tight 2xl:!text-base xl:mt-6 xl:h-9 lg:max-w-[156px]',
                    i === 1 && 'xl:ml-5',
                    isHighlightedColumn ? '!font-semibold' : 'bg-opacity-80 !font-medium'
                  )}
                  size="xs"
                  theme={isHighlightedColumn ? 'primary' : 'gray-15'}
                  to={labelList[key].buttonUrl}
                  tagName={`Details Table Bottom > ${labelList[key].label}`}
                  onClick={() => {
                    posthog.capture('ui_interaction', {
                      action: 'pricing_page_get_started_clicked',
                      plan: key,
                      place: 'table_footer',
                    });
                  }}
                >
                  {labelList[key].buttonText}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {isHiddenItems && (
        <Button
          className="mx-auto mt-6 h-[38px] rounded-full px-5 text-[15px] font-medium transition-colors duration-200 sm:-translate-x-2.5"
          theme="gray-10"
          onClick={() => setTableRows(PLANS.cols)}
        >
          Show more
          <ChevronIcon className="ml-2.5 inline-block h-auto w-3" />
        </Button>
      )}
    </div>
  );
};

export default Table;
