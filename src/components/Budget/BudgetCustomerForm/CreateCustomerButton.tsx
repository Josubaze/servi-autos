import { IoPersonAdd } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";

interface CreateCustomerButtonProps {
    isLoading: boolean;
    onClick: () => void;
}

export const CreateCustomerButton = ({ isLoading, onClick }: CreateCustomerButtonProps) => (
    <div className="relative">
        <Tooltip title="Agregar Cliente" arrow>
        <button
            type="button"
            disabled={isLoading}
            onClick={onClick}
            className={`py-1 px-2 rounded-full text-white flex items-center justify-center text-sm border-2 border-blue-600 transition ease-in-out delay-150 hover:scale-110 hover:bg-blue-600 duration-300 
                ${
                isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
        >
            {isLoading && (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
            )}
            {isLoading ? 'Procesando...' : 'Agregar'}
            {!isLoading && <IoPersonAdd className="h-5 w-5 ml-2" />}
        </button>
        </Tooltip>
    </div>
);
