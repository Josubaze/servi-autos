import { useState } from "react";
import { useGetCustomersQuery, useCreateCustomerMutation } from "src/redux/services/customersApi";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerSchema } from 'src/utils/validation.zod';
import { CUSTOMERVOID } from "src/utils/constanst";
import { useImperativeHandle, forwardRef } from 'react';
import { SelectCustomers } from "src/components/Common/SelectCustomers";
import { OptionsCustomerForm } from "../OptionsCustomerForm";
import { toast } from "react-toastify";
import { Input } from "@nextui-org/react";

// Define la interfaz para el ref
interface FormHandle {
    submitFormCustomer: () => void;
}

// Define la interfaz para los props
interface CustomerFormProps {
    title: string;
}

// Componente con forwardRef
export const CustomerForm = forwardRef<FormHandle, CustomerFormProps>(({ title }, ref) => {
    const { data: customers = [], isLoading: isLoadingCustomers, isError, isFetching, isSuccess } = useGetCustomersQuery();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>(CUSTOMERVOID);
    const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
    const [createCustomer ] = useCreateCustomerMutation();
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
            toast.success('Cliente registrado exitosamente')
        } catch (error) {    
            toast.error('Ha ocurrido un error al intentar registrar')        
        } finally {
            setIsLoading(false);
        }
    };

    const getFormCustomer = () => {
        return getValues(); // Retorna los valores actuales del formulario
    };

    const submitFormCustomer = async () => {
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

    const resetFormCustomer = () => {
        // Reinicia los campos del formulario al estado inicial
        reset(CUSTOMERVOID);
    };

    useImperativeHandle(ref, () => ({
        submitFormCustomer,
        setFormCustomer,
        resetFormCustomer,
        getFormCustomer,
    }));

    return (
        <>
            {/* botones para cargar al form o guardar en bdd */}
            <OptionsCustomerForm
                setIsTableVisible={setIsTableVisible}
                isLoading={isLoading}
                handleFormSubmit={handleSubmit(onSubmit)}
            />
            <form className="w-full pt-4 sm:pr-6">
                <div className="bg-black-nav/50 rounded-lg p-4">
                    <div className="grid gap-y-2 w-full">
                        <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 gap-x-6 w-full">
                            <div className="w-full">
                            <div className="text-sm h-6">{title}</div>
                            <Controller
                                control={control}
                                name="id_card"
                                render={({ field }) => (
                                    <Input
                                        size="md"
                                        label="Cédula | RIF"
                                        type="text"
                                        variant="underlined"
                                        {...field}
                                        isInvalid={!!errors.id_card}
                                        errorMessage={errors.id_card?.message}
                                        fullWidth
                                    />
                                )}
                            />
                            </div>

                            <div className="w-full pt-6">
                                <Controller
                                    control={control}
                                    name="phone"
                                    render={({ field }) => (
                                        <Input
                                            size="md"
                                            label="Teléfono"
                                            variant="underlined"
                                            type="text"
                                            {...field}
                                            isInvalid={!!errors.id_card}
                                            errorMessage={errors.id_card?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Campos individuales */}
                        <div className="w-full">
                            <Controller
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <Input
                                        size="md"
                                        label="Nombre"
                                        variant="underlined"
                                        type="text"
                                        {...field}
                                        isInvalid={!!errors.id_card}
                                        errorMessage={errors.id_card?.message}
                                        fullWidth
                                    />
                                )}
                            />
                        </div>

                        <div className="w-full">
                            <Controller
                                control={control}
                                name="email"
                                render={({ field }) => (
                                    <Input
                                        size="md"
                                        label="Correo Electrónico"
                                        variant="underlined"
                                        type="text"
                                        {...field}
                                        isInvalid={!!errors.id_card}
                                        errorMessage={errors.id_card?.message}
                                        fullWidth
                                    />
                                )}
                            />
                        </div>

                        <div className="w-full">
                            <Controller
                                control={control}
                                name="address"
                                render={({ field }) => (
                                    <Input
                                        size="md"
                                        label="Dirección"
                                        variant="underlined"
                                        type="text"
                                        {...field}
                                        isInvalid={!!errors.id_card}
                                        errorMessage={errors.id_card?.message}
                                        fullWidth
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </form>

            {/* Modal para la tabla de selección de clientes */}
            {isTableVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
                   onClick={() => setIsTableVisible(false)}
                >
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

CustomerForm.displayName = 'CustomerForm';
