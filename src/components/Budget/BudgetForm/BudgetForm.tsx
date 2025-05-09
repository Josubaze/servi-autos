import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BudgetFormSchema } from 'src/utils/validation.zod';
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { motion } from "framer-motion"; 
import { useGetBudgetsQuery } from "src/redux/services/budgets.Api";
import { Dispatch, SetStateAction } from 'react';
import { Loading } from "src/components/Common/Loading";
import { MarketModal } from "src/components/Common/MarketModal";
import { Autocomplete, AutocompleteItem, DatePicker, Input, Spinner } from "@nextui-org/react";
import { getLocalTimeZone, now} from "@internationalized/date";
import { I18nProvider } from '@react-aria/i18n';
import { useCalendarDate } from 'src/hooks/useCalendarDate';
import { SelectReports } from 'src/components/Common/SelectReports';
import { useGetReportsQuery } from 'src/redux/services/reports.Api';
import { OptionsBudgetForm } from '../OptionsBudgetForm/OptionsBudgetForm';

interface BudgetFormProps {
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
    mode: string; 
    setRefReport: Dispatch<SetStateAction<string | null>>;
  }   
export const BudgetForm = forwardRef(({ 
    currency, 
    setCurrency, 
    exchangeRate, 
    setExchangeRate, 
    setDescription,
    setSelectedServices,
    setOriginalServices,
    handleSetFormCustomer,
    mode,
    setRefReport
}: BudgetFormProps, ref) => {
    const today = now(getLocalTimeZone());
    const expirationDate = today.add({ days: 15 });
    const { data: budgets = [], isSuccess, isLoading, isFetching, isError } = useGetBudgetsQuery(); 
    const { data: reports = [], isSuccess: isSuccessRe, isLoading: isLoadingRe, isFetching: isFetchingRe, isError: isErrorRe } = useGetReportsQuery();
    const [showMarket, setShowMarket] = useState<boolean>(false);
    const [showReport, setShowReport] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false);
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

    // Función para cargar el informe y convertir si es necesario
    const handleReportSelect = (report: ReportWork) => {
        if (!report) return;
        setIsUpdating(true); // Activar el loading al inicio

        setTimeout(() => {
            setRefReport(report._id);
            handleSetFormCustomer(report.customer);
            setSelectedServices(report.services);
            setOriginalServices(report.services);
            setDescription(report.description);
            setShowReport(false);
            setIsUpdating(false); 
        }, 500); 
    };	   

    // Exponer método para validar el formulario desde el padre
    const submitForm = async () => {
        const isFormValid = await trigger();
        return isFormValid ? getValues() : null;
    };

    const getForm = () => {
        return getValues(); // Retorna los valores actuales del formulario
    };

    // Función setForm para actualizar los datos
    const setForm = (form: Form) => {
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
        if (mode === "upload" || !isSuccess) return;
    
        const maxBudget = budgets.length > 0
            ? Math.max(...budgets.map(budget => budget.form.num))
            : 0;
    
        const nextNum = maxBudget + 1;
        setLocalNum(nextNum); // Actualizamos el estado local
        setValue("num", nextNum); // Sincronizamos con el formulario
    }, [mode, budgets, isSuccess, setValue]);
    
    

    return (
        <>
        <OptionsBudgetForm 
            setShowReport={setShowReport} 
            setShowMarket={setShowMarket}>
        </OptionsBudgetForm>

        <form className="w-full pt-4 sm:pl-6">
            <div className="bg-black-nav/50 rounded-lg p-4">
                <div className="grid gap-y-4 w-full">
                    {/* Nº de Presupuesto */}
                    <div className="w-full h-14 pt-4 text-xl font-bold flex items-center justify-start gap-x-2">
                        <p>Presupuesto Nº</p>
                        {/* Verificamos si está cargando o si el valor de num es undefined */}
                        {isLoading || localNum === undefined ? (
                            <div className="flex items-center justify-center">
                                <Spinner color="secondary" size="sm" />
                            </div>
                        ) : (
                            <p>{localNum}</p> // Mostramos el valor local de num
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
        {showReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
                onClick={() => setShowReport(false)}
            >
                <SelectReports
                    data={reports}
                    isLoading={isLoadingRe}
                    isError={isErrorRe}
                    isFetching={isFetchingRe}
                    isSuccess={isSuccessRe}
                    onSelectReport={handleReportSelect}
                    onCloseTable={() => setShowReport(false)}
                    filterBySinPresupuestar={true}
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
BudgetForm.displayName = 'BudgetForm';