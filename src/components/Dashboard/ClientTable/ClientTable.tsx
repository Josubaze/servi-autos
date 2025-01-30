
import { SelectCustomers } from "src/components/Common/SelectCustomers";
import { useGetCustomersQuery } from "src/redux/services/customersApi";
import { darkThemeSolid2 } from "src/styles/themes/themeTable";


export const ClientTable = () => {
    const { data: customers = [], isLoading, isError, isFetching, isSuccess} = useGetCustomersQuery();
  return (
    <>
        <SelectCustomers
            data={customers}
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching}
            isSuccess={isSuccess}
            rowsPerPage={5}
            theme={darkThemeSolid2}
        />
    </>
  );
}

