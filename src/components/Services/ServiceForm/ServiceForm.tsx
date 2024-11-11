import { useState } from 'react'; 
import { useForm, SubmitHandler } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { ServiceSchema } from 'src/utils/validation.zod'; 
import { useCreateServiceMutation } from 'src/redux/services/servicesApi'; 
import { TableProducts } from '../TableProducts'; 
import { useGetProductsQuery } from 'src/redux/services/productsApi'; 
import { Notification } from 'src/components/Common/Notification';
import TextField from '@mui/material/TextField';
import {  ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from 'src/styles/themes/themeTextField';
import Tooltip from '@mui/material/Tooltip';
import { MdDelete } from "react-icons/md";

type FormServiceProps = { onClose: () => void; };

export const ServiceForm = ({ onClose }: FormServiceProps) => { 
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Service, '_id'>>({
    resolver: zodResolver(ServiceSchema),
  });
  const { data = [], isError: isErrorProducts } = useGetProductsQuery(); 
  const [createService, { isError }] = useCreateServiceMutation(); 
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]); 
  const [isProductTableVisible, setIsProductTableVisible] = useState(false); 

  const handleProductSelect = (product: Product) => { 
    if (!product.name) { 
      console.error("El producto seleccionado no tiene un 'name'"); 
    } 
    setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]); 
    setIsProductTableVisible(false); 
  }; 

  const handleQuantityChange = (index: number, newQuantity: number) => { 
    const updatedProducts = [...selectedProducts]; 
    updatedProducts[index].quantity = newQuantity; 
    setSelectedProducts(updatedProducts);
  }; 

  const onSubmit: SubmitHandler<Omit<Service, '_id'>> = async (data) => { 
    const formData = {
      ...data,
      products: selectedProducts.map(product => ({
        product: product._id, // Asegúrate de enviar solo el ID del producto, no el objeto con `productId`
        quantity: product.quantity,
      })),
    };
    await createService(formData).unwrap();
    onClose();
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
            <ThemeProvider theme={TextFieldTheme}>
              <TextField 
                label="Nombre del Servicio" 
                variant="outlined"
                fullWidth
                {...register('name')} 
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </ThemeProvider>
          </div>

          <div className="mb-4"> 
          <ThemeProvider theme={TextFieldTheme}>
            <TextField 
                label="Precio del Servicio" 
                variant="outlined"
                fullWidth
                type="number" 
                {...register('servicePrice')} 
                error={!!errors.servicePrice}
                helperText={errors.servicePrice?.message}  
              />
          </ThemeProvider>
          </div>

          <button 
            type="button" 
            onClick={() => setIsProductTableVisible(true)} 
            className="bg-gray-600 text-white px-4 py-2 rounded transition ease-in-out delay-150 hover:scale-110 hover:bg-blue-700 duration-300" 
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
          {isErrorProducts && <Notification message='Error al cargar productos!' /> }
          {isError && <Notification message='Error al cargar el Servicio!' /> }
          <div className="flex justify-between mt-6"> 
            <button 
              type="submit" 
              className="bg-green-600 text-white px-11 py-2 rounded transition ease-in-out delay-150 hover:scale-110 hover:bg-green-700 duration-300" 
            > 
              Crear Servicio 
            </button> 
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-600 text-white px-4 py-2 rounded transition ease-in-out delay-150 hover:scale-110 hover:bg-red-700 duration-300" 
            > 
              Cancelar 
            </button> 
          </div>
        </form> 
      )} 
    </div> 
  ); 
};
