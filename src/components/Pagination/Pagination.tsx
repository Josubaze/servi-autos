'use client'

import React from 'react';

export const getCurrentProducts = (filteredProducts: Product[], currentPage: number, productsPerPage: number) => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  };

export const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, paginate, products }) => {
  // Calculate the total number of pages
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-6">
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === number ? 'bg-indigo-600 text-white ' : 'bg-gray-200 text-black hover:bg-indigo-800 hover:text-white'}`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

