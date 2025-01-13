import { Button } from "@nextui-org/react";
import { IoPersonAdd } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";

interface OptionsCustomerFormProps {
    setIsTableVisible: (isVisible: boolean) => void;
    isLoading: boolean;
    handleFormSubmit: () => void; // Ahora manejamos todo el submit en una sola función
    title: string;
}

export const OptionsCustomerForm: React.FC<OptionsCustomerFormProps> = ({
    setIsTableVisible,
    isLoading,
    handleFormSubmit,
    title,
}) => {
    return (
        <div>
            {/* Botones para cargar cliente existente o crear nuevo */}
            <div className="flex items-end justify-between">
                <p className="font-title font-bold ">{title}</p>
                <div className="flex justify-center items-center gap-x-2 pr-6">
                    {/* Botón de Seleccionar Cliente */}
                    <Button
                        color="default"
                        variant="flat"
                        disabled={isLoading}
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
                        onClick={handleFormSubmit} // Llamada directa
                    >   

                        {isLoading ? 'Cargando...' : 'Agregar Cliente'}
                        <IoPersonAdd className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

