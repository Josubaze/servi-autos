import { useState } from 'react'; 
import { useForm, SubmitHandler } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { ServiceSchema } from 'src/utils/validation.zod'; 
import { useCreateServiceMutation } from 'src/redux/services/servicesApi'; 
import { TableProducts } from '../TableProducts'; 
import { useGetProductsQuery } from 'src/redux/services/productsApi'; 
import Tooltip from '@mui/material/Tooltip'; 
import { MdDelete } from "react-icons/md"; 

type FormServiceProps = { onClose: () => void; };

export const ServiceForm = ({ onClose }: FormServiceProps) => { 
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Service, '_id'>>({ resolver: zodResolver(ServiceSchema) });

  const { data = [], isError: isErrorProducts, isLoading, isFetching, isSuccess } = useGetProductsQuery(); 
  const [createService, { isError }] = useCreateServiceMutation(); 
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]); 
  const [isProductTableVisible, setIsProductTableVisible] = useState(false); 

  // Función para manejar la selección de productos
  const handleProductSelect = (product: Product) => { 
    if (!product.name) { 
      console.error("El producto seleccionado no tiene un 'name'"); 
    } 
    setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]); // Establecer cantidad inicial en 1
    setIsProductTableVisible(false); 
  }; 

  // Función para manejar el cambio en la cantidad
  const handleQuantityChange = (index: number, newQuantity: number) => { 
    const updatedProducts = [...selectedProducts]; 
    updatedProducts[index].quantity = newQuantity; 
    setSelectedProducts(updatedProducts);
  }; 

  const onSubmit: SubmitHandler<Omit<Service, '_id'>> = async (data) => { 
    // Aquí se procesaría la lógica de enviar los datos, como antes
    // const serviceData = { ...data, products: selectedProducts };
    // await createService(serviceData).unwrap();
    // onClose(); 
  }; 

  return ( 
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"> 
      {isProductTableVisible ? ( 
        <TableProducts 
          data={data} 
          onSelectProduct={handleProductSelect} 
          onCloseTable={() => setIsProductTableVisible(false)} 
        /> 
      ) : ( 
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-full  md:max-w-2xl lg:max-w-3xl mx-auto bg-black-nav p-8 rounded-md shadow-md border-2 border-x-gray-600"> 
          <h2 className="text-2xl text-center font-bold mb-6">Nuevo Servicio</h2> 

          <div className="mb-4"> 
            <label className="block text-sm font-bold mb-2" htmlFor="name"> Nombre del Servicio </label> 
            <input 
              type="text" 
              id="name" 
              {...register('name')} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            /> 
            {errors.name && <p className="text-red-500">{errors.name.message}</p>} 
          </div>

          <div className="mb-4"> 
            <label className="block text-sm font-bold mb-2" htmlFor="price"> Precio del Servicio </label> 
            <input 
              type="number" 
              id="price" 
              {...register('servicePrice')} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            /> 
            {errors.servicePrice && <p className="text-red-500">{errors.servicePrice.message}</p>} 
          </div>

          <button 
            type="button" 
            onClick={() => setIsProductTableVisible(true)} 
            className="bg-blue-500 text-white px-4 py-2 rounded" 
          > 
            Seleccionar Productos 
          </button>

          {/* Lista de productos seleccionados */}
          <div className="mt-4"> 
            <h3 className="font-bold text-xl mb-2">Productos Seleccionados:</h3> 
            {selectedProducts.length > 0 ? ( 
              <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md"> 
                <table className="min-w-full table-auto text-gray-200"> 
                  <thead> 
                    <tr className="border-b border-gray-600"> 
                      <th className="px-4 py-2 text-left">Nombre</th> 
                      <th className="px-4 py-2 text-left">Cantidad</th> 
                      <th className="px-4 py-2 text-left">Precio</th> 
                      <th className="px-4 py-2 text-left">Total</th> 
                      <th className="px-4 py-2 text-left">Acción</th> 
                    </tr> 
                  </thead> 
                  <tbody> 
                    {selectedProducts.map((product, index) => ( 
                      <tr key={index} className="border-b border-gray-600"> 
                        <td className="px-4 py-2">{product.name}</td> 
                        <td className="px-4 py-2"> 
                          <input 
                            type="number" 
                            min="1" 
                            value={product.quantity} 
                            onChange={(e) => handleQuantityChange(index, Number(e.target.value))} 
                            className="bg-gray-700 text-white p-2 rounded-md w-20" 
                          /> 
                        </td> 
                        <td className="px-4 py-2">${product.price.toFixed(2)}</td> 
                        <td className="px-4 py-2">${product.quantity * product.price}</td> 
                        <td className="px-4 py-2 text-center"> 
                          <Tooltip title="Eliminar producto"> 
                            <span> 
                              <MdDelete 
                                className="cursor-pointer text-2xl text-gray-600 hover:text-red-600 transition ease-in-out delay-150 rounded hover:-translate-y-1 hover:scale-150 duration-300" 
                                onClick={() => setSelectedProducts((prev) => prev.filter((_, i) => i !== index))} 
                              /> 
                            </span> 
                          </Tooltip> 
                        </td> 
                      </tr> 
                    ))} 
                  </tbody> 
                </table> 
              </div> 
            ) : ( 
              <p>No hay productos seleccionados.</p> 
            )}
          </div>

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
              className="bg-gray-500 text-white px-4 py-2 rounded" 
            > 
              Cancelar 
            </button> 
          </div>
        </form> 
      )} 
    </div> 
  ); 
};
