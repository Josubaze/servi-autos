'use client'

import { Button } from "src/components/Common/Button";
import { PageTitle } from "src/components/Common/PageTitle";
import { DashWidgets } from "src/components/Dashboard/DashWidgets";
import { InvoiceIcon } from "src/components/Icons/InvoiceIcon";
import { QuickEditCompany } from "../QuickEditCompany";
import { QuickAddClient } from "../QuickAddClient";
import { InvoiceTable } from "src/components/Invoice/InvoiceTable/InvoiceTable";
import { ClientTable } from "src/components/Client/ClientTable";

export const DashboardScreen = () => {
  return (
    <div>
      <div className="p-4">
        <PageTitle title="Panel de visualización"/>
      </div>
      <div className="flex flex-col lg:flex-row px-6 py-6">
        <div className="w-full lg:w-4/6 pl-4 pr-4 sm:pl-4 sm:pr-0 mb-4 sm:mb-1">
          <DashWidgets />
          <div className="mt-1">
            <InvoiceTable />
          </div>
          <div className="mt-4">
            <ClientTable /> 
          </div>
        </div>
        <div className="w-full lg:w-2/6 pl-4 pr-4 sm:pl-4 sm:pr-2 mt-6 lg:mt-0">
          <div className="grid gap-y-2">
            <button className="rounded-xl font-titl flex flex-row items-center justify-center w-full  h-12 px-4 transition ease-in-out delay-150 bg-emerald-600 text-white rounded-s-lg hover:-translate-y-1 hover:scale-110 hover:bg-indigo-600 duration-300" >
              <InvoiceIcon />
              <span className="inline-block ml-2"> Agregar Presupuesto </span>
            </button>

            <button className="rounded-xl font-titl flex flex-row items-center justify-center w-full  h-12 px-4 transition ease-in-out delay-150 bg-emerald-600 text-white rounded-s-lg hover:-translate-y-1 hover:scale-110 hover:bg-indigo-600 duration-300" >
              <InvoiceIcon />
              <span className="inline-block ml-2"> Agregar Factura </span>
            </button>
          </div>
          <div className="mt-4">
            <QuickEditCompany /> 
          </div>
          <div className="mt-4">
            <QuickAddClient /> 
          </div>
        </div>
      </div>
    </div>
  );
}
