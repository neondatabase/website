'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from '../checkbox';

const TABLE_COLUMNS = [
  { id: 'id', name: 'id' },
  { id: 'singer', name: 'singer' },
  { id: 'song', name: 'song' },
];

const SKELETON_ROWS = Array.from({ length: 5 }, (_, index) => ({
  id: index,
  singer: '',
  song: '',
}));

const getSkeletonWidth = (columnId, rowId) => {
  const basePercentages = {
    id: 75,
    singer: 85,
    song: 90,
  };
  const variation = (rowId * 7 + columnId.charCodeAt(0) * 3) % 15;
  const basePercentage = basePercentages[columnId] || 80;
  return `${Math.min(basePercentage + variation, 100)}%`;
};

const getColumnWidth = (columnId, isLoading) => {
  if (columnId === 'id') {
    return isLoading ? 'w-[76px] lg:w-[61px]' : 'w-[52px] lg:w-[43px] lg:mr-[29px]';
  }
  if (columnId === 'singer') {
    return 'w-[100px] mr-10 lg:w-[75px] lg:mr-[29px]';
  }

  return 'mr-0 max-w-[137px] flex-1 lg:w-[100px]';
};

const BranchingDemoTable = ({
  databaseBranchName,
  databaseTableName,
  tableData,
  selectedRows,
  handleRowSelection,
  isLoading = false,
  isCheckboxInteractive = false,
  lastAddedRowId,
}) => {
  const tableRows = isLoading ? SKELETON_ROWS : tableData;

  return (
    <div className="branching-demo-table grow">
      <div className="mx-3">
        <span className="flex flex-col gap-1 text-sm leading-snug tracking-extra-tight text-gray-new-50 lg:text-[12px]">
          <span>
            Branch: <span className="text-white">{databaseBranchName}</span>
          </span>
          <span>
            Table: <span className="text-white">{databaseTableName}</span>
          </span>
        </span>
      </div>
      <div className="relative mt-3.5 overflow-hidden rounded-[10px] border border-transparent">
        <div className="relative overflow-hidden bg-[#121417] bg-opacity-80 p-px">
          <div className="relative flex px-3 py-3.5 text-[15px] font-medium leading-snug tracking-extra-tight text-gray-new-60 after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-white after:mix-blend-overlay lg:px-2 lg:py-2 lg:text-[12px]">
            <div className="relative mr-3 w-3 lg:mr-[9px] lg:w-[9px]" aria-hidden="true">
              <span className="sr-only">Choose</span>
            </div>
            {TABLE_COLUMNS.map((column) => (
              <div
                className={clsx(
                  column.id === 'id' && 'w-[52px] lg:mr-[29px] lg:w-[43px]',
                  column.id === 'singer' && 'w-[100px] lg:mr-[29px] lg:w-[75px]',
                  column.id === 'song' ? 'mr-0 flex-1' : 'mr-10 lg:mr-7'
                )}
                key={column.id}
              >
                <span>{column.name}</span>
              </div>
            ))}
          </div>
          <ul className="text-base leading-snug tracking-extra-tight drop-shadow-[0_4px_40px_0_rgba(0,0,0,0.25)] lg:text-[12px]">
            {tableRows.map((row) => (
              <li
                key={row.id}
                className={clsx(
                  'group relative flex h-full px-3 py-[13px] lg:px-2 lg:pb-[9px] lg:pt-2.5',
                  'before:pointer-events-none before:absolute before:inset-0 before:mix-blend-overlay before:last:rounded-b-[10px]',
                  'after:pointer-events-none after:absolute after:inset-0 after:-bottom-px after:mx-3 after:border-b after:border-white after:mix-blend-overlay after:last:hidden',
                  !isLoading &&
                    isCheckboxInteractive &&
                    'cursor-pointer hover:before:bg-white hover:before:opacity-50 focus:outline-none focus:before:bg-white focus:before:opacity-50',
                  'last:rounded-b-[10px] last:pb-[18px] last:pt-4 lg:last:pb-3 lg:last:pt-2.5',
                  row.id === lastAddedRowId && 'bg-[rgba(0,229,153,0.08)]'
                )}
                role="option"
                tabIndex={isLoading || !isCheckboxInteractive ? -1 : 0}
                aria-selected={!isLoading && selectedRows.includes(row.id)}
                onClick={
                  isLoading || !isCheckboxInteractive ? undefined : () => handleRowSelection(row.id)
                }
                onKeyDown={
                  isLoading || !isCheckboxInteractive
                    ? undefined
                    : (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRowSelection(row.id);
                        }
                      }
                }
              >
                {!isLoading && (
                  <div className="relative mr-3 flex w-3 items-center lg:mr-[9px] lg:w-[9px]">
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      id={`row-${row.id}`}
                      label={`Row ${row.id}`}
                      tabIndex={-1}
                      disabled={!isCheckboxInteractive}
                      onChange={() => isCheckboxInteractive && handleRowSelection(row.id)}
                    />
                  </div>
                )}
                {TABLE_COLUMNS.map((column) => (
                  <div
                    className={clsx(
                      getColumnWidth(column.id, isLoading),
                      column.id === 'id' ? 'mr-10 font-medium lg:mr-[29px]' : 'font-normal',
                      column.id === 'song' ? 'text-gray-new-80' : 'text-white'
                    )}
                    key={column.id}
                  >
                    {isLoading ? (
                      <span
                        className="my-1 block h-3.5 animate-pulse rounded-full bg-white mix-blend-overlay lg:my-0 lg:h-[1.375em]"
                        style={{ width: getSkeletonWidth(column.id, row.id) }}
                      />
                    ) : (
                      <span className="block w-full truncate">{row[column.id]}</span>
                    )}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white mix-blend-overlay" />
        <span className="pointer-events-none absolute right-[-337px] top-[-335px] size-[600px] bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(92,129,182,0.26)_0%,_rgba(92,129,182,0.00)_100%)] opacity-30" />
        <span className="pointer-events-none absolute bottom-[-177px] left-[-209px] size-[330px] bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(38,128,146,0.25)_0%,_rgba(38,128,146,0.00)_100%)] opacity-30" />
      </div>
    </div>
  );
};

BranchingDemoTable.propTypes = {
  databaseBranchName: PropTypes.string.isRequired,
  databaseTableName: PropTypes.string.isRequired,
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      singer: PropTypes.string.isRequired,
      song: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
  handleRowSelection: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isCheckboxInteractive: PropTypes.bool,
  lastAddedRowId: PropTypes.number,
};

export default BranchingDemoTable;
