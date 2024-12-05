import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';


const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    
  };

  return (
    <div className="relative w-72">
      <input
        type="text"
        placeholder="Search..."
        className="w-full py-2 px-4 pl-10 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={handleChange}
      />
      <button
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        onClick={handleSearch}
      >
        <i className="fa fa-search"></i>
      </button>
    </div>
  );
};

export default SearchBox;
