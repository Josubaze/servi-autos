import { ThemeProvider } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useForm } from 'react-hook-form';
import { Select, MenuItem } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { BudgetFormSchema } from 'src/utils/validation.zod';
import { dateTheme } from "src/styles/themes/themeDate";
import dayjs from "dayjs";
import { forwardRef, useImperativeHandle } from "react";

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

    const submitForm = async () => {
        const formData = getValues(); 
        const isFormValid = await trigger();
        if (isFormValid) {
            return formData;  
        } else {
            return null;
        }
    };

    useImperativeHandle(ref, () => ({
        submitForm,
    }));

    return (
        <>
            <form className="flex flex-col gap-y-2 pt-12 pl-4">
                <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Presupuesto</div>
                    <div className="flex-1 text-right">
                        <input
                            placeholder="Nº de Presupuesto"
                            {...register("n_budget")}
                            className="px-2 w-full border-solid border-2 rounded-xl bg-gray-800 focus:outline-none border-gray-500 focus:border-indigo-600 hover:border-gray-400 h-8 text-right"
                        />
                        {errors.n_budget && <p className="py-1 text-red-500">{errors.n_budget.message}</p>}
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Fecha de Creación</div>
                    <div className="flex-1 text-right">
                        <ThemeProvider theme={dateTheme}>
                            <DatePicker
                                value={getValues("dateCreation")}
                                format="DD/MM/YYYY"
                                {...register("dateCreation")}
                                onChange={(newValue) => setValue("dateCreation", newValue)}                              
                            />
                        </ThemeProvider>
                        {errors.dateCreation?.message && <p className="py-1 text-red-500">{String(errors.dateCreation.message)}</p>}
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Fecha de Vencimiento</div>
                    <div className="font-title flex-1 text-right">
                        <ThemeProvider theme={dateTheme}>
                            <DatePicker
                                value={getValues("dateExpiration")}
                                format="DD/MM/YYYY"
                                {...register("dateExpiration")}
                                onChange={(newValue) => setValue("dateExpiration", newValue)} 
                            />
                        </ThemeProvider>
                        {errors.dateExpiration?.message && <p className="py-1 text-red-500">{String(errors.dateExpiration.message)}</p>}
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Cambiar Moneda</div>
                    <div className="font-title flex-1 text-right">
                        <Select
                            {...register("currency")}
                            value={watch("currency")}
                            MenuProps={{
                                PaperProps: {
                                    className: 'bg-gray-800 text-gray-100',
                                },
                                MenuListProps: {
                                    sx: {
                                        '& .MuiMenuItem-root.Mui-selected': {
                                            backgroundColor: '#374151',
                                            '&:hover': {
                                                backgroundColor: '#374151',
                                            },
                                        },
                                    },
                                }
                            }}
                            sx={{
                                px: 2,
                                width: '100%',
                                color: '#f3f4f6', 
                                backgroundColor: '#1f2937', 
                                border: '2px solid #6b7280', 
                                borderRadius: '0.75rem', 
                                height: '2rem', 
                                textAlign: 'right',
                                '&:hover': {
                                    borderColor: '#9ca3af', 
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none', 
                                },
                                '&.Mui-focused': {
                                    borderColor: '#4f46e5', 
                                },
                            }}
                        >
                            <MenuItem value="$" sx={{ '&:hover': { backgroundColor: '#4b5563' } }}>
                                <span>$</span>
                            </MenuItem>
                            <MenuItem value="Bs" sx={{ '&:hover': { backgroundColor: '#4b5563' } }}>
                                <span>Bs</span>
                            </MenuItem>
                        </Select>
                        {errors.currency && <p className="py-1 text-red-500">{errors.currency.message}</p>}
                    </div>
                </div>
            </form>
        </>
    );
})


// Agrega el displayName para evitar el error de ESLint
BudgetForm.displayName = 'BudgetForm';