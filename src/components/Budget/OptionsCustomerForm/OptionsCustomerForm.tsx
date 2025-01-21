import { Button } from "@nextui-org/react";
import { IoPersonAdd } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";

interface OptionsCustomerFormProps {
    setIsTableVisible: (isVisible: boolean) => void;
    isLoading: boolean;
    handleFormSubmit: () => void; // Ahora manejamos todo el submit en una sola función
}

export const OptionsCustomerForm: React.FC<OptionsCustomerFormProps> = ({
    setIsTableVisible,
    isLoading,
    handleFormSubmit,
}) => {
    return (
        <div>
        {/* Botones para cargar cliente existente o crear nuevo */}
            <div className="flex w-full items-center gap-x-2 pr-6">
                {/* Botón de Seleccionar Cliente */}
                <Button
                    color="default"
                    variant="flat"
                    disabled={isLoading}
                    className="w-1/2"
                    onClick={() => setIsTableVisible(true)}
                > 
                    Cargar Cliente
                    <IoPerson className="h-5 w-5" />
                </Button>

                {/* Botón de Crear Cliente */}
                <Button
                    color="success"
                    variant="flat"
                    disabled={isLoading}
                    isLoading={isLoading}
                    className="w-1/2"
                    onClick={handleFormSubmit} // Llamada directa
                >   

                    {isLoading ? 'Cargando...' : 'Agregar Cliente'}
                    <IoPersonAdd className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

