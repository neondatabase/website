'use client';

import clsx from 'clsx';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';

import Button from 'components/shared/button';
import ChevronIcon from 'icons/chevron-down.inline.svg';

import PLANS from '../data/plans.json';

import TableCell from './table-cell';
import TableHeading from './table-heading';

// Styles to set fixed height for table cells
const rowHeight = {
  1: 'h-12',
  2: 'h-[70px]',
  3: 'h-[90px]',
  4: 'h-[110px]',
  6: 'h-[180px]',
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

    cells.forEach((cell) => {
      const rowId = cell.getAttribute('data-row-id') || '';

      cell.addEventListener('mouseenter', () => setCurrentRow(rowId));
      cell.addEventListener('mouseleave', () => setCurrentRow(''));
    });

    return () => {
      cells.forEach((cell) => {
        const rowId = cell.getAttribute('data-row-id') || '';

        cell.removeEventListener('mouseenter', () => setCurrentRow(rowId));
        cell.removeEventListener('mouseleave', () => setCurrentRow(''));
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
    <div className="mx-auto flex max-w-[1216px] flex-col xl:max-w-none xl:px-8 lg:pr-0 md:pl-5">
      <ul className="no-scrollbars px-4.5 relative flex w-full lg:overflow-x-auto lg:pl-0 lg:pr-8 md:pr-5">
        {Object.keys(PLANS.headings).map((key, i, arr) => {
          const isHighlightedColumn = key === 'serverless';
          const isLabelsColumn = i === 0;

          return (
            <li
              className={clsx('relative py-5 xl:py-4', {
                'z-30 flex-1 bg-black-pure lg:sticky lg:left-0 lg:top-0 lg:min-w-[200px] lg:shadow-[8px_18px_20px_0px_rgba(5,5,5,.8)]':
                  isLabelsColumn,
                'basis-[240px] last:basis-[208px] xl:basis-[19%] xl:last:basis-[160px] lg:shrink-0 lg:basis-[200px]':
                  !isLabelsColumn,
                'before:absolute before:inset-y-0 before:-left-6 before:z-0 before:w-[208px] before:rounded-md before:bg-pricing-table-featured-column xl:before:-left-3 xl:before:w-[180px] lg:before:-left-5 lg:before:w-[196px]':
                  isHighlightedColumn,
                'lg:basis-[220px]': i === 1,
              })}
              key={key}
            >
              <TableHeading
                className={clsx(i === 1 && 'lg:ml-5')}
                planId={key}
                isLabelsColumn={isLabelsColumn}
                isFeaturedPlan={isHighlightedColumn}
                {...labelList[isLabelsColumn ? arr[1] : key]}
              />
              <ul className="relative z-10 flex w-full grow flex-col">
                {tableRows.map((item, index) => {
                  const { rows = 1, feature } = item;
                  const featureTitle = feature?.title || feature;

                  if (i === 0) {
                    const isGroupHeader = feature?.groupHeader;
                    return (
                      <li
                        className={clsx(
                          'relative flex flex-col transition-colors',
                          rowHeight[rows],
                          isHiddenItems &&
                            'last-of-type:border-b last-of-type:border-dashed last-of-type:border-gray-new-15',
                          isGroupHeader
                            ? 'justify-end pb-3.5'
                            : 'border-t border-dashed border-gray-new-15 py-3 lg:py-2.5',
                          i === 1 && 'lg:pl-5',
                          currentRow === index.toString() && !isGroupHeader
                            ? 'bg-gray-new-8 before:opacity-100 lg:bg-transparent'
                            : 'before:opacity-0',
                          'before:absolute before:inset-y-0 before:-left-5 before:z-0 before:w-5 before:rounded-bl-lg before:rounded-tl-lg before:bg-gray-new-8 before:transition-opacity lg:before:hidden'
                        )}
                        data-row-id={index}
                        key={index}
                      >
                        {isGroupHeader ? (
                          <>
                            <span className="text-[13px] font-medium uppercase leading-none tracking-wide text-gray-new-80 lg:text-xs">
                              {featureTitle}
                            </span>
                            {feature?.subtitle && (
                              <span className="mt-1.5 text-sm font-light leading-snug tracking-tight text-gray-new-60">
                                {feature.subtitle}
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <span
                              className="relative w-fit text-balance pr-5 text-lg leading-tight tracking-extra-tight lg:text-base"
                              dangerouslySetInnerHTML={{ __html: featureTitle }}
                            />
                            {feature?.subtitle && (
                              <span
                                className={clsx(
                                  'mt-1 text-balance pr-5 text-sm font-light leading-snug tracking-tight text-gray-new-60',
                                  '[&_a]:border-b [&_a]:border-gray-new-60',
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
                        'relative flex flex-col transition-colors',
                        rowHeight[rows],
                        isHiddenItems &&
                          'last-of-type:border-b last-of-type:border-dashed last-of-type:border-gray-new-15',
                        !rowsWithGroupHeader.includes(index) && 'py-3 lg:py-2.5',
                        item[key] !== undefined && 'border-t border-dashed border-gray-new-15',
                        currentRow === index.toString() &&
                          !rowsWithGroupHeader.includes(index) &&
                          'bg-gray-new-8 before:opacity-100 lg:bg-transparent',
                        i === arr.length - 1 &&
                          'before:absolute before:inset-y-0 before:-right-5 before:z-0 before:w-5 before:rounded-br-lg before:rounded-tr-lg before:bg-gray-new-8 before:opacity-0 before:transition-opacity lg:before:hidden'
                      )}
                      data-row-id={index}
                      key={index}
                    >
                      <div className={clsx('max-w-[160px] lg:max-w-[156px]', i === 1 && 'lg:ml-5')}>
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
                    i === 1 && 'lg:ml-5',
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
          className="mx-auto mt-6 h-[38px] rounded-full px-5 text-[15px] font-medium transition-colors duration-200"
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
