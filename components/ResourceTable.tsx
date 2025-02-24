import React, { useMemo } from 'react';
import { useTable, useSortBy, useFilters, useGlobalFilter, useExpanded } from 'react-table';
import { Resource } from '../types';

interface ResourceTableProps {
  resources: Resource[];
}

const ResourceTable: React.FC<ResourceTableProps> = ({ resources }) => {
  const data = useMemo(() => resources, [resources]);

  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Tags',
        accessor: 'tags',
        Cell: ({ cell: { value } }) => value.join(', '),
      },
      {
        Header: 'URL',
        accessor: 'url',
        Cell: ({ cell: { value } }) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded
  );

  return (
    <div>
      <input
        value={state.globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className="mb-4 p-2 border rounded"
      />
      <table {...getTableProps()} className="min-w-full bg-white">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-4 py-2 border-b"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <React.Fragment key={row.id}>
                <tr {...row.getRowProps()} className="hover:bg-gray-100">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="px-4 py-2 border-b">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
                {row.isExpanded ? (
                  <tr>
                    <td colSpan={columns.length}>
                      <div className="p-4 bg-gray-50">
                        <h3 className="text-lg font-bold">Data Dashboard</h3>
                        <p>Creation Date: {row.original.creationDate}</p>
                        <p>Last Updated Date: {row.original.lastUpdatedDate}</p>
                        <p>Notes: {row.original.notes}</p>
                        <p>Summary: {row.original.summary}</p>
                        <p>Relationships: {row.original.relationships?.join(', ')}</p>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceTable;
