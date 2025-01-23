import React from 'react';

export const ReportTableHeader: React.FC = () => (
    <div className="grid grid-cols-12 rounded-lg w-full bg-indigo-700 gap-x-4 px-8 py-3">
        <div className="font-bold text-start col-span-6">Descripción</div>
        <div className="font-bold text-end col-span-4">Cantidad</div>
        <div className="font-bold text-center col-span-2">Acciones</div>
    </div>
  );