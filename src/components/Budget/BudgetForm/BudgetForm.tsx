import { ThemeProvider } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BudgetFormSchema } from 'src/utils/validation.zod';
import { dateTheme } from "src/styles/themes/themeDate";
import dayjs from "dayjs";

export const BudgetForm = () => {
    const { register, handleSubmit, formState: { errors }, getValues , setValue} = useForm<BudgetForm>({
        //resolver: zodResolver(BudgetFormSchema), hay que acomidar la validation de zod
        defaultValues: {
            dateCreation: null,
            dateExpiration: null,
        }
    });

    const onSubmit: SubmitHandler<BudgetForm> = (data) => {
        console.log(data.n_budget);
        console.log("Fecha de Creación:", data.dateCreation ? formatDayjsDate(data.dateCreation) : '');
        console.log("Fecha de Vencimiento:", data.dateExpiration ? formatDayjsDate(data.dateExpiration) : '');
        console.log(data.currency);
        // Aquí puedes enviar los datos al componente padre o realizar otras acciones
    };

    // Función para formatear la fecha con Day.js a dd/mm/yyyy
    const formatDayjsDate = (date: dayjs.Dayjs): string => {
        return date.format('DD/MM/YYYY');
    };


    return (
        <>
            <form className="flex flex-col gap-y-2 pt-12 pl-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Presupuesto</div>
                    <div className="flex-1 text-right">
                        <input
                            placeholder="Nº de Presupuesto"
                            {...register("n_budget")}
                            className="px-2 w-full border-solid border-2 rounded-xl bg-gray-800 focus:outline-none border-gray-500 focus:border-indigo-600 h-8 text-right"
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
                        {errors.dateCreation && <p className="py-1 text-red-500">{errors.dateCreation.message}</p>}
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
                        {errors.dateExpiration && <p className="py-1 text-red-500">{errors.dateExpiration.message}</p>}
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Cambiar Moneda</div>
                    <div className="font-title flex-1 text-right">
                        <select
                            {...register("currency")}
                            className="px-2 w-3/4 border-solid border-2 rounded-xl bg-gray-800 focus:outline-none border-gray-500 focus:border-indigo-600 h-8 text-right"
                        >
                            <option value="$">$</option>
                            <option value="Bs">Bs</option>
                        </select>
                        {errors.currency && <p className="py-1 text-red-500">{errors.currency.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </>
    );
}
