import React from 'react';

export const BudgetHeader = () => {
    return (
        <div className="py-9 bg-center bg-black-nav rounded-xl flex flex-col sm:flex-row justify-between items-center">
            <div className="flex flex-col px-8 sm:flex-row items-center">
                <div className="text-gray-100 font-title text-center sm:text-left">
                    <p className="font-bold mb-2">Nombre de la empresa</p>
                    <p className="text-sm font-medium">Por favor, añada los datos de la empresa</p>
                    <p className="text-sm font-medium">dirección de la empresa</p>
                    <p className="text-sm font-medium">Empresa@email.com</p>
                </div>
            </div>

            <div className="text-white px-8 font-title font-bold text-5xl mt-5 sm:mt-0">Presupuesto</div>
        </div>
    );
}
