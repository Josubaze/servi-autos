'use client';

import { useState } from 'react';
import { IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FormProduct } from 'src/components/ProductForm';
import { UpdateProductForm } from '../UpdateProductForm';
import { FaPlus } from "react-icons/fa6";
import { SearchBar } from 'src/components/SearchBar';
import { Loading } from '../Common/Loading';
import MUIDataTable from "mui-datatables";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { useDeleteProductMutation, useGetProductsQuery } from 'src/redux/services/productsApi';
import { BasicModal } from '../Common/Modal';
import { useProductFilter } from 'src/hooks/useProductFilter';
import { darkTheme, useResponsiveColumns } from './style';

const options = {
  responsive: "standard",
  search: false,
  selectableRows: "none",
  pagination: true,
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 15],
  textLabels: {
    body: {
      noMatch: "AGREGA PRODUCTOS..",
    },
  },
};

export const TableProducts = () => {
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetProductsQuery();
  const [deleteProduct, {isError: isErrorDelete}] = useDeleteProductMutation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    _id: '',
    name: '',
    description: '',
    category: '',
    price: 0,
    quantity: 0,
  }); 

  const columns = [
    { 
      name: "id", 
      label: "ID", 
      options: { filter: false, sort: true } 
    },
    { 
      name: "name", 
      label: "Nombre", 
      options: { filter: true, sort: true } 
    },
    { 
      name: "description", 
      label: "Descripción", 
      options: { filter: false, sort: false },
    },
    { 
      name: "category", 
      label: "Categoría", 
      options: { filter: true, sort: false } 
    },
    { 
      name: "quantity", 
      label: "Cantidad", 
      options: { filter: false, sort: true } 
    },
    { 
      name: "price", 
      label: "Precio", 
      options: { filter: false, sort: true } 
    },
    
    {
      name: "Acciones",
      label: "Opciones",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (value: any, tableMeta: any) => {
          const rowData = tableMeta.rowData;
          const product = {
            _id: rowData[0],
            name: rowData[1],
            description: rowData[2],
            category: rowData[3],
            quantity: rowData[4],
            price: rowData[5],
            
          };      
          return (
            <div className='flex py-2 gap-5'>
              <IoPencil
                className="cursor-pointer text-2xl text-indigo-600 hover:text-indigo-800"
                onClick={() => handleEdit(product)}
              />
              <MdDelete
                className="cursor-pointer text-2xl text-indigo-600 hover:text-indigo-800"
                onClick={() => handleDelete(product._id)}
              />
            </div>
          );
        },
      },
    }
  ];

  const responsiveColumns = useResponsiveColumns(columns);
  const filteredData = useProductFilter(data, searchTerm )
  const rows = filteredData.map(product => ({
    id: product._id,
    name: product.name,
    description: product.description,
    category: product.category,
    quantity: product.quantity,
    price: product.price,
  }));
    
  const handleEdit = (product: any) => {
    setCurrentProduct(product);
    setShowFormUpdate(true);
  };
  const handleDelete = async (productId: string) => {
    await deleteProduct(productId);
    if (isErrorDelete) {
      setOpenModal(true);
    }
  };

  return (
    <div className="flex flex-col py-6 px-12">
      <div className="my-4 flex justify-between items-center gap-2 pb-2">
        <button
          className="bg-emerald-600 hover:bg-emerald-800 text-white px-4 py-2 rounded max-sm:hidden"
          onClick={() => setShowForm(true)}
        >
          <span className='flex items-center gap-2'>
            <FaPlus />
            Agregar Producto
          </span>
        </button>

        <button
          className="bg-emerald-600 hover:bg-emerald-800 text-white p-4 rounded-full fixed bottom-0 right-0 mr-3 mb-8 shadow-2xl shadow-emerald-300 sm:hidden"
          onClick={() => setShowForm(true)}
        >
          <FaPlus />
        </button>
        
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      
      {isLoading || isFetching ? (
        <Loading color="#3730a3" size={100} justify="center" pt={32} />
      ) : isError ? (
        <p className="text-red-600">Error fetching products</p>
      ) : isSuccess ? (
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={darkTheme}>
            <MUIDataTable
              title={"Lista de Productos"}
              data={rows}
              columns={responsiveColumns}
              options={options}
            />
          </ThemeProvider>
        </StyledEngineProvider>
      ) : null}
      <BasicModal 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        message="No se ha podido borrar el producto!" 
      />
      {showForm && <FormProduct onClose={() => setShowForm(false)} />}
      {showFormUpdate && <UpdateProductForm product={currentProduct} onClose={() => setShowFormUpdate(false)} />}
    </div>
  );
};
