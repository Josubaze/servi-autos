'use client'

import { Button } from "src/components/Common/Button";
import { PageTitle } from "src/components/Common/PageTitle";
import {DashWidgets} from "src/components/Dashboard/DashWidgets";
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
      <div className="flex flex-wrap px-6 py-6">
        <div className="w-full lg:w-4/6 pl-4 pr-4 sm:pl-4 sm:pr-0 mb-4 sm:mb-1">
          <DashWidgets />
          <div className="mt-1">
            <InvoiceTable />
          </div>
          <div className="mt-4">
            <ClientTable /> 
          </div>
        </div>
        <div className="w-full lg:w-2/6 pl-4 pr-4 sm:pl-4 sm:pr-2">
          <div className="grid gap-y-2">
            <Button color="bg-green-600" block>
              <InvoiceIcon />
              <span className="inline-block ml-2"> Agregar Presuepuesto </span>
            </Button>

            <Button block>
              <InvoiceIcon />
              <span className="inline-block ml-2"> Agregar Factura </span>
            </Button>
          </div>
            <QuickEditCompany  /> 
          <div className="mt-4">
            <QuickAddClient /> 
          </div>
        </div>
      </div>
    </div>
  );
}
