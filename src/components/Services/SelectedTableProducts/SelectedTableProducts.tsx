import { Input } from '@nextui-org/react';
import React from 'react';
import { NumericFormat } from 'react-number-format';
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
        <div className="overflow-x-auto max-h-[400px] bg-[#303030] rounded-lg shadow-md">
          <table className="min-w-full table-auto text-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left w-4/12">Nombre</th>
                <th className="px-4 py-2 text-left w-2/12">Cantidad</th>
                <th className="px-4 py-2 text-left w-2/12">Precio</th>
                <th className="px-4 py-2 text-left w-2/12">Total</th>
                <th className="px-4 py-2 text-left w-2/12">Acción</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">
                    <Input
                      size="sm"
                      value={Number(product.quantity).toLocaleString("de-DE", {
                        minimumFractionDigits: 0,
                      })} 
                      style={{ textAlign: "right" }}
                      variant="underlined"
                      fullWidth
                      onChange={(e) => {
                        const value = e.target.value.replace(/\./g, "").replace(/,/g, "");
                        if (!isNaN(Number(value)) && Number(value) >= 0) {
                          handleQuantityChange(index, Number(value) || 1)
                        }
                      }}                
                      type="text" 
                      inputMode="numeric"              
                    />
                  </td>
                  <td className="px-4 py-2">
                    <NumericFormat
                      value={product.price}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={false}
                      decimalScale={2}
                      fixedDecimalScale
                      prefix="$"
                      displayType="text"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <NumericFormat
                      value={product.price * product.quantity}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={false}
                      decimalScale={2}
                      fixedDecimalScale
                      prefix="$"
                      displayType="text"
                    />
                  </td>
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
              <tr>
                <td colSpan={3} className="px-4 py-2 font-bold text-right">Productos:</td>
                <td className="px-4 py-2 ">
                  <NumericFormat
                    value={totalProductos}
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale
                    prefix="$"
                    displayType="text"
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={3} className="px-4 py-2 font-bold text-right">Servicio:</td>
                <td className="px-4 py-2 font-bold text-green-600">
                  <NumericFormat
                    value={totalService}
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    decimalScale={2} // Mantener 2 decimales
                    fixedDecimalScale
                    prefix="$"
                    displayType="text"
                  />
                </td>
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

