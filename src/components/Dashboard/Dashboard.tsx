'use client'

import { PageTitle } from "src/components/Common/PageTitle";
import { DashWidgets } from "src/components/Dashboard/DashWidgets";
import { QuickUpdateCompany } from "./QuickUpdateCompany";
import { QuickAddClient } from "./QuickAddClient";
import { InvoiceTable } from "src/components/Dashboard/InvoiceTable/InvoiceTable";
import { ClientTable } from "src/components/Dashboard/ClientTable";
import { useGetCompanyQuery } from "src/redux/services/company.Api";
import { COMPANYVOID } from "src/utils/constanst";
import { ShortcutButtons } from "./ShortcutButtons";
import { useSession } from "next-auth/react";
import { ShortcutButtonsLider } from "./ShortcutButtonsLider";
export const Dashboard = () => {
  const { data: company, isError: isErrorCompany, isLoading: isLoadingCompany} = useGetCompanyQuery();
  const { data: session } = useSession(); 
  const isLider = session?.user.role === 'lider'

  return (
    <div>
      <div className="p-4">
        <PageTitle title="PANEL DE VISUALIZACIÓN"/>
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
          {
            !isLider ? (
              <ShortcutButtons/>
            ) : (
              <ShortcutButtonsLider/>
            )
          }
          
          <div className="mt-4">
            <QuickUpdateCompany company={ company || COMPANYVOID } isLoadingCompany={isLoadingCompany} isErrorCompany={isErrorCompany} /> 
          </div>
          <div className="my-4">
            <QuickAddClient /> 
          </div>

          {
            !isLider ? (
              <ShortcutButtons/>
            ) : (
              <ShortcutButtonsLider/>
            )
          }
        </div>
      </div>
    </div>
  );
}
