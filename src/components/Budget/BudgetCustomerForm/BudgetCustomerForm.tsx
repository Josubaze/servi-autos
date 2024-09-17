import { useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import { useGetCustomersQuery, useCreateCustomerMutation } from "src/redux/services/customersApi";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerSchema } from 'src/utils/validation.zod';
import { CUSTOMERVOID } from "src/utils/constanst";
import { TableCustomers } from "../TableCustomers"; 
import { Notification } from "src/components/Common/Notification";

export const BudgetCustomerForm = () => {
    const { data: customers = [], isLoading, isError, isFetching, isSuccess } = useGetCustomersQuery();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>(CUSTOMERVOID);
    const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
    const [createCustomer, { isError: isErrorCustomer }] = useCreateCustomerMutation();
    const [ isNotification, setIsNotification] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<Customer, '_id'>>({
        resolver: zodResolver(CustomerSchema),
        defaultValues: selectedCustomer,
    });

    const handleCustomerSelect = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsTableVisible(false);
        reset(customer); // Actualiza el formulario con los datos del cliente seleccionado
    };

    const onSubmit: SubmitHandler<Omit<Customer, '_id'>> = async (data) => {
        console.log(data);
        await createCustomer(data).unwrap();
        setIsNotification(true);
    };

    return (
        <>
            {/* Botones para cargar cliente existente o crear nuevo */}
            <div className="flex items-center gap-3">
                <p className="font-title font-bold">Presupuestar a</p>
                <div className="relative">
                    <button
                        type="button"
                        className="rounded-xl text-white flex items-center justify-center text-sm h-8 px-2 border-2 border-green-600 transition ease-in-out delay-150 hover:scale-110 hover:bg-green-600 duration-300"
                        onClick={() => setIsTableVisible(true)} 
                    >
                        <span className="flex items-center justify-center gap-x-2">
                            Cargar
                            <IoPerson className="h-5 w-5"/>
                        </span>
                    </button>
                </div>

                {/* Botón que enviará el formulario de nuevo cliente */}
                <div className="relative">
                    <button
                        type="button"
                        className="rounded-xl text-white flex items-center justify-center text-sm h-8 px-2 border-2 border-blue-600 transition ease-in-out delay-150 hover:scale-110 hover:bg-blue-600 duration-300"
                        onClick={handleSubmit(onSubmit)} // Envío del formulario al hacer clic
                    >
                        <span className="flex items-center justify-center gap-x-2">
                            Agregar
                            <IoPersonAdd className="h-5 w-5"/>
                        </span>
                    </button>
                </div>
            </div>

            {/* Formulario siempre visible para ingresar nuevo cliente */}
            <form className="w-full pt-4">
                <div className="flex flex-wrap gap-y-2 w-full">
                    <div className="w-full">
                        <input
                            placeholder="Nombre"
                            {...register("name")}
                            className="w-1/2 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                        />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="w-full">
                        <input
                            placeholder="Correo"
                            {...register("email")}
                            className="w-3/4 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="w-full">
                        <input
                            placeholder="Teléfono"
                            {...register("phone")}
                            className="w-1/2 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                        />
                        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div className="w-full flex flex-wrap gap-x-2">
                        <input
                            placeholder="Estado"
                            {...register("address.state")}
                            className="w-1/4 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                        />
                        {errors.address?.state && <p className="text-red-500">{errors.address.state.message}</p>}

                        <input
                            placeholder="Ciudad"
                            {...register("address.city")}
                            className="w-1/2 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                        />
                        {errors.address?.city && <p className="text-red-500">{errors.address.city.message}</p>}
                        {isError && <p className='text-red-500 pt-2 text-center'>Hubo un error al tratar de crear el cliente</p>}
                    </div>
                </div>
            </form>
            {isErrorCustomer && <p className='text-red-500 pt-2 text-center'>Hubo un error al tratar de crear el cliente</p>}
            {isNotification && <Notification 
                message="El cliente ha sido registrado exitosamente!" 
                backgroundColor="bg-green-600"
            />}


            {/* Modal para la tabla de selección de clientes */}
            {isTableVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-gray-100 p-2 rounded-lg shadow-lg w-3/4">
                        <TableCustomers
                            data={customers}
                            isLoading={isLoading}
                            isError={isError}
                            isFetching={isFetching}
                            isSuccess={isSuccess}
                            onSelectCustomer={handleCustomerSelect}
                            onCloseTable={() => setIsTableVisible(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
