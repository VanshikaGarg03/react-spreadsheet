import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useTable } from 'react-table';

function Spreadsheet({ activeStyle, columnsState, setColumnsState, activeSheet }) {
  // Predefined data for each sheet
  const defaultData = {
    Students: [
      { name: 'Amit', subject: 'Math', marks: 95, grade: 'A+' },
      { name: 'Sneha', subject: 'Science', marks: 88, grade: 'A' },
      { name: 'Rahul', subject: 'English', marks: 76, grade: 'B' }
    ],
    Employees: [
      { name: 'Priya Sharma', role: 'Manager', department: 'Sales', salary: 85000 },
      { name: 'Raj Verma', role: 'Developer', department: 'IT', salary: 70000 },
      { name: 'Alok Das', role: 'Designer', department: 'UI/UX', salary: 65000 }
    ],
    Inventory: [
      { product: 'Laptop', quantity: 10, price: 75000 },
      { product: 'Mobile Phone', quantity: 25, price: 20000 },
      { product: 'Monitor', quantity: 15, price: 12000 }
    ]
  };

  // Load from localStorage if exists, else use default
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(`spreadsheetData_${activeSheet}`);
    return saved ? JSON.parse(saved) : defaultData[activeSheet] || [];
  });

  // Update localStorage whenever sheet changes
  useEffect(() => {
    const saved = localStorage.getItem(`spreadsheetData_${activeSheet}`);
    setData(saved ? JSON.parse(saved) : defaultData[activeSheet] || []);
  }, [activeSheet]);

  const [focusedCell, setFocusedCell] = useState({ row: null, col: null });

  const [colWidths, setColWidths] = useState(
    columnsState.reduce((acc, col) => {
      if (col.show) acc[col.accessor] = col.width;
      return acc;
    }, {})
  );

  const [resizingCol, setResizingCol] = useState(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const visibleCols = useMemo(() =>
    columnsState.filter((col) => col.show),
    [columnsState]
  );

  const columns = useMemo(
    () =>
      visibleCols.map((col) => ({
        Header: () => (
          <div className="flex items-center justify-between">
            <span>{col.Header}</span>
            <button
              onClick={() =>
                setColumnsState((prev) =>
                  prev.map((c) =>
                    c.accessor === col.accessor ? { ...c, show: false } : c
                  )
                )
              }
              className="text-xs text-red-500 hover:underline ml-2"
            >
              Hide
            </button>
          </div>
        ),
        accessor: col.accessor
      })),
    [visibleCols, setColumnsState]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data });

  const onMouseMove = (e) => {
    if (!resizingCol) return;
    const delta = e.clientX - startX.current;
    setColWidths((prev) => ({
      ...prev,
      [resizingCol]: Math.max(50, startWidth.current + delta)
    }));
  };

  const onMouseUp = () => setResizingCol(null);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [resizingCol]);

  const hiddenCols = columnsState.filter((col) => !col.show);

  const handleChange = (value, rowIndex, accessor) => {
    setData((old) =>
      old.map((row, i) =>
        i === rowIndex ? { ...row, [accessor]: value } : row
      )
    );
  };

  const handleSave = () => {
    localStorage.setItem(`spreadsheetData_${activeSheet}`, JSON.stringify(data));
    alert(`${activeSheet} data saved successfully!`);
  };

  return (
    <>
      {/* Show Hidden Columns */}
      {hiddenCols.length > 0 && (
        <div className="mb-4">
          <span className="mr-2 text-sm font-medium text-gray-700">
            Show Hidden:
          </span>
          {hiddenCols.map((col) => (
            <button
              key={col.accessor}
              onClick={() =>
                setColumnsState((prev) =>
                  prev.map((c) =>
                    c.accessor === col.accessor ? { ...c, show: true } : c
                  )
                )
              }
              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mr-2 hover:bg-blue-200"
            >
              {col.Header}
            </button>
          ))}
        </div>
      )}

      {/* Save Button */}
      <div className="mb-2 text-right">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Save
        </button>
      </div>

      <table {...getTableProps()} className="min-w-full border border-gray-300 bg-white">
        <thead className="bg-gray-50">
          {headerGroups.map((hg) => (
            <tr {...hg.getHeaderGroupProps()} key={hg.id}>
              {hg.headers.map((column) => {
                const accessor = column.id;
                const width = colWidths[accessor] || 100;
                return (
                  <th
                    {...column.getHeaderProps()}
                    key={accessor}
                    style={{ width }}
                    className="relative text-xs font-semibold uppercase bg-gray-50 px-3 py-2 border-b border-gray-200 text-left"
                  >
                    {column.render('Header')}
                    <div
                      onMouseDown={(e) => {
                        setResizingCol(accessor);
                        startX.current = e.clientX;
                        startWidth.current = width;
                      }}
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
                    />
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell, colIndex) => {
                  const id = `${rowIndex}-${colIndex}`;
                  const accessor = visibleCols[colIndex].accessor;
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      style={{ width: colWidths[accessor] }}
                      className="text-sm px-3 py-2 border-b border-gray-100 bg-white hover:bg-blue-50 focus-within:outline outline-blue-400"
                      data-cell={id}
                    >
                      <input
                        className={`w-full bg-transparent focus:outline-none
                          ${activeStyle.bold ? 'font-bold' : ''}
                          ${activeStyle.italic ? 'italic' : ''}
                          ${activeStyle.underline ? 'underline' : ''}
                          ${
                            activeStyle.align === 'center'
                              ? 'text-center'
                              : activeStyle.align === 'right'
                              ? 'text-right'
                              : 'text-left'
                          }`}
                        value={data[rowIndex][accessor]}
                        onChange={(e) =>
                          handleChange(e.target.value, rowIndex, accessor)
                        }
                        onFocus={() =>
                          setFocusedCell({ row: rowIndex, col: colIndex })
                        }
                        onKeyDown={(e) => {
                          let next = { ...focusedCell };
                          if (e.key === 'ArrowDown') next.row++;
                          if (e.key === 'ArrowUp') next.row--;
                          if (e.key === 'ArrowRight') next.col++;
                          if (e.key === 'ArrowLeft') next.col--;
                          const nextInput = document.querySelector(
                            `[data-cell="${next.row}-${next.col}"] input`
                          );
                          if (nextInput) nextInput.focus();
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Spreadsheet;
