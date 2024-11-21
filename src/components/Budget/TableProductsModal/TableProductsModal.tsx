// TableProductsModal.tsx
import { TableProducts } from "src/components/Services/TableProducts";
import { useBudgetTable } from "src/hooks/useBudgetTable";

interface TableProductsModalProps {
  onCloseTable: () => void;
}

export const TableProductsModal = ({ onCloseTable }: TableProductsModalProps) => {
  const {
    products,
    isErrorProducts,
    handleAddProduct,
  } = useBudgetTable(); // Lo mismo aquí, si no se requiere pasar productos de arriba, se puede manejar en el hook

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <TableProducts
        data={products}
        isError={isErrorProducts}
        onAddProduct={handleAddProduct}
        onCloseTable={onCloseTable}
      />
    </div>
  );
};
