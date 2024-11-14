// SelectBudgetButton.tsx
import { FaFilePowerpoint } from "react-icons/fa6";

interface SelectBudgetButtonProps {
    onClick: () => void;
}

export const SelectBudgetButton = ({ onClick }: SelectBudgetButtonProps) => (
    <div className="relative">
        <button
            type="button"
            className="rounded-xl text-white flex items-center justify-center text-sm py-1 px-2 border-2 border-green-600 transition ease-in-out delay-150 hover:scale-110 hover:bg-green-600 duration-300"
            onClick={onClick}
        >
            <span className="flex items-center justify-center gap-x-2">
                Cargar
                <FaFilePowerpoint className="h-5 w-5" />
            </span>
        </button>
    </div>
);
