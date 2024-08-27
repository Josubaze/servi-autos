'use client';

import { useState } from 'react';
import { IoPencil } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FormProduct } from 'src/components/ProductForm';
import { UpdateProductForm } from '../UpdateProductForm';
import { FaPlus } from "react-icons/fa6";
import { SearchBar } from 'src/components/SearchBar';
import { Loading } from '../Common/Loading';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDeleteProductMutation, useGetProductsQuery } from 'src/redux/services/productsApi';
import { DataGrid, GridColDef, GridRowsProp, GridCellParams } from '@mui/x-data-grid';

// Define el tema oscuro
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: 'bg-black-nav', 
    },
    text: {
      primary: '#ffffff', 
      secondary: '#b0b0b0', 
    },
  },
});

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 1, sortable: true },
  { field: 'name', headerName: 'Nombre', flex: 0.8, sortable: true },
  { field: 'category', headerName: 'Categoría', flex: 0.8, sortable: false },
  { field: 'price', headerName: 'Precio', flex: 0.8, sortable: true },
  { field: 'quantity', headerName: 'Cantidad', flex: 0.8, sortable: true },
  { field: 'description', headerName: 'Descripción', flex: 2, sortable: false },
  {
    field: 'actions',
    headerName: 'Acciones',
    flex: 0.8,
    sortable: false,
    disableColumnMenu: true,
    align: 'center', 
    headerAlign: 'center',
    renderCell: (params: GridCellParams) => (
      <div className='flex justify-center py-4 gap-5'>
        <IoPencil className="cursor-pointer text-xl text-indigo-500 hover:text-indigo-800" onClick={() => handleEdit(params.row)} />
        <MdDelete className="cursor-pointer text-xl text-indigo-500 hover:text-indigo-800" onClick={() => handleDelete(params.row)} />
      </div>
    ),
  },
];

const handleEdit = (product: Product) => {
  // Open update form with selected product
};

const handleDelete = (product: Product) => {
  // Handle delete action
};

export const TableProducts = () => {
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    _id: '',
    name: '',
    description: '',
    category: '',
    price: 0,
    quantity: 0,
  });

  // Filter and prepare rows
  const filteredData = data.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const rows: GridRowsProp = filteredData.map(product => ({
    id: product._id,
    name: product.name,
    category: product.category,
    price: product.price,
    quantity: product.quantity,
    description: product.description,
  }));

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
        <ThemeProvider theme={darkTheme}>
        <div className='w-full'>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 15]}
            autoHeight {...data}
            slots={{ noRowsOverlay: () => <div className='flex justify-center items-center pt-6'> AGREGA PRODUCTOS..</div>}}
            sx={{ '--DataGrid-overlayHeight': '300px' }}
            disableColumnResize={true}
          />
        </div>
        </ThemeProvider>
      ) : null}

      {showForm && <FormProduct onClose={() => setShowForm(false)} />}
      {showFormUpdate && <UpdateProductForm product={currentProduct} onClose={() => setShowFormUpdate(false)} />}
    </div>
  );
};