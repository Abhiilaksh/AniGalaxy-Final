import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative md:w-72 text-gray-700">
      <input
        type="text"
        placeholder="Search..."
        className="w-full py-1 md:py-2 px-4 pl-10 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-75 placeholder-gray-700"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown} // Detect Enter key
      />
      <button
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
        onClick={handleSearch}
      >
        <i className="fa fa-search"></i>
      </button>
    </div>
  );
};

export default SearchBox;
