'use client';

import React from 'react';
import { useGetCompanyQuery } from 'src/redux/services/company.Api'; // Asegúrate de importar tu servicio
import { COMPANYVOID } from 'src/utils/constanst';

export const BudgetHeader = () => {
  const { data: company, isLoading, isError } = useGetCompanyQuery();

  return (
    <div className="py-9 bg-center bg-black-nav rounded-xl flex flex-col sm:flex-row justify-between items-center">
      <div className="flex flex-col px-8 sm:flex-row items-center">
        <div className="text-gray-100 font-title text-center sm:text-left">

          {isLoading && <p className="font-medium">Cargando datos de la empresa...</p>}

          {isError && (
            <p className="font-medium text-red-500">
              No se pudo cargar la información de la empresa
            </p>
          )}

          {!isLoading && !isError && company && (
            <>
              <p className="font-bold mb-2">{company.name || 'Nombre no disponible'}</p>
              <p className="text-sm font-medium">
                {company.id_card || 'Dirección no disponible'}
              </p>
              <p className="text-sm font-medium">
                {company.address || 'Dirección no disponible'}
              </p>
              <p className="text-sm font-medium">
                {company.email || 'Email no disponible'}
              </p>
              <p className="text-sm font-medium">
                {company.phone || 'Teléfono no disponible'}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="font-knewave px-8 font-title text-5xl mt-5 sm:mt-0">Presupuesto</div>
    </div>
  );
};
