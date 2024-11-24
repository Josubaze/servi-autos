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
  }
export const BudgetForm = forwardRef(({currency, setCurrency}: BudgetFormProps, ref) => {
    const today = dayjs();
    const expirationDate = today.add(14, 'day');
    const { register, formState: { errors }, getValues, setValue, trigger, watch } = useForm<BudgetForm>({
        resolver: zodResolver(BudgetFormSchema), 
        defaultValues: {
            dateCreation: today,
            dateExpiration: expirationDate,
            currency: currency,
            exchangeRate: 0,
        }
    });

    const submitForm = async () => {
        const formData = getValues(); 
        const isFormValid = await trigger();
        if (isFormValid) {
            return formData;  
        } else {
            return null;
        }
    };

    const handleSelectBudget = () => {
        console.log("Presupuesto seleccionado");
    };


    useImperativeHandle(ref, () => ({
        submitForm,   
    }));

    // Sincronizar el valor de currency del padre con el formulario del hijo
    useEffect(() => {
        setValue("currency", currency); 
    }, [currency, setValue]);

    return (
        <>
        <div className="flex items-center justify-end gap-3">
            <p className="font-title font-bold">Presupuesto Existente</p>
            <SelectBudgetButton onClick={handleSelectBudget} />
        </div>

        <form className="w-full pt-4 sm:pl-6">
            <div className="grid gap-y-4 w-full">
                <div className="w-full bg-black-nav">
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
        
                <div className="w-full flex flex-col sm:flex-row sm:items-center sm:gap-6">
                    <div className="font-title font-bold sm:w-1/3 text-left sm:text-center">
                        Fecha de Creación
                    </div>
                    <div className="sm:w-2/3 w-full bg-black-nav">
                        <ThemeProvider theme={TextFieldTheme}>
                        <DatePicker
                            value={getValues("dateCreation")}
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

                <div className="w-full flex flex-col sm:flex-row sm:items-center sm:gap-6">
                    <div className="font-title font-bold sm:w-1/3 text-left sm:text-center">
                        Fecha de Vencimiento
                    </div>
                    <div className="sm:w-2/3 w-full bg-black-nav">
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

            {/* Conversion de moneda */}
            <div className="grid grid-cols-12 gap-x-6 items-center w-full rounded-lg">
            {/* Select para la moneda */}
            <motion.div
                className={`${
                    currency === "$" ? "col-span-12" : "col-span-4"
                } bg-black-nav`}
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
                    variant="outlined"
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    <MenuItem value="$">USD ($)</MenuItem>
                    <MenuItem value="Bs">Bolívar (Bs)</MenuItem>
                </Select>
                </ThemeProvider>
                {errors.currency && (
                <p className="py-1 text-red-500">{errors.currency.message}</p>
                )}
            </motion.div>

            {/* TextField para la tasa de cambio */}
            {watch("currency") === "Bs" && (
                <div className="col-span-8 ms-2 bg-black-nav">
                <ThemeProvider theme={TextFieldTheme}>
                    <NumericFormat
                    customInput={TextField}
                    value={watch("exchangeRate")}
                    onValueChange={({ floatValue }) => {
                        setValue("exchangeRate", floatValue || 0, { shouldValidate: true });
                    }}
                    variant="outlined"
                    fullWidth
                    type="text"
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    decimalSeparator=","
                    thousandSeparator="."
                    label="Tasa de cambio"
                    disabled={watch("currency") === "$"}
                    sx={{ input: { textAlign: "right" } }}
                    />
                </ThemeProvider>
                {errors.exchangeRate && (
                    <p className="py-1 text-red-500">{errors.exchangeRate.message}</p>
                )}
                </div>
            )}
            </div>
            </div>
        </form>
        </>
    );
});

// Agrega el displayName para evitar el error de ESLint
BudgetForm.displayName = 'BudgetForm';
