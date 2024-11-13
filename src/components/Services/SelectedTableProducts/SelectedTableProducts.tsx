import React from 'react';
import { DeleteButton } from 'src/components/Common/Buttons/DeleteButton';

interface SelectedTableProductsProps {
  selectedProducts: Product[];
  handleQuantityChange: (index: number, value: number) => void;
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  servicePrice: number;
}

export const SelectedTableProducts: React.FC<SelectedTableProductsProps> = ({
  selectedProducts,
  handleQuantityChange,
  setSelectedProducts,
  servicePrice
}) => {
  const totalProductos = selectedProducts.reduce((total, product) => {
    return total + product.quantity * product.price;
  }, 0);
  const totalService = (totalProductos + servicePrice).toFixed(2);
  return (
    <div className="mt-4">
      <h3 className="font-bold text-xl mb-2">Productos Seleccionados:</h3>
      {selectedProducts.length > 0 ? (
        <div className="overflow-x-auto max-h-[400px] bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full table-auto text-gray-200">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Cantidad</th>
                <th className="px-4 py-2 text-left">Precio</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Acción</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product, index) => (
                <tr key={index} className="border-b border-gray-600">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, Number(e.target.value))
                      }
                      className="bg-gray-700 text-white p-2 rounded-md w-20"
                    />
                  </td>
                  <td className="px-4 py-2">{product.price.toFixed(2)}</td>
                  <td className="px-4 py-2">{(product.quantity * product.price).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <DeleteButton 
                      onClick={() =>
                        setSelectedProducts((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
              <tr className="border-t-4 border-gray-600">
                <td colSpan={3} className="px-4 py-2 text-right">Total de Productos:</td>
                <td className="px-4 py-2 ">{totalProductos.toFixed(2)}</td>
                <td></td>
              </tr>
              <tr className="border-t-0 border-gray-600">
                <td colSpan={3} className="px-4 py-2 font-bold text-right">Total del Servicio:</td>
                <td className="px-4 py-2 font-bold text-green-600">{totalService}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay productos seleccionados.</p>
      )}
    </div>
  );
};

