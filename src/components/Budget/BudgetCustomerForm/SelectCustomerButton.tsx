import { IoPerson } from "react-icons/io5";

interface SelectCustomerButtonProps {
    onClick: () => void;
}

export const SelectCustomerButton = ({ onClick }: SelectCustomerButtonProps) => (
    <div className="relative">
        <button
            type="button"
            className="rounded-xl text-white flex items-center justify-center text-sm py-1 px-2 border-2 border-green-600 transition ease-in-out delay-150 hover:scale-110 hover:bg-green-600 duration-300"
            onClick={onClick}
        >
            <span className="flex items-center justify-center gap-x-2">
                Cargar
                <IoPerson className="h-5 w-5"/>
            </span>
        </button>
    </div>
);
