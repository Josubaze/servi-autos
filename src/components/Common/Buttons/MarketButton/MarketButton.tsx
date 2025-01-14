import { MdStore } from "react-icons/md";
import { Button } from "@nextui-org/react";

interface MarketButtonProps {
    onClick: () => void;
}

export const MarketButton = ({ onClick }: MarketButtonProps) =>{ 
    return (
    <div>
        <Button
            className="bg-yellow-400/20 text-yellow-400/90"
            variant="flat"
            onClick={onClick}
        > 
            Consultar Mercado
            <MdStore className="h-6 w-6" />
        </Button>
    </div>
)};
