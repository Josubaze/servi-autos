// SelectBudgetButton.tsx
import { FaFilePowerpoint } from "react-icons/fa6";
import { Button } from "@nextui-org/react";
interface SelectBudgetButtonProps {
    onClick: () => void;
}

export const SelectBudgetButton = ({ onClick }: SelectBudgetButtonProps) =>{ 
    return (
        <div>
            <Button
                color="default"
                variant="flat"
                onClick={onClick}
            > 
                Cargar Presupuesto
                <FaFilePowerpoint className="h-5 w-5" />
            </Button>
        </div>
)};
