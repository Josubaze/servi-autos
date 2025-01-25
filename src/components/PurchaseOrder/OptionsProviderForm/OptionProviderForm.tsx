import { Button } from "@nextui-org/react";
import { FaUsersGear } from "react-icons/fa6";
import { FaUsersCog } from "react-icons/fa";

interface OptionsProviderFormProps {
    setIsTableVisible: (isVisible: boolean) => void;
    isLoading: boolean;
    handleFormSubmit: () => void; // Ahora manejamos todo el submit en una sola función
}

export const OptionsProviderForm: React.FC<OptionsProviderFormProps> = ({
    setIsTableVisible,
    isLoading,
    handleFormSubmit,
}) => {
    return (
        <div>
            <div className="flex w-full items-center gap-x-2 pr-6">
                {/* Botón de Seleccionar proveedor */}
                <Button
                    color="default"
                    variant="flat"
                    disabled={isLoading}
                    className="w-1/2"
                    onClick={() => setIsTableVisible(true)}
                > 
                    Cargar Proveedor
                    <FaUsersCog className="h-5 w-5" />
                </Button>

                {/* Botón de Crear Proveedor */}
                <Button
                    color="success"
                    variant="flat"
                    disabled={isLoading}
                    isLoading={isLoading}
                    className="w-1/2"
                    onClick={handleFormSubmit} // Llamada directa
                >   

                    {isLoading ? 'Cargando...' : 'Agregar Proveedor'}
                    <FaUsersGear className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

