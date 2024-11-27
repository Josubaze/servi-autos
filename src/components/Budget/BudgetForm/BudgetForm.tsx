import { ThemeProvider } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useForm } from 'react-hook-form';
import { Select, MenuItem, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { BudgetFormSchema } from 'src/utils/validation.zod';
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { SelectBudgetButton } from "./SelectBudgetButton"; 
import { NumericFormat } from "react-number-format";
import { motion } from "framer-motion"; 

interface BudgetFormProps {
    setCurrency: (currency: string) => void; 
    currency: string;
    exchangeRate: number;
    setExchangeRate: (currency: number) => void; 
}

export const BudgetForm = forwardRef(({ currency, setCurrency, exchangeRate, setExchangeRate }: BudgetFormProps, ref) => {
    const today = dayjs();
    const expirationDate = today.add(14, 'day');

    const { 
        register, 
        formState: { errors }, 
        getValues, 
        setValue, 
        trigger, 
        watch 
    } = useForm<BudgetForm>({
        resolver: zodResolver(BudgetFormSchema), 
        defaultValues: {
            dateCreation: today,
            dateExpiration: expirationDate,
            currency, // Sincroniza con el estado del padre
            exchangeRate,
        }
    });

    // Exponer método para validar el formulario desde el padre
    const submitForm = async () => {
        const isFormValid = await trigger();
        return isFormValid ? getValues() : null;
    };

    useImperativeHandle(ref, () => ({ submitForm }));

    return (
        <>
        <div className="flex items-center justify-end gap-3">
            <p className="font-title font-bold">Presupuesto Existente</p>
            <SelectBudgetButton onClick={() => console.log("Presupuesto seleccionado")} />
        </div>

        <form className="w-full pt-4 sm:pl-6">
            <div className="grid gap-y-4 w-full">
                {/* Nº de Presupuesto */}
                <div className="w-full">
                    <ThemeProvider theme={TextFieldTheme}>
                        <TextField
                            label="Nº de Presupuesto"
                            fullWidth
                            {...register("n_budget")}
                            error={!!errors.n_budget}
                            helperText={errors.n_budget?.message}                           
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
                            watch("currency") === "$" ? "col-span-3" : "col-span-1"
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
                                value={watch("currency")}
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
                                    value={watch("exchangeRate")}
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
        </form>
        </>
    );
});

// Agrega el displayName para evitar el error de ESLint
BudgetForm.displayName = 'BudgetForm';
