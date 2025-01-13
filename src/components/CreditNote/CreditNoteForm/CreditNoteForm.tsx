import { ThemeProvider } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useForm } from 'react-hook-form';
import { Select, MenuItem, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditNoteFormSchema } from 'src/utils/validation.zod';
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"; 
import { NumericFormat } from "react-number-format";
import { motion } from "framer-motion"; 
import { useGetInvoicesQuery } from "src/redux/services/invoices.Api";
import { Dispatch, SetStateAction } from 'react';
import { Loading } from "src/components/Common/Loading";
import { useGetCreditNotesQuery } from "src/redux/services/creditNotes.Api";
import { SelectInvoiceButton } from "../../Common/Buttons/SelectInvoiceButton";
import { SelectInvoices } from "src/components/Common/SelectInvoices";
import { MarketButton } from "src/components/Common/Buttons/MarketButton";
import { MarketModal } from "src/components/Common/MarketModal";

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
    setDescription,
    setSelectedServices,
    setOriginalServices,
    handleSetFormCustomer,
    mode
}: CreaditNoteFormProps, ref) => {
    const today = dayjs();
    const { data: creditNotes = []} = useGetCreditNotesQuery(); 
    const { data: invoices = [], isSuccess, isLoading, isFetching, isError } = useGetInvoicesQuery(); 
    const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
    const [showMarket, setShowMarket] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const { 
        register, 
        formState: { errors }, 
        getValues, 
        setValue, 
        trigger, 
        watch 
    } = useForm<FormCreditNote>({
        resolver: zodResolver(CreditNoteFormSchema), 
        defaultValues: {
            num: 0, 
            numInvoice: 1, 
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
            setDescription(invoice.description);
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
        setValue("dateCreation", dayjs(formCreditNote.dateCreation));
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
            setValue('num', maxCreditNote + 1 );    
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, creditNotes, isSuccess]);
    

    return (
        <>
        <div className="flex items-center justify-start gap-x-3">
            {/* Sección de Consultar Mercado */}
            <div className="flex items-center justify-center pl-6">
                <MarketButton onClick={() => setShowMarket(true)} />
            </div>

            {/* Sección de Presupuesto Existente */}
            <div className="flex items-center justify-center">
                <SelectInvoiceButton onClick={() => setIsTableVisible(true)} />
            </div>
        </div>

        <form className="w-full pt-4 sm:pl-6">
            <div className="bg-black-nav rounded-lg border-y-2 border-gray-500 p-4">
                <div className="grid gap-y-4 w-full">
                    {/* Nº de Nota de credito */}
                    <div className="w-full">
                        <ThemeProvider theme={TextFieldTheme}>
                            <TextField
                                fullWidth
                                {...register("num")} 
                                value={getValues("num")}
                                error={!!errors.num}
                                helperText={errors.num?.message}
                                InputProps={{
                                    inputProps: {
                                        style: { textAlign: "right", paddingRight: "20px"},
                                    },
                                    startAdornment: <span style={{ marginRight: "10px", width: "300px" }}>Nº de Nota de Credito</span>,
                                }}
                                disabled
                            />
                        </ThemeProvider>
                    </div>

                     {/* Nº de Nota de credito */}
                     <div className="w-full">
                        <ThemeProvider theme={TextFieldTheme}>
                            <TextField
                                fullWidth
                                {...register("numInvoice")} 
                                value={getValues("numInvoice")}
                                error={!!errors.numInvoice}
                                helperText={errors.numInvoice?.message}
                                InputProps={{
                                    inputProps: {
                                        style: { textAlign: "right", paddingRight: "20px"},
                                    },
                                    startAdornment: <span style={{ marginRight: "10px", width: "300px" }}>Nº de Factura</span>,
                                }}
                                disabled
                            />
                        </ThemeProvider>
                    </div>
                    
                    {/* Fecha de creación */}
                    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:gap-6">
                        <div className="font-title font-bold sm:w-1/3 text-left sm:text-center">
                            Fecha de Creación
                        </div>
                        <div className="sm:w-2/3 w-full">
                            <ThemeProvider theme={TextFieldTheme}>
                                <DatePicker
                                    value={watch("dateCreation")}
                                    format="DD/MM/YYYY"
                                    onChange={(newValue) => setValue("dateCreation", newValue)}
                                    className="w-full"
                                />
                            </ThemeProvider>
                            {errors.dateCreation?.message && (
                                <p className="py-1 text-red-500 text-sm">{String(errors.dateCreation.message)}</p>
                            )}
                        </div>
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
                            <ThemeProvider theme={TextFieldTheme}>
                                <Select
                                    {...register("currency")}
                                    value={currency}
                                    fullWidth
                                    onChange={(e) => {
                                        setCurrency(e.target.value);
                                        setValue("currency", e.target.value);
                                    }}
                                >
                                    <MenuItem value="$">USD ($)</MenuItem>
                                    <MenuItem value="Bs">Bolívar (Bs)</MenuItem>
                                </Select>
                            </ThemeProvider>
                            {errors.currency && (
                                <p className="py-1 text-red-500">{errors.currency.message}</p>
                            )}
                        </motion.div>

                        {/* Tasa de Cambio */}
                        {watch("currency") === "Bs" && (
                            <div className="col-span-2">
                                <ThemeProvider theme={TextFieldTheme}>
                                    <NumericFormat
                                        customInput={TextField}
                                        value={exchangeRate}
                                        onValueChange={({ floatValue }) => {
                                            setExchangeRate(floatValue || 0);
                                            setValue("exchangeRate", floatValue || 0, { shouldValidate: true });
                                        }}
                                        variant="outlined"
                                        fullWidth
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale
                                        decimalSeparator=","
                                        thousandSeparator="."
                                        label="Tasa de cambio"
                                        sx={{ input: { textAlign: "right" } }}
                                    />
                                </ThemeProvider>
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
