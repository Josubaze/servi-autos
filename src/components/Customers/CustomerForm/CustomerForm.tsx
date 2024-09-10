import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerSchema } from 'src/utils/validation.zod';
import { useCreateCustomerMutation } from 'src/redux/services/customersApi';

type FormCustomerProps = {
  onClose: () => void;
};

export const CustomerForm = ({
  onClose,
}: FormCustomerProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Customer, '_id'>>({
    resolver: zodResolver(CustomerSchema),
  });
  const [createCustomer, { isError }] = useCreateCustomerMutation();

  const onSubmit: SubmitHandler<Omit<Customer, '_id'>> = async (data) => {
    await createCustomer(data).unwrap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto bg-gray-900 p-8 rounded-md shadow-md border-2 border-x-gray-600 ">
        <h2 className="text-2xl text-center font-bold mb-6">Nuevo Cliente</h2>
        
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
        {errors.name && <p className='text-red-500 pb-2'>{errors.name.message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            type="text"
            id="email"
            {...register('email')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.email && <p className='text-red-500 pb-2'>{errors.email.message}</p>}
        
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="phone">
            Teléfono
          </label>
          <input
            type="text"
            id="phone"
            {...register('phone')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.phone && <p className='text-red-500 pb-2'>{errors.phone.message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="address_city">
            Ciudad
          </label>
          <input
            type="text"
            id="address_city"
            {...register('address.city')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.address?.city && <p className='text-red-500 pb-2'>{errors.address.city.message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="address_state">
            Estado
          </label>
          <input
            type="text"
            id="address_state"
            {...register('address.state')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.address?.state && <p className='text-red-500 pb-2'>{errors.address.state.message}</p>}
        
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
        {isError && <p className='text-red-500 pt-2 text-center'>Hubo un error al tratar de crear el cliente</p>}
      </form>
    </div>
  );
};
