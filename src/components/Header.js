import React from 'react';

function Header({ activeSheet, setActiveSheet }) {
  const tabs = ['Students', 'Employees', 'Inventory'];

  return (
    <div className="flex space-x-4 border-b pb-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => {
            setActiveSheet(tab);
            console.log(`Switched to ${tab}`);
          }}
          className={`px-4 py-3 text-sm font-medium border border-b-0 rounded-t-md ${
            activeSheet === tab
              ? 'bg-white text-blue-700'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default Header;
