'use client';

import { useEffect, useState } from 'react';
import { IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FormProduct } from 'src/components/ProductForm';
import { FaPlus } from "react-icons/fa6";
import { Pagination } from 'src/components/Pagination';
import { getCurrentProducts } from '../Pagination/Pagination';
import { useProductFilter } from 'src/hooks/useProductFilter';
import { SearchBar } from 'src/components/SearchBar';
import { Loading } from '../Common/Loading';
import { useDeleteProductMutation, useGetProductsQuery } from 'src/redux/services/productsApi';


export const TableProducts = () => {

  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetProductsQuery();
  const [ deleteProduct ] = useDeleteProductMutation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const filteredProducts = useProductFilter(data, searchTerm);
  const productsPerPage = 15;

  const openForm = () => {
    setShowForm(true);
    setCurrentProduct(null);
  };

  const openFormUpdate = (product: Product) => {
    setCurrentProduct(product);
    setShowForm(true);
  };

  const CloseForm = () => {
    setShowForm(false);
    setCurrentProduct(null);
  };


  // Calculate the products to display on the current page
  const currentProducts = getCurrentProducts(filteredProducts, currentPage, productsPerPage)



  return (
    <div className="flex flex-col py-6 px-12">
      <div className="my-4 flex justify-between items-center gap-2 pb-2">
        <button
          className="bg-emerald-600 hover:bg-emerald-800 text-white px-4 py-2 rounded max-sm:hidden"
          onClick={openForm}
        >
          <span className='flex items-center gap-2'>
            <FaPlus />
            Agregar Producto
          </span>
        </button>

        <button
          className="bg-emerald-600 hover:bg-emerald-800 text-white p-4 rounded-full fixed bottom-0 right-0 mr-3 mb-8 shadow-2xl shadow-emerald-300 sm:hidden"
          onClick={openForm}
        >
          <FaPlus />
        </button>
        {showForm && (
          <FormProduct
            onClose={CloseForm}
            // onAddProduct={handleAddProduct}
            // onUpdateProduct={handleUpdateProduct}
            product={currentProduct}
          />
        )}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-4 py-4 max-sm:text-sm">ID</th>
                  <th scope="col" className="px-4 py-4 max-sm:text-sm">NOMBRE</th>
                  <th scope="col" className="px-6 py-4 hidden lg:table-cell max-sm:text-sm">DESCRIPCIÓN</th>
                  <th scope="col" className="px-4 py-4 hidden lg:table-cell max-sm:text-sm">CATEGORÍA</th>
                  <th scope="col" className="px-4 py-4 max-sm:text-sm">CANTIDAD</th>
                  <th scope="col" className="px-4 py-4 max-sm:text-sm">PRECIO</th>
                  <th scope="col" className="px-4 py-4 max-sm:text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={7} className="py-60">
                      <Loading color="#3730a3" size={80} justify="center" />
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={7} className="whitespace-nowrap px-6 py-4 font-medium text-red-600 text-center">
                      Error fetching products
                    </td>
                  </tr>
                ) : isSuccess ? (
                  currentProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                      <td className="whitespace-nowrap px-4 py-4 text-base max-sm:text-sm">{product._id.substring(16, 24)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-base max-sm:text-sm">{product.name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-base hidden lg:table-cell max-sm:text-sm">{product.description}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-base hidden lg:table-cell max-sm:text-sm">{product.category}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-base max-sm:text-sm">{product.quantity}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-base max-sm:text-sm">{product.price}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-base max-sm:text-sm">
                        <div className="flex gap-2">
                          <IoPencil className="cursor-pointer text-indigo-500 hover:text-indigo-800" onClick={() => openFormUpdate(product)} />
                          <MdDelete className="cursor-pointer text-indigo-500 hover:text-indigo-800" onClick={() => deleteProduct({id: product._id})} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : null
              }
              </tbody>
            </table>
            <div className="flex justify-center mt-6">
                <Pagination
                  totalItems={filteredProducts.length}
                  itemsPerPage={productsPerPage}
                  currentPage={currentPage}
                  paginate={setCurrentPage}
                />
                </div>
          </div>
        </div>
      </div>

</div>
);
}
