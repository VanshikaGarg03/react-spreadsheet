import React from 'react';

function Toolbar({ setActiveStyle, activeStyle }) {
  const tools = ['Bold', 'Italic', 'Underline', 'Left', 'Center', 'Right'];

  const toggleStyle = (tool) => {
    setActiveStyle((prev) => ({
      ...prev,
      bold: tool === 'Bold' ? !prev.bold : prev.bold,
      italic: tool === 'Italic' ? !prev.italic : prev.italic,
      underline: tool === 'Underline' ? !prev.underline : prev.underline,
      align: ['Left', 'Center', 'Right'].includes(tool)
        ? tool.toLowerCase()
        : prev.align,
    }));
    console.log(`${tool} clicked`);
  };

  return (
    <div className="flex space-x-2 mb-4">
      {tools.map((tool) => (
        <button
          key={tool}
          onClick={() => toggleStyle(tool)}
          className={`p-2 px-3 text-sm rounded-md ${
            (tool.toLowerCase() === activeStyle.align ||
              activeStyle[tool.toLowerCase()]) &&
            'bg-blue-200 text-blue-800'
          } bg-gray-100 text-gray-600 hover:bg-gray-200`}
        >
          {tool}
        </button>
      ))}
    </div>
  );
}

export default Toolbar;
