
import { FaRegEye } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileImage } from "react-icons/fa6";

export const BudgetOptions = () => {
    return (
        <>
            <div className="grid grid-cols-4 rounded-lg w-full bg-black-nav px-6 py-3 mb-4 gap-x-4">
                
                <div>
                    <button className="text-base px-2 w-full border-solid border-2 border-indigo-600  h-8 rounded-xl bg-transparent transition ease-in-out delay-150 hover:scale-105 hover:bg-indigo-600 duration-300">
                            <span className="flex items-center justify-center gap-x-2">
                                Modo Vista
                                <FaRegEye className="h-5 w-5"/>
                            </span>
                    </button>
                </div>

                <div>
                    <button className="text-base px-2 w-full border-solid border-2 border-indigo-600  h-8 rounded-xl bg-transparent transition ease-in-out delay-150 hover:scale-105 hover:bg-indigo-600 duration-300">
                            <span className="flex items-center justify-center gap-x-2">
                                Ajustes
                                <IoMdSettings className="h-5 w-5"/>
                            </span>
                    </button>
                </div>

                <div>
                    <button className="text-base px-2 w-full border-solid border-2 border-indigo-600  h-8 rounded-xl bg-transparent transition ease-in-out delay-150 hover:scale-105 hover:bg-indigo-600 duration-300">
                            <span className="flex items-center justify-center gap-x-2">
                                Exportar PDF
                                <FaFilePdf className="h-5 w-5"/>
                            </span>
                    </button>
                </div>

                <div>
                    <button className="text-base px-2 w-full border-solid border-2 border-indigo-600  h-8 rounded-xl bg-transparent transition ease-in-out delay-150 hover:scale-105 hover:bg-indigo-600 duration-300">
                            <span className="flex items-center justify-center gap-x-2">
                                Descargar Imagen
                                <FaFileImage className="h-5 w-5" />
                            </span>
                    </button>
                </div>

            </div>

        </>
    );
}
