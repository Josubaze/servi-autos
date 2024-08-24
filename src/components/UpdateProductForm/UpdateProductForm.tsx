'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema } from 'src/utils/validation.zod';
import { useUpdateProductMutation } from 'src/redux/services/productsApi';

type FormProductProps = {
  onClose: () => void;
  product: Product; // El producto seleccionado para editar
};

export const UpdateProductForm = ({
  onClose,
  product,
}: FormProductProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Product>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
    }
  });

  const [updateProduct, { isError }] = useUpdateProductMutation();

  const onSubmit: SubmitHandler<Product> = async (data) => {
    console.log(data);
    // await updateProduct( { ...data, _id: product._id } ).unwrap();
    // onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto bg-gray-900 p-8 rounded-md shadow-md border-2 border-x-gray-600 ">
        <h2 className="text-2xl text-center font-bold mb-6">Editar Producto</h2>
        <div className="mb-4">
          <label className="flex items-center justify-center text-sm font-bold mb-2 gap-2" htmlFor="id">
            ID:
            <input
            type="text"
            id="id"
            {...register('_id')}
            className="border-none w-full py-2 px-3 bg-gray-900"
            readOnly
            />
          </label>
        </div>

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
        {errors.name?.message && <p className='text-red-500 pb-2'>{errors.name.message}</p>}

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
        {errors.description?.message && <p className='text-red-500 pb-2'>{errors.description.message}</p>}

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
        {errors.category?.message && <p className='text-red-500 pb-2'>{errors.category.message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="quantity">
            Cantidad
          </label>
          <input
            type="number"
            id="quantity"
            {...register('quantity')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.quantity?.message && <p className='text-red-500 pb-2'>{errors.quantity.message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="price">
            Precio
          </label>
          <input
            type="number"
            step="0.01"
            id="price"
            {...register('price')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.price?.message && <p className='text-red-500 pb-2'>{errors.price.message}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Actualizar
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        </div>
        {isError && <p className='text-red-500 pt-2 text-center'>Hubo un error al actualizar el producto</p>}
      </form>
    </div>
  );
};
