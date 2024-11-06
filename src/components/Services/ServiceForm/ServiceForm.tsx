import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ServiceSchema } from 'src/utils/validation.zod';
import { useCreateServiceMutation } from 'src/redux/services/servicesApi';
import { TableProducts } from '../TableProducts';
import { useGetProductsQuery } from 'src/redux/services/productsApi';

type FormServiceProps = {
  onClose: () => void;
};

export const ServiceForm = ({ onClose  }: FormServiceProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Service, '_id'>>({
    resolver: zodResolver(ServiceSchema),
  });
  const { data = [], isError: isErrorProducts, isLoading, isFetching, isSuccess } = useGetProductsQuery();
  const [createService, { isError }] = useCreateServiceMutation();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isProductTableVisible, setIsProductTableVisible] = useState(false);

  const handleProductSelect = (product: Product) => {
    setSelectedProducts((prev) => [...prev, product]);
    setIsProductTableVisible(false);
  };

  const onSubmit: SubmitHandler<Omit<Service, '_id'>> = async (data) => {
    // const serviceData = { ...data, products: selectedProducts };
    // await createService(serviceData).unwrap();
    // onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto bg-gray-900 p-8 rounded-md shadow-md border-2 border-x-gray-600">
        <h2 className="text-2xl text-center font-bold mb-6">Nuevo Servicio</h2>

        {/* Campo de Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            Nombre del Servicio
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Otros campos como precio y cantidad */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="price">
            Precio del Servicio
          </label>
          <input
            type="number"
            id="price"
            {...register('servicePrice')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.servicePrice && <p className="text-red-500">{errors.servicePrice.message}</p>}
        </div>

        {/* Botón para seleccionar productos */}
        <button
          type="button"
          onClick={() => setIsProductTableVisible(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Seleccionar Productos
        </button>

        {/* Lista de productos seleccionados */}
        <div className="mt-4">
          <h3 className="font-bold">Productos Seleccionados:</h3>
          {selectedProducts.length > 0 ? (
            <ul>
              {selectedProducts.map((product, index) => (
                <li key={index} className="flex justify-between py-1">
                  <span>{product.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedProducts((prev) => prev.filter((_, i) => i !== index))}
                    className="text-red-500"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay productos seleccionados.</p>
          )}
        </div>

        {/* Botones de enviar y cancelar */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Crear Servicio
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>

        {isError && <p className="text-red-500">Error al crear el servicio.</p>}
      </form>

      {/* Modal de selección de productos */}
      {isProductTableVisible && (
        <TableProducts
          data={data}
          onSelectProduct={handleProductSelect}
          onCloseTable={() => setIsProductTableVisible(false)}
        />
      )}
    </div>
  );
};
