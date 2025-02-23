
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BudgetFormSchema } from 'src/utils/validation.zod';
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { motion } from "framer-motion"; 
import { useGetInvoicesQuery } from "src/redux/services/invoices.Api";
import { SelectBudgets } from "src/components/Common/SelectBudgets/SelectBudgets";
import { Dispatch, SetStateAction } from 'react';
import { Loading } from "src/components/Common/Loading";
import { useGetBudgetsQuery } from "src/redux/services/budgets.Api";
import { MarketModal } from "src/components/Common/MarketModal";
import { useCalendarDate } from "src/hooks/useCalendarDate";
import { Autocomplete, AutocompleteItem, DatePicker, Input, Spinner } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { getLocalTimeZone, now } from '@internationalized/date';
import { OptionsInvoiceForm } from '../OptionsInvoiceForm/OptionsInvoiceForm';

interface InvoiceFormProps {
    setCurrency: (currency: string) => void;
    currency: string; 
    exchangeRate: number; 
    setExchangeRate: Dispatch<SetStateAction<number>>; 
    setSelectedServices: Dispatch<SetStateAction<Service[]>>; 
    setOriginalServices: Dispatch<SetStateAction<Service[]>>; 
    setIvaPercentage: Dispatch<SetStateAction<number>>; 
    setIgtfPercentage: Dispatch<SetStateAction<number>>;
    handleSetFormCustomer: (customer: Customer) => void; 
    setDescription: (description: string) => void; 
    setRefBudget: Dispatch<SetStateAction<string | null>>;
  }   
