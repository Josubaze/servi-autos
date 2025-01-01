// SelectBudgetButton.tsx
import { FaFileInvoice } from "react-icons/fa6";
import Tooltip from "@mui/material/Tooltip";
interface SelectInvoiceButtonProps {
    onClick: () => void;
}

export const SelectInvoiceButton = ({ onClick }: SelectInvoiceButtonProps) =>{ 
    return (
    <div className="relative">
        <Tooltip title="Cargar Factura" arrow>
        <button
            type="button"
            className="py-1 px-2 rounded-full text-white flex items-center justify-center text-sm border-2 border-gray-600 transition ease-in-out delay-150 hover:scale-110 hover:bg-gray-600 duration-300"
            onClick={onClick}
        >
            <span className="flex items-center justify-center gap-x-2">
                Cargar
                <FaFileInvoice className="h-5 w-5" />
            </span>
        </button>
        </Tooltip>
    </div>
)};
