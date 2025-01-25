import { useState } from "react";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProviderSchema } from 'src/utils/validation.zod';
import { PROVIDERVOID } from "src/utils/constanst";
import { useImperativeHandle, forwardRef } from 'react';
import { toast } from "react-toastify";
import { Input, Select } from "@nextui-org/react";
import { useGetProvidersQuery, useCreateProviderMutation } from "src/redux/services/providersApi";
import { OptionsProviderForm } from "../OptionsProviderForm";
import { SelectProviders } from "src/components/Common/SelectProviders/SelectProviders";

// Define la interfaz para el ref
interface FormHandle {
    submitFormProvider: () => void;
}

// Define la interfaz para los props
interface ProviderFormProps {
    title: string;
}

// Componente con forwardRef
export const ProviderForm = forwardRef<FormHandle, ProviderFormProps>(({ title }, ref) => {
    const { data: providers = [], isLoading: isLoadingProviders, isError, isFetching, isSuccess } = useGetProvidersQuery();
    const [selectedProvider, setSelectedProvider] = useState<Provider>(PROVIDERVOID);
    const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
    const [createProvider ] = useCreateProviderMutation();
    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, formState: { errors }, reset, getValues, trigger, setValue } = useForm<Omit<Provider, '_id'>>({
        resolver: zodResolver(ProviderSchema),
        defaultValues: selectedProvider,
    });

    const handleProviderSelect = (provider: Provider) => {
        setSelectedProvider(provider);
        setIsTableVisible(false);
        reset(provider);
    };
    // crear tabla de proveedores
    const onSubmit: SubmitHandler<Omit<Provider, '_id'>> = async (data) => {
        setIsLoading(true);
        try {
            await createProvider(data).unwrap();
            toast.success('Proveedor registrado exitosamente')
        } catch (error) {    
            toast.error('Ha ocurrido un error al intentar registrar')        
        } finally {
            setIsLoading(false);
        }
    };

    const getFormProvider = () => {
        return getValues(); // Retorna los valores actuales del formulario
    };

    const submitFormProvider = async () => {
        const formData = getValues();
        const isFormValid = await trigger();
        if (isFormValid) {
            return formData;
        } else {
            return null;
        }
    };

     // Función para actualizar los datos
    const setFormProvider = (provider: Provider ) => {
        setValue("id_card", provider.id_card);
        setValue("name", provider.name);
        setValue("contactName", provider.contactName);
        setValue("email", provider.email);
        setValue("phone", provider.phone);
        setValue("address", provider.address);
    };

    const resetFormProvider = () => {
        // Reinicia los campos del formulario al estado inicial
        reset(PROVIDERVOID);
    };

    useImperativeHandle(ref, () => ({
        submitFormProvider,
        setFormProvider,
        resetFormProvider,
        getFormProvider,
    }));

    return (
        <>
            {/* botones para cargar al form o guardar en bdd */}
            <OptionsProviderForm
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
                        <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 gap-x-6 w-full">
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

                            <Controller
                                control={control}
                                name="contactName"
                                render={({ field }) => (
                                    <Input
                                        size="md"
                                        label="Nombre de Contacto"
                                        variant="underlined"
                                        type="text"
                                        {...field}
                                        isInvalid={!!errors.contactName}
                                        errorMessage={errors.contactName?.message}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                     <SelectProviders
                        data={providers}
                        isLoading={isLoadingProviders}
                        isError={isError}
                        isFetching={isFetching}
                        isSuccess={isSuccess}
                        onSelectProvider={handleProviderSelect}
                        onCloseTable={() => setIsTableVisible(false)}
                    /> 
                </div>
            )}
        </>
    );
});

ProviderForm.displayName = 'ProviderForm';
