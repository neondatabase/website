'use client';

import clsx from 'clsx';
import { useFeatureFlagVariantKey } from 'posthog-js/react';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import Button from 'components/shared/button';
import InfoIcon from 'components/shared/info-icon';
import Tooltip from 'components/shared/tooltip';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import checkIcon from 'icons/pricing/check.svg';

import tableDataOriginal from '../data/plans.json';

// Styles to set fixed height for table cells
const rowClass = {
  1: 'h-[47px]',
  2: 'h-[70px] lg:h-[82px]',
  3: 'h-[90px] lg:h-[90px]',
};

const DEFAULT_ROWS_TO_SHOW = 8;

const TableHeading = ({
  className,
  label,
  price,
  buttonUrl,
  buttonText,
  isLabelsColumn,
  isFeaturedPlan,
}) => {
  // placeholder for the labels column
  if (isLabelsColumn) {
    return <div className="invisible h-[120px]" aria-hidden />;
  }

  return (
    <div className={clsx('relative z-10 h-[120px] w-40 xl:w-[156px]', className)}>
      <h3
        className={clsx(
          isFeaturedPlan && 'text-green-45',
          'text-2xl font-medium leading-none tracking-extra-tight md:text-xl'
        )}
      >
        {label}
      </h3>
      <span
        className="mt-3 block leading-snug tracking-extra-tight [&_span]:tracking-extra-tight [&_span]:text-gray-new-70"
        dangerouslySetInnerHTML={{ __html: price }}
      />
      <Button
        className={clsx(
          'mt-5 h-10 w-full !font-medium tracking-tight md:h-8',
          !isFeaturedPlan && 'bg-opacity-80'
        )}
        size="xs"
        theme={isFeaturedPlan ? 'primary' : 'gray-15'}
        to={buttonUrl}
        tag_name={`Details Table Top > ${label}`}
      >
        {buttonText}
      </Button>
    </div>
  );
};

TableHeading.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  isLabelsColumn: PropTypes.bool.isRequired,
  isFeaturedPlan: PropTypes.bool.isRequired,
};

const getColumnAlignment = (item) => {
  const keys = Object.keys(item);
  if (item.rows === 1 || keys.some((key) => typeof item[key] === 'boolean')) {
    return 'justify-center';
  }

  return 'justify-start';
};

