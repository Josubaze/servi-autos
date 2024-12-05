import { useState } from "react";
import { useGetCustomersQuery, useCreateCustomerMutation } from "src/redux/services/customersApi";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerSchema } from 'src/utils/validation.zod';
import { CUSTOMERVOID } from "src/utils/constanst";
import { Notification } from "src/components/Common/Notification";
import { useImperativeHandle, forwardRef } from 'react';
import TextField from '@mui/material/TextField';
import { ThemeProvider } from "@mui/material/styles";
import { TextFieldTheme } from 'src/styles/themes/themeTextField';
import { SelectCustomerButton } from "./SelectCustomerButton"; 
import { CreateCustomerButton } from "./CreateCustomerButton";  
import { SelectCustomers } from "src/components/Common/SelectCustomers";

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
        reset(customer);
    };

    const onSubmit: SubmitHandler<Omit<Customer, '_id'>> = async (data) => {
        setIsLoading(true);
        try {
            await createCustomer(data).unwrap();
            setIsNotification(true);
        } catch (error) {            
        } finally {
            setIsLoading(false);
        }
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

     // Función para actualizar los datos
    const setFormCustomer = (customer: Customer ) => {
        setValue("id_card", customer.id_card);
        setValue("name", customer.name);
        setValue("email", customer.email);
        setValue("phone", customer.phone);
        setValue("address", customer.address);
    };

    const resetForm = () => {
        // Reinicia los campos del formulario al estado inicial
        reset(CUSTOMERVOID);
    };

    useImperativeHandle(ref, () => ({
        submitForm,
        setFormCustomer,
        resetForm
    }));

    return (
        <>
            {/* Botones para cargar cliente existente o crear nuevo */}
            <div className="flex items-center gap-4">
                <p className="font-title font-bold">Presupuestar a</p>

                {/* Botón de Seleccionar Cliente */}
                <SelectCustomerButton onClick={() => setIsTableVisible(true)} />

                {/* Botón de Crear Cliente */}
                <CreateCustomerButton isLoading={isLoading} onClick={handleSubmit(onSubmit)} />
            </div>

            <form className="w-full pt-4 sm:pr-6">
                <div className="bg-black-nav rounded-lg border-y-2 border-gray-500 p-4">
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
                </div>
            </form>

            {isNotification && <Notification message="El cliente ha sido registrado exitosamente!" backgroundColor="bg-green-600" />}
            {isErrorCustomer && <Notification message="Ha fallado el registro del cliente!" backgroundColor="bg-red-600" /> }

            {/* Modal para la tabla de selección de clientes */}
            {isTableVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                    <SelectCustomers
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
