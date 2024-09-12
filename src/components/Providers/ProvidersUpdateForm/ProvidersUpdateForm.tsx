import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProviderSchema } from 'src/utils/validation.zod'; // Asegúrate de tener un esquema para proveedores
import { useUpdateProviderMutation } from 'src/redux/services/providersApi'; // Asegúrate de tener un servicio para proveedores

type FormProviderProps = {
  onClose: () => void;
  provider: Provider; 
};

export const ProviderUpdateForm = ({
  onClose,
  provider,
}: FormProviderProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Provider>({
    resolver: zodResolver(ProviderSchema),
    defaultValues: {
      _id: provider._id,
      name: provider.name,
      contactName: provider.contactName,
      email: provider.email,
      phone: provider.phone,
      address: {
        city: provider.address.city,
        state: provider.address.state
      }
    }
  });

  const [updateProvider, { isError }] = useUpdateProviderMutation();

  const onSubmit: SubmitHandler<Provider> = async (data) => {
    await updateProvider({
      ...data,
      _id: provider._id
    }).unwrap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto bg-gray-900 p-8 rounded-md shadow-md border-2 border-x-gray-600">
        <h2 className="text-2xl text-center font-bold mb-6">Editar Proveedor</h2>
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
            Nombre de Empresa
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
          <label className="block text-sm font-bold mb-2" htmlFor="contactName">
            Nombre de Contacto
          </label>
          <input
            type="text"
            id="contactName"
            {...register('contactName')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.contactName && <p className='text-red-500 pb-2'>{errors.contactName.message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.email?.message && <p className='text-red-500 pb-2'>{errors.email.message}</p>}

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
        {errors.phone?.message && <p className='text-red-500 pb-2'>{errors.phone.message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="city">
            Ciudad
          </label>
          <input
            type="text"
            id="address.city"
            {...register('address.city')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.address?.city?.message && <p className='text-red-500 pb-2'>{errors.address.city.message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="state">
            Estado
          </label>
          <input
            type="text"
            id="address.state"
            {...register('address.state')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.address?.state?.message && <p className='text-red-500 pb-2'>{errors.address.state.message}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="transition ease-in-out delay-150 bg-emerald-600 text-white px-4 py-2 rounded hover:-translate-y-1 hover:scale-110 hover:bg-indigo-600 duration-300"
          >
            Actualizar
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 hover:bg-indigo-600 transition ease-in-out delay-150 text-white px-4 py-2 rounded hover:-translate-y-1 hover:scale-110 duration-300"
          >
            Cancelar
          </button>
        </div>
        {isError && <p className='text-red-500 pt-2 text-center'>Hubo un error al actualizar el proveedor</p>}
      </form>
    </div>
  );
};