export const InvoiceForm = forwardRef(({ 
    currency, 
    setCurrency, 
    exchangeRate, 
    setExchangeRate, 
    setIgtfPercentage,
    setIvaPercentage,
    setDescription,
    setSelectedServices,
    setOriginalServices,
    handleSetFormCustomer,
    setRefBudget
}: InvoiceFormProps, ref) => {
    const today = now(getLocalTimeZone());
    const expirationDate = today.add({ days: 15 });
    const { data: invoices = []} = useGetInvoicesQuery(); 
    const { data: budgets = [], isSuccess, isLoading, isFetching, isError } = useGetBudgetsQuery(); 
    const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showMarket, setShowMarket] = useState(false)
    const [localNum, setLocalNum] = useState<number | undefined>(undefined);
    const { transformToCalendarDate } = useCalendarDate();
    const { 
        formState: { errors }, 
        getValues, 
        setValue, 
        trigger, 
        watch 
    } = useForm<Form>({
        resolver: zodResolver(BudgetFormSchema), 
        defaultValues: {
            num: 0, 
            dateCreation: today,
            dateExpiration: expirationDate,
            currency: currency ?? "$", 
            exchangeRate: exchangeRate ?? 1
        }
    });

    // Función para cargar el presupuesto o factura y convertir si es necesario
    const handleBudgetSelect = (budget: Budget) => {
        if (!budget) return;

        setIsUpdating(true); // Activar el loading al inicio

        setTimeout(() => {
            // Actualiza todos los valores del formulario
            setRefBudget(budget._id)
            handleSetFormCustomer(budget.customer);
            setCurrency(budget.form.currency);
            setValue("currency", budget.form.currency);
            setExchangeRate(budget.form.exchangeRate);
            setValue("exchangeRate", budget.form.exchangeRate);
            setSelectedServices(budget.services);

            if (budget.form.currency === "Bs" && budget.form.exchangeRate > 1) {
                const updatedOriginalServices = budget.services.map((service) => ({
                    ...service,
                    totalPrice: parseFloat((service.totalPrice / budget.form.exchangeRate).toFixed(2)),
                    servicePrice: parseFloat((service.servicePrice / budget.form.exchangeRate).toFixed(2)),
                    products: service.products.map((product) => ({
                        ...product,
                        product: {
                            ...product.product,
                            price: parseFloat((product.product.price / budget.form.exchangeRate).toFixed(2)),
                        },
                    })),
                }));

                setOriginalServices(updatedOriginalServices);
            } else {
                setOriginalServices(budget.services);
            }

            setIvaPercentage(budget.ivaPercentage);
            setIgtfPercentage(budget.igtfPercentage);
            setDescription(budget.description);
            setIsTableVisible(false);

            setIsUpdating(false); // Desactivar el loading cuando termina
        }, 500); // Simulamos un pequeño delay de 500ms
    };

    // Exponer método para validar el formulario desde el padre
    const submitForm = async () => {
        const isFormValid = await trigger();
        return isFormValid ? getValues() : null;
    };

    const getForm = () => {
        return getValues(); // Retorna los valores actuales del formulario
    };

    // Función setFormDate para actualizar los datos
    const setForm = ( form : Form ) => {
        setLocalNum(form.num);
        setValue("num", form.num);
        setValue("dateCreation", transformToCalendarDate(form.dateCreation));
        setValue("dateExpiration", transformToCalendarDate(form.dateExpiration)); 
        setValue("dateUpdate", transformToCalendarDate(form.dateUpdate));
        setValue("currency", form.currency);
        setValue("exchangeRate", form.exchangeRate);
    };
    
    useImperativeHandle(ref, () => ({
        setForm,
        submitForm,
        getForm,
    }));

    useEffect(() => {
        if (isSuccess) {
            const maxInvoice = invoices.length > 0
            ? Math.max(...invoices.map(invoice => invoice.form.num)) // Obtener el mayor valor de n_budget
            : 0; 
            // Actualizamos el valor de n_budget utilizando setValue 
            const nextNum = maxInvoice + 1;  
            setLocalNum(nextNum); // Actualizamos el estado local
            setValue("num", nextNum)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoices, isSuccess]);
    

    return (
        <>
        <OptionsInvoiceForm 
            setIsTableVisible={setIsTableVisible} 
            setShowMarket={setShowMarket}>
        </OptionsInvoiceForm>

        <form className="w-full pt-4 sm:pl-6">
            <div className="bg-black-nav/50 rounded-lg p-4">
                <div className="grid gap-y-4 w-full">
                    {/* Nº de Presupuesto */}
                    <div className="w-full h-14 pt-4 text-xl font-bold flex items-center justify-start gap-x-2">
                        <p>Factura Nº</p>
                        {/* Verificamos si está cargando o si el valor de num es undefined */}
                        {isLoading || localNum === undefined ? (
                            <div className="flex items-center justify-center">
                                <Spinner color="secondary" size="sm" />
                            </div>
                        ) : (
                            <p>{localNum}</p>
                        )}
                    </div>
                    
                    {/* Fecha de creación */}
                    <div className="flex flex-col w-full  sm:items-center">
                        <I18nProvider locale="es">                 
                            <DatePicker
                                label="Fecha de Creación"
                                size='md'
                                variant='underlined'
                                hideTimeZone
                                granularity="day"
                                showMonthAndYearPickers
                                value={watch("dateCreation")}
                                onChange={(newValue) => setValue("dateCreation", newValue)}
                                className="w-full"
                                aria-labelledby="dateCreation"
                            />
                        </I18nProvider>
                    </div>

                     {/* Fecha de vencimiento */}        
                     <div className="w-full flex flex-col sm:flex-row sm:items-center sm:gap-6">
                        <I18nProvider locale="es">
                            <DatePicker
                                label="Fecha de Vencimiento"
                                size='md'
                                variant='underlined'
                                hideTimeZone
                                granularity="day"
                                showMonthAndYearPickers
                                value={watch("dateExpiration")}
                                onChange={(newValue) => setValue("dateExpiration", newValue)}
                                className="w-full"
                                minValue={watch("dateCreation")}
                                aria-labelledby="dateExpiration"
                            />                         
                        </I18nProvider> 
                    </div>

                    {/* Moneda y Tasa de Cambio */}
                    <div className="grid grid-cols-3 gap-x-4 items-center w-full rounded-lg">
                        {/* Select para la moneda */}
                        <motion.div
                            className={`${
                                currency === "$" ? "col-span-3" : "col-span-1"
                            }`}
                            layout
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                        >                           
                            <Autocomplete
                                label="Moneda"
                                isClearable={ false }
                                size="md"
                                placeholder="Selecciona la moneda"
                                variant="underlined"
                                selectedKey={currency}
                                onSelectionChange={(selectedKey) => {
                                    setCurrency(selectedKey as string); // Actualiza el estado local
                                    setValue("currency", selectedKey as string); // Actualiza el valor en react-hook-form
                                }}
                                >
                                {/* Opciones para el selector */}
                                <AutocompleteItem key="$">USD ($)</AutocompleteItem>
                                <AutocompleteItem key="Bs">Bolívar (Bs)</AutocompleteItem>
                            </Autocomplete>
                            {errors.currency && (
                                <p className="py-1 text-red-500">{errors.currency.message}</p>
                            )}
                        </motion.div>

                        {/* Tasa de Cambio */}
                        {watch("currency") === "Bs" && (
                            <div className="col-span-2">                             
                                <Input
                                    size="md"
                                    label="Tasa de Cambio"
                                    value={Number(exchangeRate).toLocaleString("de-DE", {
                                        minimumFractionDigits: 2, 
                                        maximumFractionDigits: 2,
                                    })} 
                                    onChange={(e) => {
                                        const inputValue = e.target.value.replace(/\./g, "").replace(/,/g, "");
                                        const numericValue = parseInt(inputValue || "0", 10);
                                        const adjustedValue = numericValue / 100;
                                        setExchangeRate(adjustedValue || 0);
                                        setValue("exchangeRate", adjustedValue || 0, { shouldValidate: true });
                                    }}
                                    variant="underlined"
                                    fullWidth
                                    style={{ textAlign: "right" }}
                                    type="text"
                                    inputMode="numeric"
                                />
                            </div>
                        )}
                        {errors.exchangeRate && (
                            <p className="col-span-3 py-1 text-red-500">{errors.exchangeRate.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </form>

        {isTableVisible && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
                onClick={() => setIsTableVisible(false)}
            >       
                <SelectBudgets
                    data={budgets}
                    isLoading={isLoading}
                    isError={isError}
                    isFetching={isFetching}
                    isSuccess={isSuccess}
                    onSelectBudget={handleBudgetSelect}
                    onCloseTable={() => setIsTableVisible(false)}
                />
            </div>
        )}

        {isUpdating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                    <Loading />
                </div>
        )}

        {
            showMarket && (
                <MarketModal isOpen={showMarket} onClose={() => setShowMarket(false)}></MarketModal>
            )
        }
        </>
    );
});

// Agrega el displayName para evitar el error de ESLint
InvoiceForm.displayName = 'InvoiceForm';
