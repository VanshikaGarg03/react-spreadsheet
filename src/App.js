import React, { useState } from 'react';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Spreadsheet from './components/Spreadsheet';

function App() {
  const [activeStyle, setActiveStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'left',
  });

  const [activeSheet, setActiveSheet] = useState('Students');

  const getColumnsForSheet = (sheet) => {
    switch (sheet) {
      case 'Students':
  return [
    { Header: 'Name', accessor: 'name', width: 160, show: true },
    { Header: 'Subject', accessor: 'subject', width: 140, show: true },
    { Header: 'Marks', accessor: 'marks', width: 100, show: true },
    { Header: 'Grade', accessor: 'grade', width: 100, show: true },
  ];
      case 'Employees':
        return [
          { Header: 'Name', accessor: 'name', width: 150, show: true },
          { Header: 'Role', accessor: 'role', width: 130, show: true },
          { Header: 'Department', accessor: 'department', width: 150, show: true },
          { Header: 'Salary', accessor: 'salary', width: 100, show: true },
        ];
      case 'Inventory':
        return [
          { Header: 'Product', accessor: 'product', width: 180, show: true },
          { Header: 'Quantity', accessor: 'quantity', width: 120, show: true },
          { Header: 'Price', accessor: 'price', width: 120, show: true },
        ];
      default:
        return [];
    }
  };

  const [columnsState, setColumnsState] = useState(getColumnsForSheet(activeSheet));

  const handleSheetChange = (sheet) => {
    setActiveSheet(sheet);
    setColumnsState(getColumnsForSheet(sheet));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header activeSheet={activeSheet} setActiveSheet={handleSheetChange} />
      <Toolbar activeStyle={activeStyle} setActiveStyle={setActiveStyle} />
      <Spreadsheet
        activeStyle={activeStyle}
        columnsState={columnsState}
        setColumnsState={setColumnsState}
        activeSheet={activeSheet}
      />
    </div>
  );
}

export default App;
