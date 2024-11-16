import { ThemeProvider } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useForm } from 'react-hook-form';
import { Select, MenuItem, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { BudgetFormSchema } from 'src/utils/validation.zod';
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import dayjs from "dayjs";
import { forwardRef, useImperativeHandle, useState } from "react";
import { SelectBudgetButton } from "./SelectBudgetButton"; // Importa el nuevo componente

export const BudgetForm = forwardRef((props, ref) => {
    const today = dayjs();
    const expirationDate = today.add(14, 'day');
    
    const { register, formState: { errors }, getValues, setValue, trigger, watch } = useForm<BudgetForm>({
        resolver: zodResolver(BudgetFormSchema), 
        defaultValues: {
            dateCreation: today,
            dateExpiration: expirationDate,
            currency: '$',
        }
    });

    const [isBudgetSelected, setIsBudgetSelected] = useState(false);

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
        // Aquí puedes agregar la lógica que deseas para seleccionar un presupuesto (por ejemplo, abrir un modal)
        setIsBudgetSelected(true);
        console.log("Presupuesto seleccionado");
    };

    useImperativeHandle(ref, () => ({
        submitForm,
    }));

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

                {/* Campo de moneda con tema personalizado */}
                <div className="w-full bg-black-nav">
                    <ThemeProvider theme={TextFieldTheme}>
                        <Select
                            {...register("currency")}
                            value={watch("currency")}
                            fullWidth
                            
                        >
                            <MenuItem value="$">USD ($)</MenuItem>
                            <MenuItem value="Bs">Bolívar (Bs)</MenuItem>
                        </Select>
                    </ThemeProvider>
                    {errors.currency && <p className="py-1 text-red-500">{errors.currency.message}</p>}
                </div>
            </div>
        </form>
        </>
    );
});

// Agrega el displayName para evitar el error de ESLint
BudgetForm.displayName = 'BudgetForm';
