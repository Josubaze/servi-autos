import React from 'react';
import { MarketButton } from '../../Common/Buttons/MarketButton';
import { SelectBudgetButton } from '../../Common/Buttons/SelectBudgetButton';

// Interfaz para las props
interface OptionsFormProps {
    setShowMarket: (isVisible: boolean) => void;
    setIsTableVisible: (isVisible: boolean) => void;
}

// Componente
export const OptionsForm: React.FC<OptionsFormProps> = ({
    setShowMarket,
    setIsTableVisible,
}) => {
    return (
        <div className="flex items-center justify-start gap-x-3">
            {/* Sección de Consultar Mercado */}
            <div className="flex items-center justify-center pl-6">
                <MarketButton onClick={() => setShowMarket(true)} />
            </div>

            {/* Sección de Presupuesto Existente */}
            <div className="flex items-center justify-center">
                <SelectBudgetButton onClick={() => setIsTableVisible(true)} />
            </div>
        </div>
    );
};