const Table = () => {
  const isComputePriceRaised =
    useFeatureFlagVariantKey('website_growth_compute_price_rising') === 'show_0_24';

  const tableData = useMemo(() => {
    if (isComputePriceRaised) {
      return {
        ...tableDataOriginal,
        cols: tableDataOriginal.cols.map((col) => {
          if (col.feature.title === 'Compute hours') {
            const updatedCol = { ...col };

            for (const [key, value] of Object.entries(col)) {
              if (value.info === 'Additional at $0.16 per compute hour') {
                updatedCol[key] = {
                  ...value,
                  info: 'Additional at $0.24 per compute hour',
                };
              }
            }

            return updatedCol;
          }
          return col;
        }),
      };
    }

    return tableDataOriginal;
  }, [isComputePriceRaised]);

  const labelList = tableData.headings;
  const [currentRow, setCurrentRow] = useState('');
  const [tableRows, setTableRows] = useState(tableData.cols.slice(0, DEFAULT_ROWS_TO_SHOW));

  useEffect(() => {
    if (window.location.hash === '#plans') {
      setTableRows(tableData.cols);
    }
  }, [tableData.cols]);

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
    tableData.cols.length > DEFAULT_ROWS_TO_SHOW && tableRows.length <= DEFAULT_ROWS_TO_SHOW;

  const rowsWithGroupTitles = useMemo(
    () =>
      tableData.cols.reduce((acc, item, index) => {
        if (typeof item.feature === 'string') {
          acc.push(index);
        }
        return acc;
      }, []),
    [tableData.cols]
  );

  return (
    <div className="mx-auto flex max-w-[1216px] flex-col xl:max-w-none xl:px-8 lg:pr-0 md:pl-5">
      <ul className="no-scrollbars px-4.5 relative flex w-full lg:overflow-x-auto lg:pl-0 lg:pr-8 md:pr-5">
        {Object.keys(tableData.headings).map((key, i, arr) => {
          const isHighlightedColumn = key === 'launch';
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
                isLabelsColumn={isLabelsColumn}
                isFeaturedPlan={isHighlightedColumn}
                {...labelList[isLabelsColumn ? arr[1] : key]}
              />
              <ul className="relative z-10 flex w-full grow flex-col">
                {tableRows.map((item, index) => {
                  if (i === 0) {
                    const isGroupTitle = typeof item[key] === 'string';
                    return (
                      <li
                        className={clsx(
                          'relative flex flex-col transition-colors',
                          getColumnAlignment(item),
                          isHiddenItems &&
                            'last-of-type:border-b last-of-type:border-dashed last-of-type:border-gray-new-15',
                          isGroupTitle
                            ? 'h-[70px] justify-end pb-3.5 lg:h-[66px]'
                            : ['py-3 lg:py-2.5', rowClass[item.rows]],
                          !isGroupTitle &&
                            !rowsWithGroupTitles.includes(index - 1) &&
                            'border-t border-dashed border-gray-new-15',
                          i === 1 && 'lg:pl-5',
                          currentRow === index.toString() && !isGroupTitle
                            ? 'bg-gray-new-8 before:opacity-100 lg:bg-transparent'
                            : 'before:opacity-0',
                          'before:absolute before:-inset-y-px before:-left-5 before:z-0 before:w-5 before:rounded-bl-lg before:rounded-tl-lg before:bg-gray-new-8 before:transition-opacity lg:before:hidden'
                        )}
                        data-row-id={index}
                        key={index}
                      >
                        {isGroupTitle ? (
                          <span className="whitespace-nowrap text-[13px] font-medium uppercase leading-none tracking-wide text-gray-new-50 lg:text-xs">
                            {item[key]}
                          </span>
                        ) : (
                          <>
                            <span className="relative w-fit text-lg leading-tight tracking-extra-tight lg:text-base">
                              {item[key].title}
                              {!!item.soon && (
                                <span className="relative -top-0.5 ml-4 inline-block rounded-full bg-yellow-70/10 px-2.5 py-[5px] text-[10px] font-semibold uppercase leading-none tracking-wide text-gray-new-50 xl:ml-2.5 xl:px-1.5 xl:py-1 xl:text-[8px]">
                                  soon
                                </span>
                              )}
                            </span>
                            {item[key]?.subtitle && (
                              <span
                                className="mt-1 text-sm font-light leading-snug tracking-tight text-gray-new-70"
                                dangerouslySetInnerHTML={{ __html: item[key].subtitle }}
                              />
                            )}
                          </>
                        )}
                      </li>
                    );
                  }

                  let cell;
                  if (typeof item[key] === 'boolean') {
                    cell = item[key] ? (
                      <img
                        src={checkIcon}
                        width="24"
                        height="24"
                        alt=""
                        loading="lazy"
                        aria-label={`${item.feature.title} included`}
                      />
                    ) : (
                      <span
                        className="inline-block h-px w-4 rounded-full bg-gray-new-30"
                        aria-label={`${item.feature.title} not included`}
                      />
                    );
                  } else if (typeof item[key] === 'object') {
                    const { title, info } = item[key];
                    cell = (
                      <div className="font-light leading-snug tracking-extra-tight">
                        {title}
                        {info && (
                          <span className="whitespace-nowrap">
                            &nbsp;
                            <InfoIcon
                              className="relative top-0.5 ml-0.5 inline-block"
                              tooltip={info}
                              tooltipId={`${key}_tooltip_${index}`}
                            />
                          </span>
                        )}
                      </div>
                    );
                  } else {
                    cell = (
                      <span
                        className="flex flex-col gap-y-1 font-light leading-snug tracking-extra-tight [&_span]:text-sm [&_span]:text-gray-new-60"
                        data-tooltip-id={item[`${key}_tooltip`] && `${key}_tooltip_${index}`}
                        data-tooltip-html={item[`${key}_tooltip`] && item[`${key}_tooltip`]}
                        dangerouslySetInnerHTML={{ __html: item[key] }}
                      />
                    );
                  }

                  return (
                    <li
                      className={clsx(
                        'relative flex flex-col transition-colors',
                        getColumnAlignment(item),
                        isHiddenItems &&
                          'last-of-type:border-b last-of-type:border-dashed last-of-type:border-gray-new-15',
                        rowsWithGroupTitles.includes(index)
                          ? 'h-[70px] lg:h-[66px]'
                          : ['py-3 lg:py-2.5', rowClass[item.rows]],
                        item[key] !== undefined &&
                          !rowsWithGroupTitles.includes(index - 1) &&
                          'border-t border-dashed border-gray-new-15',
                        currentRow === index.toString() &&
                          !rowsWithGroupTitles.includes(index) &&
                          'bg-gray-new-8 before:opacity-100 lg:bg-transparent',
                        i === arr.length - 1 &&
                          'before:absolute before:-inset-y-px before:-right-5 before:z-0 before:w-5 before:rounded-br-lg before:rounded-tr-lg before:bg-gray-new-8 before:opacity-0 before:transition-opacity lg:before:hidden'
                      )}
                      data-row-id={index}
                      key={index}
                    >
                      <div className={clsx('max-w-[160px] lg:max-w-[156px]', i === 1 && 'lg:ml-5')}>
                        {cell}
                        {item[`${key}_tooltip`] && (
                          <Tooltip className="w-sm z-20" id={`${key}_tooltip_${index}`} />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {i > 0 && !isHiddenItems && (
                <Button
                  className={clsx(
                    'relative z-20 mt-8 h-10 w-full max-w-[160px] !font-medium tracking-tight 2xl:!text-base xl:mt-6 xl:h-9 lg:max-w-[156px]',
                    i === 1 && 'lg:ml-5',
                    !isHighlightedColumn && 'bg-opacity-80'
                  )}
                  size="xs"
                  theme={isHighlightedColumn ? 'primary' : 'gray-15'}
                  to={labelList[key].buttonUrl}
                  tag_name={`Details Table Bottom > ${labelList[key].label}`}
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
          onClick={() => setTableRows(tableData.cols)}
        >
          Show more
          <ChevronIcon className="ml-2.5 inline-block h-auto w-3" />
        </Button>
      )}
    </div>
  );
};

export default Table;
