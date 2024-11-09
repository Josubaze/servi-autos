
import { useForm, SubmitHandler } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { ProductSchema } from 'src/utils/validation.zod';
import { useCreateProductMutation } from 'src/redux/services/productsApi';

type FormProductProps = {
  onClose: () => void;
};

export const FormProduct = ({
  onClose,
}: FormProductProps) => {
  const { register, handleSubmit ,formState: {errors} } = useForm<Omit<Product, '_id'>>({
    resolver: zodResolver(ProductSchema),
  });
  const [ createProduct, {isError} ] = useCreateProductMutation()

  const onSubmit: SubmitHandler<Omit<Product, '_id'>> = async (data) => {
    await createProduct(data).unwrap();
    onClose();
  }
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
        {errors.name?.message && <p className='text-red-500 pb-2'>{errors.name.message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
          Modelo de Vehículo
          </label>
          <input
            type="text"
            id="vehicleType"
            {...register('vehicleType')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.vehicleType?.message && <p className='text-red-500 pb-2'>{errors.vehicleType.message}</p>}

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
            className="transition ease-in-out delay-150 bg-emerald-600 text-white px-4 py-2 rounded hover:-translate-y-1 hover:scale-110 hover:bg-indigo-600 duration-300"
          >
            Agregar
          </button>
      
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 hover:bg-indigo-600 transition ease-in-out delay-150  text-white px-4 py-2 rounded hover:-translate-y-1 hover:scale-110 duration-300"
          >
            Cancelar
          </button>
        </div>
      {isError && <p className='text-red-500 pt-2 text-center'>Hubo un error al tratar de crear el producto</p>}  
      </form>
    </div>
  );
};
