import React from 'react';
import { Button } from '@nextui-org/react';
import { MdStore } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa";
// Interfaz para las props
interface OptionsCreditNoteFormProps {
    setShowMarket: (isVisible: boolean) => void;
    setIsTableVisible: (isVisible: boolean) => void;
}

// Componente
export const OptionsCreditNoteForm: React.FC<OptionsCreditNoteFormProps> = ({
    setShowMarket,
    setIsTableVisible,
}) => {
    return (
        <div className="flex w-full items-center gap-x-2 pl-6">
            <Button
                color="default"
                variant="flat"
                onClick={() => setIsTableVisible(true)}
                className='w-1/2'
            > 
                Cargar Factura
                <FaFileInvoice className="h-5 w-5" />
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
