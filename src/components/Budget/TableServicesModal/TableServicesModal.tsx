// SelectTableModal.tsx
import { SelectServices } from "../../Common/SelectServices";
import { useBudgetTable } from "src/hooks/useBudgetTable";

interface TableServiceModalProps {
  onCloseTable: () => void;
}

export const TableServiceModal = ({ onCloseTable }: TableServiceModalProps) => {
  const {
    services,
    isLoading,
    isError,
    isSuccess,
    handleSelect,
  } = useBudgetTable();  // Si no es necesario pasar `handleSelect` desde `BudgetTable`, lo movemos al hook

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <SelectServices
        data={services}
        isLoading={isLoading}
        isError={isError}
        isSuccess={isSuccess}
        handleSelect={handleSelect}
        onCloseTable={onCloseTable}
      />
    </div>
  );
};
