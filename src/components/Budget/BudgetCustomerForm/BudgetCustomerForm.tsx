import { useEffect, useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import { useGetCustomersQuery, useCreateCustomerMutation } from "src/redux/services/customersApi";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerSchema } from 'src/utils/validation.zod';
import { CUSTOMERVOID } from "src/utils/constanst";
import { TableCustomers } from "../TableCustomers"; 
import { Notification } from "src/components/Common/Notification";
import { useImperativeHandle, forwardRef } from 'react';
import TextField from '@mui/material/TextField';
import { ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from 'src/styles/themes/themeTextField';

export const BudgetCustomerForm = forwardRef((props, ref) => {
    const { data: customers = [], isLoading: isLoadingCustomers, isError, isFetching, isSuccess } = useGetCustomersQuery();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>(CUSTOMERVOID);
    const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
    const [createCustomer, { isError: isErrorCustomer }] = useCreateCustomerMutation();
    const [isNotification, setIsNotification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, formState: { errors }, reset, getValues, trigger, setValue } = useForm<Omit<Customer, '_id'>>({
        resolver: zodResolver(CustomerSchema),
        defaultValues: selectedCustomer
    });

    const handleCustomerSelect = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsTableVisible(false);
        reset(customer); // cambiar los datos por los cargados
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

            <form className="w-full pt-4 sm:pr-4">
                <div className="grid gap-y-4 w-full">
                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 gap-x-6 w-full">
                        <div className="w-full">
                            <ThemeProvider theme={TextFieldTheme}>
                                <Controller
                                    control={control}
                                    name="id_card"
                                    render={({ field }) => (
                                        <TextField
                                            label="Cédula | RIF"
                                            variant="outlined"
                                            fullWidth
                                            type="text"
                                            {...field}
                                            error={!!errors.id_card}
                                            helperText={errors.id_card?.message}
                                        />
                                    )}
                                />
                            </ThemeProvider>
                        </div>

                        <div className="w-full">
                            <ThemeProvider theme={TextFieldTheme}>
                                <Controller
                                    control={control}
                                    name="phone"
                                    render={({ field }) => (
                                        <TextField
                                            label="Teléfono"
                                            variant="outlined"
                                            fullWidth
                                            type="text"
                                            {...field}
                                            error={!!errors.phone}
                                            helperText={errors.phone?.message}
                                        />
                                    )}
                                />
                            </ThemeProvider>
                        </div>
                    </div>

                    {/* Campos individuales */}
                    <div className="w-full">
                        <ThemeProvider theme={TextFieldTheme}>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <TextField
                                        label="Nombre"
                                        variant="outlined"
                                        fullWidth
                                        type="text"
                                        {...field}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                        </ThemeProvider>
                    </div>

                    <div className="w-full">
                        <ThemeProvider theme={TextFieldTheme}>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field }) => (
                                    <TextField
                                        label="Correo Electrónico"
                                        variant="outlined"
                                        fullWidth
                                        type="text"
                                        {...field}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </ThemeProvider>
                    </div>

                    <div className="w-full">
                        <ThemeProvider theme={TextFieldTheme}>
                            <Controller
                                control={control}
                                name="address"
                                render={({ field }) => (
                                    <TextField
                                        label="Dirección"
                                        variant="outlined"
                                        fullWidth
                                        type="text"
                                        {...field}
                                        error={!!errors.address}
                                        helperText={errors.address?.message}
                                    />
                                )}
                            />
                        </ThemeProvider>
                    </div>
                </div>
            </form>

            {isNotification && <Notification message="El cliente ha sido registrado exitosamente!" backgroundColor="bg-green-600" />}

            {/* Modal para la tabla de selección de clientes */}
            {isTableVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
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
            )}
        </>
    );
});

BudgetCustomerForm.displayName = 'BudgetCustomerForm';
