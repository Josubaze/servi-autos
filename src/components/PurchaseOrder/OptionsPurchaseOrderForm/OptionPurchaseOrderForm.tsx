import React from 'react';
import { Button } from '@nextui-org/react';
import { MdStore } from "react-icons/md";
import { FaFilePowerpoint } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";

// Interfaz para las props
interface OptionsPurchaseOrderFormProps {
    setShowMarket: (isVisible: boolean) => void;
    setIsTableVisible: (isVisible: boolean) => void;
}

// Componente
export const OptionsPurchaseOrderForm: React.FC<OptionsPurchaseOrderFormProps> = ({
    setShowMarket,
    setIsTableVisible,
}) => {
    return (
        <div className="flex w-full items-center gap-x-2 pl-6">

            <Button
                color="default"
                variant="flat"
                onClick={() => setIsTableVisible(true)}
                className="w-1/2"
            > 
                Cargar Orden de Compra
                <FaFilePowerpoint className="h-5 w-5" />
            </Button>

            <Button
                className="bg-yellow-400/20 text-yellow-400/90 w-1/2"
                variant="flat"
                onClick={() => setShowMarket(true)}
            > 
                Consultar Mercado
                <MdStore className="h-6 w-6" />
            </Button>
        </div>
    );
};
