'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import Button from 'components/shared/button';
import InfoIcon from 'components/shared/info-icon';
import Tooltip from 'components/shared/tooltip';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import CheckIcon from 'icons/pricing/check.inline.svg';

import tableData from '../data/plans.json';

// Styles to set fixed height for table cells
const rowClass = {
  1: 'h-[49px]',
  2: 'h-[72px] lg:h-[82px]',
  3: 'h-[94px] lg:h-[90px]',
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
    return (
      <div className="invisible" aria-hidden>
        <span
          className="block text-2xl font-medium leading-none tracking-tight after:pointer-events-none after:content-[attr(data-label)] 2xl:text-xl"
          data-label={label}
        />
        <span
          className="mt-3 block text-lg leading-snug tracking-extra-tight [&_span]:tracking-extra-tight [&_span]:text-gray-new-70"
          dangerouslySetInnerHTML={{ __html: price }}
        />
        <span className="mt-5 block h-10 md:h-8" />
      </div>
    );
  }

  return (
    <div className={clsx('relative z-10 w-40 xl:w-[156px]', className)}>
      <h3
        className={clsx(
          isFeaturedPlan && 'text-green-45',
          'text-2xl font-medium leading-none tracking-extra-tight md:text-xl'
        )}
      >
        {label}
      </h3>
      <span
        className="mt-3 block text-lg leading-snug tracking-extra-tight [&_span]:tracking-extra-tight [&_span]:text-gray-new-70"
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
  const labelList = tableData.headings;
  const [currentRow, setCurrentRow] = useState('');
  const [tableRows, setTableRows] = useState(tableData.cols.slice(0, DEFAULT_ROWS_TO_SHOW));

  useEffect(() => {
    if (window.location.hash === '#plans') {
      setTableRows(tableData.cols);
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
    tableData.cols.length > DEFAULT_ROWS_TO_SHOW && tableRows.length <= DEFAULT_ROWS_TO_SHOW;

  const rowsWithGroupTitles = useMemo(
    () =>
      tableData.cols.reduce((acc, item, index) => {
        if (typeof item.feature === 'string') {
          acc.push(index);
        }
        return acc;
      }, []),
    []
  );

  return (
    <div className="mx-auto flex max-w-[1216px] flex-col xl:max-w-none xl:px-8 lg:pr-0 md:pl-5">
      <ul
        className={clsx(
          'scrollbar-hidden px-4.5 relative flex w-full lg:overflow-x-auto lg:pl-0 lg:pr-8 md:pr-5',
          isHiddenItems &&
            'after:absolute after:inset-x-0 after:bottom-0 after:h-1.5 after:bg-black-pure'
        )}
      >
        {Object.keys(tableData.headings).map((key, i, arr) => {
          const isHighlightedColumn = key === 'launch';
          const isLabelsColumn = i === 0;

          return (
            <li
              className={clsx('relative py-5 xl:py-4', {
                'z-30 flex-1 bg-black-pure lg:sticky lg:left-0 lg:top-0 lg:min-w-[200px] lg:shadow-[8px_18px_20px_0px_rgba(5,5,5,.8)]':
                  isLabelsColumn,
                'basis-[240px] last:basis-[208px] xl:basis-[196px] xl:last:basis-[160px] lg:basis-[180px]':
                  !isLabelsColumn,
                'before:absolute before:inset-y-0 before:-left-7 before:z-0 before:w-[208px] before:rounded-md before:bg-pricing-table-featured-column xl:basis-[236px] xl:before:inset-x-5':
                  isHighlightedColumn,
              })}
              key={key}
            >
              <TableHeading
                className={clsx(i === 1 && 'lg:pl-5')}
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
                            ? 'pb-3 pt-11 lg:pt-[42px]'
                            : ['py-3 lg:py-2.5', rowClass[item.rows]],
                          !isGroupTitle &&
                            !rowsWithGroupTitles.includes(index - 1) &&
                            'border-t border-dashed border-gray-new-15',
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
                      <CheckIcon className="w-4" />
                    ) : (
                      <span className="inline-block h-[1.4px] w-4 rounded-full bg-gray-new-30" />
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
                        i === 1 && 'pr-12 xl:pr-9 lg:pl-5',
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
                      {cell}
                      {item[`${key}_tooltip`] && (
                        <Tooltip className="w-sm z-20" id={`${key}_tooltip_${index}`} />
                      )}
                    </li>
                  );
                })}
              </ul>
              {i > 0 && !isHiddenItems && (
                <Button
                  className={clsx(
                    isHighlightedColumn && 'ml-[52px] xl:ml-[38px]',
                    i === 1 && 'lg:ml-5',
                    'relative z-20 mt-8 h-10 w-full max-w-[204px] !font-medium tracking-tight 2xl:!text-base xl:mt-6 xl:h-9 xl:max-w-[160px] lg:w-[140px] sm:max-w-none',
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
          className="mx-auto mt-9 h-[38px] rounded-full px-5 text-[15px] font-medium transition-colors duration-200"
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
