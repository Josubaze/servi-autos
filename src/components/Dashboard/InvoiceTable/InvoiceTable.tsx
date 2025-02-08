
import { useSession } from "next-auth/react";
import { SelectInvoices } from "src/components/Common/SelectInvoices";
import { useGetInvoicesQuery } from "src/redux/services/invoices.Api";
import { darkThemeSolid2 } from "src/styles/themes/themeTable";


export const InvoiceTable = () => {
    const { data: invoices = [], isLoading, isError, isFetching, isSuccess} = useGetInvoicesQuery();
    const { data: session } = useSession(); 
    const isLider = session?.user.role === 'lider'
  return (
    <>
        <SelectInvoices
            data={invoices}
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching}
            isSuccess={isSuccess}
            rowsPerPage={isLider ? 10 : 5}
            theme={darkThemeSolid2}
        />
    </>
  );
}

