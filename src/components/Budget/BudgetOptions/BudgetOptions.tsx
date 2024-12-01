import { FaRegEye } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";

export const BudgetOptions = () => {
    return (
        <div className="grid grid-cols-4 rounded-lg w-full h-16 mb-4 gap-x-4 bg-gradient-to-r from-indigo-600 via-black-nav to-indigo-600 animate-gradient bg-[length:200%]">
            <div className="col-span-2">
                <button className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150 hover:bg-indigo-600 duration-300">
                    <span className="flex items-center justify-center gap-x-2 h-full">
                        Modo Vista
                        <FaRegEye className="h-5 w-5" />
                    </span>
                </button>
            </div>

            <div className="col-span-2">
                <button className="text-base px-6 w-full h-full rounded-xl bg-transparent transition ease-in-out delay-150  hover:bg-indigo-600 duration-300">
                    <span className="flex items-center justify-center gap-x-2 h-full">
                        Exportar PDF
                        <FaFilePdf className="h-5 w-5" />
                    </span>
                </button>
            </div>
        </div>
    );
};
