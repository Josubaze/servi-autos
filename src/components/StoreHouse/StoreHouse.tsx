'use client';

import { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { FaBoxes } from "react-icons/fa";
import { SearchBar } from 'src/components/Common/SearchBar';
import { useDeleteProductMutation, useGetProductsQuery } from 'src/redux/services/productsApi';
import { TableProducts } from './TableProducts';
import { FormProduct } from './ProductForm';
import { UpdateProductForm } from './UpdateProductForm';
import { Notification } from '../Common/Notification';
import { PRODUCTVOID } from 'src/utils/constanst';
import { PageTitle } from '../Common/PageTitle';
import { LottieProduct } from '../Dashboard/DashWidgets/DashWidgets';
import { MarketModal } from '../Common/MarketModal';
import { Button, Tooltip } from '@nextui-org/react';
import { MdStore } from "react-icons/md";

export const StoreHouse = () => {
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetProductsQuery();
  const [deleteProduct, { isError: isErrorDelete }] = useDeleteProductMutation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(PRODUCTVOID);

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setShowFormUpdate(true);
  };

  const handleDelete = async (productId: string) => {
    await deleteProduct(productId);
  };

  return (
    <>
      <div className="flex justify-center items-center">  
        <LottieProduct loop className="h-20 pt-2" />
        <PageTitle title="GESTIÓN DE ALMACÉN"/>
      </div>
      <div className="relative flex flex-col pb-6 px-0 sm:px-12">
        <div className="my-4 flex justify-between items-center gap-2 pb-2">
        <Button
              radius="md"
              className="h-14 text-gray-100 bg-green-600"
              variant="solid"
              onClick={() => setShowForm(true)}
            >
              <span className='flex items-center justify-center gap-x-2'>
                <FaBoxes/>
                Agregar Producto
              </span>
        </Button>

          <div className='flex gap-x-2'>
            <Tooltip content="Consultar Mercado">
              <Button
                radius="md"
                className="h-14 bg-yellow-500"
                variant="solid"
                onClick={() => setShowMarket(true)}
              >
                <MdStore className="h-8 w-8 text-gray-100"/>
              </Button>
            </Tooltip>    

            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </div>
        </div>

        <TableProducts
          data={data}
          searchTerm={searchTerm}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          isSuccess={isSuccess}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />

        <button
          className="bg-emerald-600 hover:bg-emerald-800 text-3xl text-white p-5 rounded-full fixed bottom-0 right-0 mr-8 mb-12 shadow-2xl shadow-emerald-400 sm:hidden z-50"
          onClick={() => setShowForm(true)}
        >
          <FaPlus />
        </button>

        {isErrorDelete && 
          <Notification message="Hubo un error al borrar el producto" />
        }
        {showForm && <FormProduct onClose={() => setShowForm(false)} />}
        {showFormUpdate && <UpdateProductForm product={currentProduct} onClose={() => setShowFormUpdate(false)} />}

        {
          showMarket && (
            <MarketModal isOpen={showMarket} onClose={() => setShowMarket(false)} />
          )
        }

      </div>
    </>
  );
};
