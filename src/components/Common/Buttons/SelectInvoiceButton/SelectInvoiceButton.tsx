import { FaFileInvoice } from "react-icons/fa6";
import { Button } from "@nextui-org/react";
interface SelectInvoiceButtonProps {
    onClick: () => void;
}

export const SelectInvoiceButton = ({ onClick }: SelectInvoiceButtonProps) =>{ 
    return (
        <div>
            <Button
                color="default"
                variant="flat"
                onClick={onClick}
            > 
                Cargar Factura
                <FaFileInvoice className="h-5 w-5" />
            </Button>
        </div>
)};
