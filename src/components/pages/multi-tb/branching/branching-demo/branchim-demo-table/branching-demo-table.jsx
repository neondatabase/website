import clsx from 'clsx';
import PropTypes from 'prop-types';

import Checkbox from '../checkbox';

const TABLE_COLUMNS = [
  { id: 'id', name: 'id' },
  { id: 'singer', name: 'singer' },
  { id: 'song', name: 'song' },
];

const BranchingDemoTable = ({
  tableBranchHead,
  tableBranchTarget,
  tableData,
  selectedRows,
  handleRowSelection,
}) => (
  <div className="branching-demo-table grow">
    <div className="mx-3">
      <span className="flex flex-col gap-1 text-sm leading-snug tracking-extra-tight text-gray-new-50">
        <span>
          Database: <span className="text-white">{tableBranchHead}</span>
        </span>
        <span>
          Table: <span className="text-white">{tableBranchTarget}</span>
        </span>
      </span>
    </div>
    <div className="relative mt-3.5 overflow-hidden rounded-[10px] border border-transparent">
      <div className="relative overflow-hidden bg-[#121417] bg-opacity-80 p-px">
        {/* Header */}
        <div className="relative flex px-3 py-3.5 text-[15px] font-medium leading-none tracking-extra-tight text-gray-new-60 after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-white after:mix-blend-overlay">
          <div className="relative mr-3 w-3" aria-hidden="true">
            <span className="sr-only">Choose</span>
          </div>
          {TABLE_COLUMNS.map((column) => (
            <div
              key={column.id}
              className={clsx(
                column.id === 'id' && 'min-w-[52px]',
                column.id === 'singer' && 'min-w-[100px]',
                column.id === 'song' ? 'mr-0 flex-1' : 'mr-10'
              )}
            >
              <span>{column.name}</span>
            </div>
          ))}
        </div>
        {/* Body */}
        <ul className="text-base leading-none tracking-extra-tight drop-shadow-[0_4px_40px_0_rgba(0,0,0,0.25)]">
          {tableData.map((row) => (
            <li
              key={row.id}
              className={clsx(
                'group relative flex h-full cursor-pointer px-3 py-4',
                'before:pointer-events-none before:absolute before:inset-0 before:mix-blend-overlay before:last:rounded-b-[10px]',
                'after:pointer-events-none after:absolute after:inset-0 after:-bottom-px after:mx-3 after:border-b after:border-white after:mix-blend-overlay after:last:hidden',
                'hover:before:bg-white hover:before:opacity-50 focus:outline-none focus:before:bg-white focus:before:opacity-50',
                'last:rounded-b-[10px] last:pb-[18px] last:pt-4'
              )}
              role="option"
              tabIndex={0}
              aria-selected={selectedRows.includes(row.id)}
              onClick={(e) => handleRowSelection(row.id, e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRowSelection(row.id, e.currentTarget);
                }
              }}
            >
              <div className="relative mr-3 w-3">
                <Checkbox
                  checked={selectedRows.includes(row.id)}
                  id={`row-${row.id}`}
                  label={`Row ${row.id}`}
                  tabIndex={-1}
                  onChange={() => handleRowSelection(row.id)}
                />
              </div>
              {TABLE_COLUMNS.map((column) => (
                <span
                  key={column.id}
                  className={clsx(
                    'block',
                    column.id === 'id' ? 'w-[52px] font-medium' : 'font-normal',
                    column.id === 'singer' && 'w-[100px]',
                    column.id === 'song'
                      ? 'mr-0 max-w-[137px] flex-1 text-gray-new-80'
                      : 'mr-10 text-white'
                  )}
                >
                  <span className="block w-full truncate">{row[column.id]}</span>
                </span>
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

BranchingDemoTable.propTypes = {
  tableBranchHead: PropTypes.string.isRequired,
  tableBranchTarget: PropTypes.string.isRequired,
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      singer: PropTypes.string.isRequired,
      song: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
  handleRowSelection: PropTypes.func.isRequired,
};

export default BranchingDemoTable;
