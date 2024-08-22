'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { AddProduct, UpdateProduct } from 'src/actions';

const initialState = {
  errors: [],
  shouldClose: false,
  newProduct: null
};

export const FormProduct = ({ onClose, onAddProduct, onUpdateProduct, product }: any) => {
  const [status, formAction] = useFormState(
    product ? UpdateProduct : AddProduct, 
    initialState
  );

  useEffect(() => {
    if (status.shouldClose) {
      if (product) {
        onUpdateProduct(status.newProduct);
      } else {
        onAddProduct(status.newProduct);
      }
      onClose();
    }
  }, [status.shouldClose, status.newProduct,  onClose, onAddProduct, onUpdateProduct, product]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <form action={formAction} className="w-full max-w-lg mx-auto bg-gray-900 p-8 rounded-md shadow-md border-2 border-x-gray-600 ">
        <h2 className="text-2xl text-center font-bold mb-6">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        
        {product ? 
        (
          <div className="mb-4">
            <label className="flex items-center justify-center text-sm font-bold mb-2 gap-2" htmlFor="id">
              ID:
              <input
              type="text"
              id="id"
              name="id"
              defaultValue={product?._id || ''}
              className="border-none w-full py-2 px-3 bg-gray-900"
              required
              readOnly
              />
            </label>
          </div>
        ) : null }
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={product?.name || ''}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="description">
            Descripción
          </label>
          <input
            type="text"
            id="description"
            name="description"
            defaultValue={product?.description || ''}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="category">
            Categoría
          </label>
          <input
            type="text"
            id="category"
            name="category"
            defaultValue={product?.category || ''}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="quantity">
            Cantidad
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            defaultValue={product?.quantity || ''}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="price">
            Precio
          </label>
          <input
            type="float"
            id="price"
            name="price"
            defaultValue={product?.price || ''}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {product ? 'Actualizar' : 'Agregar'}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        </div>
        {status?.errors ? status.errors.map((error: any, index: number) => <p className="text-sm text-center" key={`${error.message}-${index}`}>{error.message}</p>) : null}
        {status?.error ? <p className="text-sm text-center">{status.error}</p> : null}
      </form>
    </div>
  );
};
