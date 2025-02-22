import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditNoteFormSchema } from 'src/utils/validation.zod';
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"; 
import { motion } from "framer-motion"; 
import { useGetInvoicesQuery } from "src/redux/services/invoices.Api";
import { Dispatch, SetStateAction } from 'react';
import { Loading } from "src/components/Common/Loading";
import { useGetCreditNotesQuery } from "src/redux/services/creditNotes.Api";
import { SelectInvoices } from "src/components/Common/SelectInvoices";
import { MarketModal } from "src/components/Common/MarketModal";
import { useCalendarDate } from 'src/hooks/useCalendarDate';
import { getLocalTimeZone, now } from "@internationalized/date";
import { Autocomplete, AutocompleteItem, DatePicker, Input, Spinner } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { OptionsCreditNoteForm } from '../OptionsCreditNoteForm';

interface CreaditNoteFormProps {
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
    mode: string; // Modo actual (ejemplo: "edit" o "create")
  }   
export const CreditNoteForm = forwardRef(({ 
    currency, 
    setCurrency, 
    exchangeRate, 
    setExchangeRate, 
    setIgtfPercentage,
    setIvaPercentage,
    setSelectedServices,
    setOriginalServices,
    handleSetFormCustomer,
    mode
}: CreaditNoteFormProps, ref) => {
    const today = now(getLocalTimeZone());
    const { data: creditNotes = []} = useGetCreditNotesQuery(); 
    const { data: invoices = [], isSuccess, isLoading, isFetching, isError } = useGetInvoicesQuery(); 
    const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
    const [showMarket, setShowMarket] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [localNum, setLocalNum] = useState<number | undefined>(undefined);
    const { transformToCalendarDate } = useCalendarDate();

    const { 
        formState: { errors }, 
        getValues, 
        setValue, 
        trigger, 
        watch 
    } = useForm<FormCreditNote>({
        resolver: zodResolver(CreditNoteFormSchema), 
        defaultValues: {
            num: 0, 
            numInvoice: 0, 
            dateCreation: today,
            currency: currency ?? "$", 
            exchangeRate: exchangeRate ?? 1
        }
    });

    // Función para cargar el presupuesto y convertir si es necesario
    const handleInvoiceSelect = (invoice: Invoice) => {
        if (!invoice) return;

        setIsUpdating(true); // Activar el loading al inicio

        setTimeout(() => {
            // Actualiza todos los valores del formulario
            setValue("numInvoice", invoice.form.num);
            handleSetFormCustomer(invoice.customer);
            setCurrency(invoice.form.currency);
            setValue("currency", invoice.form.currency);
            setExchangeRate(invoice.form.exchangeRate);
            setValue("exchangeRate", invoice.form.exchangeRate);
            setSelectedServices(invoice.services);

            if (invoice.form.currency === "Bs" && invoice.form.exchangeRate > 1) {
                const updatedOriginalServices = invoice.services.map((service) => ({
                    ...service,
                    totalPrice: parseFloat((service.totalPrice / invoice.form.exchangeRate).toFixed(2)),
                    servicePrice: parseFloat((service.servicePrice / invoice.form.exchangeRate).toFixed(2)),
                    products: service.products.map((product) => ({
                        ...product,
                        product: {
                            ...product.product,
                            price: parseFloat((product.product.price / invoice.form.exchangeRate).toFixed(2)),
                        },
                    })),
                }));

                setOriginalServices(updatedOriginalServices);
            } else {
                setOriginalServices(invoice.services);
            }

            setIvaPercentage(invoice.ivaPercentage);
            setIgtfPercentage(invoice.igtfPercentage);
            setIsTableVisible(false);

            setIsUpdating(false); 
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
    const setForm = (formCreditNote: Omit<FormCreditNote, 'num'>) => {
        setValue("numInvoice", formCreditNote.numInvoice);
        setValue("dateCreation", transformToCalendarDate(formCreditNote.dateCreation));
        setValue("currency", formCreditNote.currency);
        setValue("exchangeRate", formCreditNote.exchangeRate);
    };
    
    useImperativeHandle(ref, () => ({
        setForm,
        submitForm,
        getForm,
    }));

    useEffect(() => {
        if (isSuccess) {
            const maxCreditNote = creditNotes.length > 0
            ? Math.max(...creditNotes.map(creditNote => creditNote.form.num)) // Obtener el mayor valor de n_budget
            : 0; 
            // Actualizamos el valor de n_budget utilizando setValue 
            const nextNum = maxCreditNote + 1;
            setLocalNum(nextNum); // Actualizamos el estado local
            setValue("num", nextNum); // Sincronizamos con el formulario   
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, creditNotes, isSuccess]);
    

    return (
        <>
        <OptionsCreditNoteForm 
            setIsTableVisible={setIsTableVisible} 
            setShowMarket={setShowMarket}>
        </OptionsCreditNoteForm>

        <form className="w-full pt-4 sm:pl-6">
            <div className="bg-black-nav/50 rounded-lg p-4">
                <div className="grid gap-y-4 w-full">
                    {/* Nº de Nota de credito */}
                    <div className="w-full h-14 pt-4 text-xl font-bold flex items-center justify-start gap-x-2">
                        <p>Nota de credito Nº</p>
                        {/* Verificamos si está cargando o si el valor de num es undefined */}
                        {isLoading || localNum === undefined ? (
                            <div className="flex items-center justify-center">
                                <Spinner color="secondary" size="sm" />
                            </div>
                        ) : (
                            <p>{localNum}</p> // Mostramos el valor local de num
                        )}
                    </div>

                    {
                        getValues('numInvoice') === 0 ? (
                            <div className="w-full h-14 flex items-center justify-start">
                                <p className="text-md font-semibold">Sin referenciar factura, por favor cargue una.</p>
                            </div>
                        ):(
                            <div className="w-full h-14 flex items-center justify-start">
                                <p className="text-md font-semibold">{`Ref. Factura Nº ${getValues('numInvoice')}`}</p>
                            </div>
                        )     
                    }
                    
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

        {/* Modal para la tabla de selección de clientes */}
        {isTableVisible && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
                onClick={() => setIsTableVisible(false)}>
                <SelectInvoices
                    data={invoices}
                    isLoading={isLoading}
                    isError={isError}
                    isFetching={isFetching}
                    isSuccess={isSuccess}
                    onSelectInvoice={handleInvoiceSelect}
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
CreditNoteForm.displayName = 'CreditNoteForm';
