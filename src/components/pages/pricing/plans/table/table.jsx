'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import InfoIcon from 'components/shared/info-icon';
import Link from 'components/shared/link';
import Tooltip from 'components/shared/tooltip';
import LINKS from 'constants/links';

import tableData from '../data/plans';

// Styles to set fixed height for table cells
const rowClass = {
  1: 'h-[50px]',
  2: 'h-[73px]',
  3: 'h-[92px] lg:h-[124px] xl:h-[108px]',
};

const TableHeading = ({ className, label, price, isLabelsColumn, isFeaturedPlan }) => {
  // placeholder for the labels column
  if (isLabelsColumn) {
    return <div className="invisible h-[125px]" aria-hidden />;
  }

  return (
    <div className={clsx('relative z-10 h-[125px] w-[240px] xl:w-[200px] lg:w-[180px]', className)}>
      <h3
        className={clsx(
          isFeaturedPlan && 'text-green-52',
          'text-2xl font-normal leading-snug tracking-tighter lg:text-xl'
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
          'mt-5 h-[38px] w-full !text-[14px] tracking-extra-tight xl:!text-[14px] md:h-8',
          isFeaturedPlan ? '!font-medium' : '!font-normal',
          !isFeaturedPlan && 'bg-opacity-80'
        )}
        size="xs"
        theme={isFeaturedPlan ? 'white-filled' : 'outlined'}
        to={LINKS.signup}
        tagName={`Details Table Top > ${label}`}
      >
        Get started
      </Button>
    </div>
  );
};

TableHeading.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
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
    <Container size="1152" className="flex flex-col lg:pr-0 md:pl-5">
      <ul className="no-scrollbars px-4.5 relative flex w-full pb-2.5 lg:overflow-x-auto lg:overflow-y-hidden lg:pl-0 lg:pr-8 md:pr-5">
        {tableHeadings.map((key, i, arr) => {
          const isHighlightedColumn = key === 'launch';
          const isLabelsColumn = i === 0;

          return (
            <li
              className={clsx('relative pt-6 xl:pt-4', {
                'z-30 flex-1 bg-black-pure lt:min-w-[200px] lg:sticky lg:left-0 lg:top-0 lg:shadow-[8px_18px_20px_0px_rgba(5,5,5,.8)] md:min-w-[180px]':
                  isLabelsColumn,
                'basis-[296px] xl:basis-[252px] lg:shrink-0 lg:basis-[240px]': !isLabelsColumn,
                'before:absolute before:-bottom-2.5 before:-left-6 before:top-0 before:z-0 before:w-[288px] before:border before:border-gray-new-20 before:bg-gray-new-15/20 xl:before:-left-5 xl:before:w-[248px] lg:before:w-[228px]':
                  isHighlightedColumn,
                '!basis-[240px] xl:!basis-[200px] lg:!basis-[240px] md:!basis-[190px]':
                  i === tableHeadings.length - 1,
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
                          'relative flex flex-col justify-start transition-colors',
                          isGroupTitle
                            ? 'h-[86px] justify-end pb-[18px] lg:h-[66px]'
                            : ['py-[14px] lg:py-2.5', rowClass[item.rows]],
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
                          <span className="whitespace-nowrap text-[18px] font-medium leading-snug tracking-tighter lg:text-xs">
                            {item[key]}
                          </span>
                        ) : (
                          <>
                            <span className="relative w-fit text-base font-normal leading-snug tracking-extra-tight">
                              {item[key].title}
                              {!!item.soon && (
                                <span className="relative -top-0.5 ml-4 inline-block rounded-full bg-yellow-70/10 px-2.5 py-[5px] text-[10px] font-semibold uppercase leading-none tracking-wide text-gray-new-50 xl:ml-2.5 xl:px-1.5 xl:py-1 xl:text-[8px]">
                                  soon
                                </span>
                              )}
                            </span>
                            {item[key]?.subtitle &&
                              (typeof item[key].subtitle === 'string' ? (
                                <span
                                  className={clsx(
                                    'mt-1 text-sm font-light leading-snug tracking-extra-tight text-gray-new-50'
                                  )}
                                  dangerouslySetInnerHTML={{ __html: item[key].subtitle }}
                                />
                              ) : (
                                <Link
                                  tabIndex={0}
                                  href={item[key].subtitle.href}
                                  className="z-10 mt-1 inline-block w-fit rounded-sm border-b border-[rgba(175,177,182,0.40)] text-sm font-light leading-snug tracking-extra-tight text-gray-new-50 transition-colors duration-200 hover:border-primary-1 hover:text-primary-1"
                                >
                                  {item[key].subtitle.text}
                                </Link>
                              ))}
                          </>
                        )}
                      </li>
                    );
                  }

                  let cell;
                  if (typeof item[key] === 'boolean') {
                    cell = item[key] ? (
                      <span className="pricing-check-icon flex size-4 bg-green-45" />
                    ) : (
                      <span className="pricing-cross-icon flex size-[14px] bg-gray-new-30" />
                    );
                  } else if (typeof item[key] === 'object') {
                    const { title, info, moreLink } = item[key];
                    cell = (
                      <div className="font-normal leading-snug tracking-extra-tight">
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
                    const isIncluded = item[key] === 'Included';
                    cell = (
                      <span
                        className={clsx(
                          'flex flex-col gap-y-1 font-normal leading-snug tracking-extra-tight',
                          isIncluded ? 'text-green-52' : 'text-gray-new-90',
                          '[&_span]:text-sm [&_span]:text-gray-new-50',
                          '[&>a]:text-green-52 [&_span_a]:border-b [&_span_a]:border-dashed',
                          '[&_a]:w-fit [&_a]:border-gray-new-50',
                          '[&_a]:transition-colors [&_a]:duration-200',
                          '[&_a:hover]:border-b [&_a:hover]:border-green-52 [&_a:hover]:text-green-52'
                        )}
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
                          ? 'h-[86px] lg:h-[66px]'
                          : ['py-[14px] lg:py-2.5', rowClass[item.rows]],
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
    </Container>
  );
};

export default Table;
