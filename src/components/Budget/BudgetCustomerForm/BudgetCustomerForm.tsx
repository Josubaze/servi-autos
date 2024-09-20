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
import { useImperativeHandle, forwardRef } from 'react';

export const BudgetCustomerForm = forwardRef((props, ref) => {
    const { data: customers = [], isLoading: isLoadingCustomers, isError, isFetching, isSuccess } = useGetCustomersQuery();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>(CUSTOMERVOID);
    const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
    const [createCustomer, { isError: isErrorCustomer }] = useCreateCustomerMutation();
    const [isNotification, setIsNotification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset , getValues, trigger} = useForm<Omit<Customer, '_id'>>({
        resolver: zodResolver(CustomerSchema),
        defaultValues: selectedCustomer,
    });

    const handleCustomerSelect = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsTableVisible(false);
        reset(customer); 
    };

    const onSubmit: SubmitHandler<Omit<Customer, '_id'>> = async (data) => {
        setIsLoading(true);
        await createCustomer(data).unwrap();
        setIsNotification(true);
        setIsLoading(false);
    };

    const submitForm = async () => {
        const formData = getValues(); 
        const isFormValid = await trigger();
        if (isFormValid) {
            return formData;  
        } else {
            return null;
        }
    };

    useImperativeHandle(ref, () => ({
        submitForm,
    }));

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
                        disabled={isLoading}
                        onClick={handleSubmit(onSubmit)}
                        className={`rounded-xl text-white flex items-center justify-center text-sm h-8 px-2 border-2 border-blue-600 transition ease-in-out delay-150 hover:scale-110 hover:bg-blue-600 duration-300 ${
                            isLoading ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                        >
                        {isLoading && (
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                        )}       
                            {isLoading ? 'Procesando...' : 'Agregar'}
                            {!isLoading && <IoPersonAdd className="h-5 w-5 ml-2" />} 
                    </button>
                </div>
            </div>

            {/* Formulario siempre visible para ingresar nuevo cliente */}
            <form className="w-full pt-4">
            <div className="flex flex-wrap gap-y-2 w-full">
                    <div className="w-full flex flex-wrap gap-x-2">      
                        <input
                            placeholder="Cédula o RIF"
                            {...register("id_card")}
                            className="w-1/4 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                        />
                        {errors.id_card && <p className="my-2 text-red-500">{errors.id_card.message}</p>}

                        <input
                            placeholder="Nombre"
                            {...register("name")}
                            className="w-2/5 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                        />
                        {errors.name && <p className="py-1 text-red-500">{errors.name.message}</p>}
                    </div>                

                    <div className="w-full">
                        <input
                            placeholder="Correo"
                            {...register("email")}
                            className="w-1/2 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                        />
                        {errors.email && <p className="py-1 text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="w-full">
                        <input
                            placeholder="Teléfono"
                            {...register("phone")}
                            className="w-1/2 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                        />
                        {errors.phone && <p className="py-1 text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div className="w-full flex flex-wrap gap-x-2">
                        <input
                            placeholder="Estado"
                            {...register("address.state")}
                            className="w-1/4 px-2 border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                        />
                        {errors.address?.state && <p className="my-2 text-red-500">{errors.address.state.message}</p>}
                        
                        <input
                            placeholder="Ciudad"
                            {...register("address.city")}
                            className="w-2/5 px-2 border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                        />
                        {errors.address?.city && <p className="py-1 text-red-500">{errors.address.city.message}</p>}         
                    </div>
                    {isErrorCustomer && <p className='text-red-500 py-2 text-center'>Hubo un error al tratar de crear el cliente</p>}
                </div>
            </form>

            {isNotification && <Notification message="El cliente ha sido registrado exitosamente!" backgroundColor="bg-green-600" />}

            {/* Modal para la tabla de selección de clientes */}
            {isTableVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-gray-100 p-2 rounded-lg shadow-lg w-3/4">
                        <TableCustomers
                            data={customers}
                            isLoading={isLoadingCustomers}
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
});
