import { createTheme, ThemeProvider } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs} from "dayjs";
import { useState } from "react";
import { dateTheme } from "src/styles/themes/themeDate";


export const BudgetForm = () => {
    const [value, setValue] = useState<Dayjs | null>(null);
    const baseTheme = createTheme(); // Tema predeterminado de MUI
    console.log(value);
    return (
        <>
            <div className="flex flex-col gap-y-2 pt-12 pl-4">
                <div className="flex flex-row justify-between items-center">
                    <div className="font-title font-bold flex-1">Presupuesto</div>
                    <div className="flex-1 text-right">
                        <input
                        placeholder="Nº de Presupuesto"
                        className="px-2 w-full border-solid border-2 rounded-xl bg-gray-800 focus:outline-none border-gray-500 focus:border-indigo-600 h-8 text-right"
                        />
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center">
                <div className="font-title font-bold flex-1">Fecha de Creación</div>
                    <div className="flex-1 text-right">
                        <input
                            placeholder="dd/mm/aaaa"
                            className="px-2 w-3/4 border-solid border-2 rounded-xl bg-gray-800 focus:outline-none border-gray-500  focus:border-indigo-600 h-8 text-right"
                        />
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center">
                <div className="font-title font-bold flex-1">Fecha de Vencimiento</div>
                    <div className="font-title flex-1 text-right">
                        <ThemeProvider theme={dateTheme}>
                            <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
                        </ThemeProvider>
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center">
                <div className="font-title font-bold flex-1">Cambiar Moneda</div>
                    <div className="font-title flex-1 text-right">
                        <input
                            placeholder="$"
                            className="px-2 w-3/4 border-solid border-2 rounded-xl bg-gray-800 focus:outline-none border-gray-500 focus:border-indigo-600 h-8 text-right"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

