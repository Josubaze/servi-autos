import { ThemeProvider } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useForm } from 'react-hook-form';
import { Select, MenuItem, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { BudgetFormSchema } from 'src/utils/validation.zod';
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { SelectBudgetButton } from "./SelectBudgetButton"; 
import { NumericFormat } from "react-number-format";
import { motion } from "framer-motion"; 
import { useGetBudgetsQuery } from "src/redux/services/budgets.Api";
import { SelectBudgets } from "src/components/Common/SelectBudgets/SelectBudgets";
import { Dispatch, SetStateAction } from 'react';
import { Loading } from "src/components/Common/Loading";

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
    mode: string; // Modo actual (ejemplo: "edit" o "create")
  }   
export const BudgetForm = forwardRef(({ 
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
}: BudgetFormProps, ref) => {
    const today = dayjs();
    const expirationDate = today.add(14, 'day');
    const { data: budgets = [], isSuccess, isLoading, isFetching, isError } = useGetBudgetsQuery(); 
    const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { 
        register, 
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

    // Función para cargar el presupuesto y convertir si es necesario
    const handleBudgetSelect = (budget: Budget) => {
        if (!budget) return;

        setIsUpdating(true); // Activar el loading al inicio

        setTimeout(() => {
            // Actualiza todos los valores del formulario
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
        setValue("num", form.num);
        setValue("dateCreation", dayjs(form.dateCreation));
        setValue("dateExpiration", dayjs(form.dateExpiration));
        setValue("dateUpdate", dayjs(form.dateUpdate)); 
        setValue("currency", form.currency);
        setValue("exchangeRate", form.exchangeRate);
    };
    
    useImperativeHandle(ref, () => ({
        setForm,
        submitForm,
        getForm,
    }));

    useEffect(() => {
        // Si el modo es "update", no ejecutamos este efecto
        if (mode === "upload") return;
    
        if (isSuccess) {
            const maxBudget = budgets.length > 0
            ? Math.max(...budgets.map(budget => budget.form.num)) // Obtener el mayor valor de n_budget
            : 0; 
            // Actualizamos el valor de n_budget utilizando setValue 
            setValue('num', maxBudget + 1 );    
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, budgets, isSuccess]);
    

    return (
        <>
        <div className="flex items-center justify-end gap-3">
            <p className="font-title font-bold">Presupuesto Existente</p>
            <SelectBudgetButton onClick={() => setIsTableVisible(true)} />
        </div>

        <form className="w-full pt-4 sm:pl-6">
            <div className="bg-black-nav rounded-lg border-y-2 border-gray-500 p-4">
                <div className="grid gap-y-4 w-full">
                    {/* Nº de Presupuesto */}
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
                                    startAdornment: <span style={{ marginRight: "10px", width: "300px" }}>Nº de Presupuesto</span>,
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

                    {/* Fecha de vencimiento */}        
                    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:gap-6">
                        <div className="font-title font-bold sm:w-1/3 text-left sm:text-center">
                            Fecha de Vencimiento
                        </div>
                        <div className="sm:w-2/3 w-full">
                            <ThemeProvider theme={TextFieldTheme}>
                            <DatePicker
                                value={getValues("dateExpiration")}
                                format="DD/MM/YYYY"
                                onChange={(newValue) => setValue("dateExpiration", newValue)}
                                className="w-full"
                            />
                            </ThemeProvider>
                            {errors.dateExpiration?.message && (
                            <p className="py-1 text-red-500 text-sm">{String(errors.dateExpiration.message)}</p>
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
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
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
        </>
    );
});

// Agrega el displayName para evitar el error de ESLint
BudgetForm.displayName = 'BudgetForm';
