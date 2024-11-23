import { IoPerson } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";
interface SelectCustomerButtonProps {
    onClick: () => void;
}

export const SelectCustomerButton = ({ onClick }: SelectCustomerButtonProps) => (
    <div className="relative">
        <Tooltip title="Cargar Cliente" arrow>
            <button
            type="button"
            className="py-1 px-2 rounded-full flex text-white items-center justify-center text-sm border-2 border-gray-600 transition ease-in-out delay-150 hover:scale-110 hover:bg-gray-600 duration-300"
            onClick={onClick}
        >
            <span className="flex items-center justify-center gap-x-2">
                Cargar
                <IoPerson className="h-5 w-5"/>
            </span>
        </button>
        </Tooltip>
    </div>
);
