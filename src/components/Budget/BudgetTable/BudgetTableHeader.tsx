import React from 'react';

export const BudgetTableHeader: React.FC = () => (
    <div className="grid grid-cols-12 rounded-lg w-full bg-indigo-700 px-8 py-3">
        <div className="font-bold text-start pl-3 col-span-5">Descripción</div>
        <div className="font-bold text-end pr-6 col-span-2">Cantidad</div>
        <div className="font-bold text-end pr-4 col-span-2">Precio Unitario</div>
        <div className="font-bold text-end pr-3 col-span-2">Precio Total</div>
        <div className="font-bold text-center">Acciones</div>
    </div>
  );