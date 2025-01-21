import React from 'react';

export const BudgetTableHeader: React.FC = () => (
    <div className="grid grid-cols-12 rounded-lg w-full bg-indigo-700 gap-x-4 px-8 py-3">
        <div className="font-bold text-start col-span-5">Descripción</div>
        <div className="font-bold text-end col-span-2">Cantidad</div>
        <div className="font-bold text-end col-span-2">Precio Unitario</div>
        <div className="font-bold text-end col-span-2">Precio Total</div>
        <div className="font-bold text-center">Acciones</div>
    </div>
  );