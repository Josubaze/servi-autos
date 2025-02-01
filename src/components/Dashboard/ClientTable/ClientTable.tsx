
import { useSession } from "next-auth/react";
import { SelectCustomers } from "src/components/Common/SelectCustomers";
import { useGetCustomersQuery } from "src/redux/services/customersApi";
import { darkThemeSolid2 } from "src/styles/themes/themeTable";


export const ClientTable = () => {
    const { data: customers = [], isLoading, isError, isFetching, isSuccess} = useGetCustomersQuery();
    const { data: session } = useSession(); 
    const isLider = session?.user.role === 'lider'
  return (
    <>
        <SelectCustomers
            data={customers}
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

