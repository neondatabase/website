'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { usePostHog } from 'posthog-js/react';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import Button from 'components/shared/button';
import InfoIcon from 'components/shared/info-icon';
import Tooltip from 'components/shared/tooltip';
import checkIcon from 'icons/pricing/check.svg';
import crossIcon from 'icons/pricing/cross.svg';

import tableData from '../data/plans.json';

// Styles to set fixed height for table cells
const rowClass = {
  1: 'h-[46px] lg:h-[62px]',
  2: 'h-[68px] lg:h-[82px]',
  3: 'h-[90px] lg:h-[124px] xl:h-[108px]',
};

// const DEFAULT_ROWS_TO_SHOW = 8;

const TableHeading = ({
  className,
  planId,
  label,
  price,
  buttonUrl,
  buttonText,
  isLabelsColumn,
  isFeaturedPlan,
}) => {
  const posthog = usePostHog();

  // placeholder for the labels column
  if (isLabelsColumn) {
    return <div className="invisible h-[120px]" aria-hidden />;
  }

  return (
    <div className={clsx('relative z-10 h-[120px] w-[240px] xl:w-[200px] lg:w-[180px]', className)}>
      <h3
        className={clsx(
          isFeaturedPlan && 'text-green-45',
          'text-2xl font-medium leading-none tracking-extra-tight lg:text-xl'
        )}
      >
        {label}
      </h3>
      <span
        className="mt-3 block leading-snug tracking-extra-tight text-gray-new-60 lg:text-[15px] [&_span]:tracking-extra-tight [&_span]:text-white"
        dangerouslySetInnerHTML={{ __html: price }}
      />
      <Button
        className={clsx(
          'mt-5 h-10 w-full !text-[16px] !font-medium tracking-tight xl:!text-[14px] md:h-8',
          !isFeaturedPlan && 'bg-opacity-80'
        )}
        size="xs"
        theme={isFeaturedPlan ? 'primary' : 'gray-20'}
        to={buttonUrl}
        tagName={`Details Table Top > ${label}`}
        onClick={() => {
          posthog.capture('ui_interaction', {
            action: 'pricing_page_get_started_clicked',
            plan: planId,
            place: 'table_heading',
          });
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
};

TableHeading.propTypes = {
  className: PropTypes.string,
  planId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  isLabelsColumn: PropTypes.bool.isRequired,
  isFeaturedPlan: PropTypes.bool.isRequired,
};

const Table = () => {
  const labelList = tableData.headings;
  const [currentRow, setCurrentRow] = useState('');
  const tableRows = tableData.cols; // Show all rows at once
  const tableHeadings = Object.keys(tableData.headings);

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
    <div className="mx-auto flex max-w-[1088px] flex-col xl:max-w-none xl:px-8 lg:pr-0 md:pl-5">
      <ul className="no-scrollbars px-4.5 relative flex w-full lg:overflow-x-auto lg:pl-0 lg:pr-8 md:pr-5">
        {tableHeadings.map((key, i, arr) => {
          const isHighlightedColumn = key === 'launch';
          const isLabelsColumn = i === 0;

          return (
            <li
              className={clsx('relative pt-6 xl:pt-4', {
                'z-30 flex-1 bg-black-pure lt:min-w-[200px] lg:sticky lg:left-0 lg:top-0 lg:shadow-[8px_18px_20px_0px_rgba(5,5,5,.8)] md:min-w-[180px]':
                  isLabelsColumn,
                'basis-[296px] xl:basis-[252px] lg:shrink-0 lg:basis-[240px]': !isLabelsColumn,
                'before:absolute before:inset-y-0 before:-left-6 before:z-0 before:w-[288px] before:rounded-md before:bg-[#0F1011] xl:before:-left-5 xl:before:w-[248px] lg:before:w-[228px]':
                  isHighlightedColumn,
                '!basis-[240px] xl:!basis-[200px] lg:!basis-[240px] md:!basis-[190px]':
                  i === tableHeadings.length - 1,
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
                  if (i === 0) {
                    const isGroupTitle = typeof item[key] === 'string';
                    return (
                      <li
                        className={clsx(
                          'relative flex flex-col justify-start transition-colors',
                          isGroupTitle
                            ? 'h-[100px] justify-end pb-6 lg:h-[66px]'
                            : ['pb-[14px] pt-[12px] lg:py-2.5', rowClass[item.rows]],
                          !isGroupTitle && 'border-t border-dashed border-gray-new-15',
                          i === 1 && 'lg:pl-5',
                          currentRow === index.toString() && !isGroupTitle
                            ? 'bg-gray-new-8 before:opacity-100 lg:bg-transparent'
                            : 'before:opacity-0',
                          'before:absolute before:-inset-y-px before:-left-4 before:z-0 before:w-4 before:rounded-bl-lg before:rounded-tl-lg before:bg-gray-new-8 before:transition-opacity lg:before:hidden'
                        )}
                        data-row-id={index}
                        key={index}
                      >
                        {isGroupTitle ? (
                          <span className="whitespace-nowrap text-xl font-medium leading-snug tracking-tighter lg:text-xs">
                            {item[key]}
                          </span>
                        ) : (
                          <>
                            <span className="relative w-fit text-base font-normal leading-tight tracking-extra-tight">
                              {item[key].title}
                              {!!item.soon && (
                                <span className="relative -top-0.5 ml-4 inline-block rounded-full bg-yellow-70/10 px-2.5 py-[5px] text-[10px] font-semibold uppercase leading-none tracking-wide text-gray-new-50 xl:ml-2.5 xl:px-1.5 xl:py-1 xl:text-[8px]">
                                  soon
                                </span>
                              )}
                            </span>
                            {item[key]?.subtitle && (
                              <span
                                className={clsx(
                                  'mt-1 text-sm font-light leading-snug tracking-extra-tight text-gray-new-50',
                                  'text-with-links'
                                )}
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
                      <Image
                        src={checkIcon}
                        width={24}
                        height={24}
                        alt={`${item.feature.title} included`}
                        loading="lazy"
                      />
                    ) : (
                      <Image
                        src={crossIcon}
                        width={14}
                        height={14}
                        alt={`${item.feature.title} not included`}
                        loading="lazy"
                      />
                    );
                  } else if (typeof item[key] === 'object') {
                    const { title, info, moreLink } = item[key];
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
                              link={moreLink}
                              clickable
                            />
                          </span>
                        )}
                      </div>
                    );
                  } else {
                    cell = (
                      <span
                        className="flex flex-col gap-y-1 font-light leading-snug tracking-extra-tight text-gray-new-90 [&_span]:text-sm [&_span]:text-gray-new-50"
                        data-tooltip-id={item[`${key}_tooltip`] && `${key}_tooltip_${index}`}
                        data-tooltip-html={item[`${key}_tooltip`] && item[`${key}_tooltip`]}
                        dangerouslySetInnerHTML={{ __html: item[key] }}
                      />
                    );
                  }

                  return (
                    <li
                      className={clsx(
                        'relative flex flex-col justify-start transition-colors',
                        rowsWithGroupTitles.includes(index)
                          ? 'h-[100px] lg:h-[66px]'
                          : ['pb-[14px] pt-[12px] lg:py-2.5', rowClass[item.rows]],
                        item[key] !== undefined &&
                          !rowsWithGroupTitles.includes(index) &&
                          'border-t border-dashed border-gray-new-15',
                        currentRow === index.toString() &&
                          !rowsWithGroupTitles.includes(index) &&
                          'bg-gray-new-8 before:opacity-100 lg:bg-transparent',
                        i === arr.length - 1 &&
                          'before:absolute before:-inset-y-px before:-right-4 before:z-0 before:w-4 before:rounded-br-lg before:rounded-tr-lg before:bg-gray-new-8 before:opacity-0 before:transition-opacity lg:before:hidden'
                      )}
                      data-row-id={index}
                      key={index}
                    >
                      <div
                        className={clsx(
                          'max-w-[240px] xl:max-w-[200px] lg:max-w-[180px]',
                          i === 1 && 'lg:ml-5'
                        )}
                      >
                        {cell}
                        {item[`${key}_tooltip`] && (
                          <Tooltip className="w-sm z-20" id={`${key}_tooltip_${index}`} />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Table;
