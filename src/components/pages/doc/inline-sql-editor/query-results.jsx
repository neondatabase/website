import * as Tabs from '@radix-ui/react-tabs';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import PropTypes from 'prop-types';
import * as React from 'react';

export const QueryResults = ({ queryResults }) => {
  if (!queryResults?.length) {
    return null;
  }

  return (
    <Tabs.Root defaultValue="0" className="flex w-full flex-col">
      <Tabs.List className="group flex w-full items-center gap-5 border-b border-gray-new-90 bg-gray-new-98 px-4 dark:border-gray-new-20 dark:bg-gray-new-10">
        {queryResults.map(({ result }, i) => (
          <Tabs.Trigger
            key={i.toString()}
            value={i.toString()}
            className="relative border-b border-b-transparent py-2 text-sm text-gray-new-30 after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[1px] after:bg-transparent hover:text-gray-new-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-new-70 data-[state=active]:text-gray-new-30 data-[state=active]:after:bg-gray-new-30 dark:text-gray-new-60 dark:hover:text-gray-new-50 dark:data-[state=active]:text-gray-new-90 dark:data-[state=active]:after:bg-gray-new-60 [&:not(:focus-visible)]:focus:outline-none"
          >
            {i}: {result?.command || 'Error'}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {queryResults.map(({ success, error, result }, i) => (
        <Tabs.Content
          key={i.toString()}
          value={i.toString()}
          className="w-full grow space-y-3 overflow-y-auto rounded-b-lg bg-gray-new-98 p-4 outline-none dark:bg-gray-new-10"
        >
          <StatusIndicator
            success={success}
            message={success ? 'Query ran successfully' : error.message}
          />

          {success && <ResultTable result={result} />}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

QueryResults.propTypes = {
  queryResults: PropTypes.arrayOf(
    PropTypes.shape({
      success: PropTypes.bool.isRequired,
      error: PropTypes.shape({
        message: PropTypes.string.isRequired,
      }),
      result: PropTypes.shape({
        command: PropTypes.string,
        fields: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
          })
        ),
        rows: PropTypes.array.isRequired,
        rowCount: PropTypes.number.isRequired,
      }),
    })
  ),
};

const TablePagination = ({ table, rowCount }) => (
  <div className="flex items-center gap-4 py-1.5">
    <p className="text-xs text-gray-new-30 dark:text-white/70">
      {rowCount} {rowCount === 1 ? 'row' : 'rows'}
    </p>
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={!table.getCanPreviousPage()}
        className="p-1 text-gray-new-30 hover:text-gray-new-90 disabled:opacity-30 disabled:hover:text-gray-new-30 dark:text-white/70 dark:hover:text-white dark:disabled:hover:text-white/70"
        aria-label="Previous page"
        onClick={() => table.previousPage()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <span className="text-xs text-gray-new-30 dark:text-white/70">
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </span>
      <button
        type="button"
        disabled={!table.getCanNextPage()}
        className="p-1 text-gray-new-30 hover:text-gray-new-90 disabled:opacity-30 disabled:hover:text-gray-new-30 dark:text-white/70 dark:hover:text-white dark:disabled:hover:text-white/70"
        aria-label="Next page"
        onClick={() => table.nextPage()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  </div>
);

TablePagination.propTypes = {
  table: PropTypes.shape({
    getCanPreviousPage: PropTypes.func.isRequired,
    getCanNextPage: PropTypes.func.isRequired,
    previousPage: PropTypes.func.isRequired,
    nextPage: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
    getPageCount: PropTypes.func.isRequired,
  }).isRequired,
  rowCount: PropTypes.number.isRequired,
};

const ResultTable = ({ result }) => {
  const columns =
    result?.fields?.map((field) => ({
      accessorKey: field.name,
      header: field.name,
      indexed: true,
      size: Number.MAX_SAFE_INTEGER,
    })) ?? [];

  const table = useReactTable({
    data: result?.rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (!result?.rows.length) {
    return (
      <p className="text-sm text-gray-new-30 dark:text-gray-new-90">
        Query completed with no result
      </p>
    );
  }

  return (
    <div className="mb-4 w-full min-w-full border-collapse overflow-auto text-sm">
      {table.getRowModel().rows?.length > 0 && (
        <TablePagination table={table} rowCount={result.rowCount} />
      )}
      <div className="w-full rounded-lg border border-gray-new-90 dark:border-gray-new-20">
        <div className="w-full overflow-x-auto">
          <table className="!mb-1 !mt-1 min-w-full border-collapse text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-0">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="whitespace-nowrap border-b border-r border-gray-new-90 px-4 py-2 text-left font-medium text-gray-new-30 first:pl-4 last:border-r-0 last:pr-4 dark:border-gray-new-20 dark:text-gray-new-90"
                      style={{
                        width:
                          header.column.columnDef.size === Number.MAX_SAFE_INTEGER
                            ? 'auto'
                            : header.column.columnDef.size,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="!not-prose">
              {table.getRowModel().rows?.length > 0
                ? table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-gray-new-90 transition-colors last:border-b-0 hover:bg-gray-new-94 dark:border-gray-new-20 dark:hover:bg-gray-new-15"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="whitespace-nowrap border-r border-gray-new-90 px-4 py-2 text-gray-new-30 first:pl-4 last:border-r-0 last:pr-4 dark:border-gray-new-20 dark:text-gray-new-90"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

ResultTable.propTypes = {
  result: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ),
    rows: PropTypes.array.isRequired,
    rowCount: PropTypes.number.isRequired,
  }),
};

const StatusIndicator = ({ success, message }) => (
  <div className="flex w-full items-center space-x-2">
    {success ? (
      <svg
        className="h-4 w-4 text-code-green-1"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="Checkmark Icon"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ) : (
      <svg
        className="h-4 w-4 text-code-red-1"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="Error Icon"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    )}
    <p className="text-sm">{message}</p>
  </div>
);

StatusIndicator.propTypes = {
  success: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};
