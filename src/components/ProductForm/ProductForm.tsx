'use client';


import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { AddProduct, UpdateProduct } from 'src/actions';
import { useForm, SubmitHandler } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { ProductSchema } from 'src/utils/validation.zod';

type Inputs = {
  name: string;
  description: string;
  category: string;
  price: string;
  quantity: string;
}

type FormProductProps = {
  onClose: () => void;
  onAddProduct: (formData: FormData) => Promise<void>;
  onUpdateProduct: (formData: FormData) => Promise<void>;
  product?: Product | null; // Puede ser opcional o null si es un nuevo producto
};

export const FormProduct = ({
  onClose,
  onAddProduct,
  // onUpdateProduct,
  // product,
}: FormProductProps) => {

  const { register, handleSubmit ,formState: {errors} } = useForm<Inputs>({
    resolver: zodResolver(ProductSchema),
  }); 

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto bg-gray-900 p-8 rounded-md shadow-md border-2 border-x-gray-600 ">
        <h2 className="text-2xl text-center font-bold mb-6">Nuevo Producto</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.name?.message && <p className='text-red-700 pb-2'>{errors.name.message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="description">
            Descripción
          </label>
          <input
            type="text"
            id="description"
            {...register('description')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.description?.message && <p className='text-red-700 pb-2'>{errors.description.message}</p>}
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="category">
            Categoría
          </label>
          <input
            type="text"
            id="category"
            {...register('category')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.category?.message && <p className='text-red-700 pb-2'>{errors.category.message}</p>}
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="quantity">
            Cantidad
          </label>
          <input
            
            id="quantity"
            {...register('quantity')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.quantity?.message && <p className='text-red-700 pb-2'>{errors.quantity.message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="price">
            Precio
          </label>
          <input
            type="float"
            id="price"
            {...register('price')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.price?.message && <p className='text-red-700 pb-2'>{errors.price.message}</p>}
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Agregar
          </button>
      
          <button
            type="button"
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        </div>
      </form>

    </div>
  );
};
