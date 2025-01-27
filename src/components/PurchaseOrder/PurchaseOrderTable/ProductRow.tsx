import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { Button, Input, Tooltip } from "@nextui-org/react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

export const ProductRow: React.FC<{
  product: Product;
  onDeleteRow: (id: string) => void;
  onNameChange: (value: string, id: string) => void;
  onQuantityChange: (value: string, id: string) => void;
  onPriceChange: (id: string, newPrice: number) => void;
}> = ({
  product,
  onDeleteRow,
  onNameChange,
  onQuantityChange,
  onPriceChange,
}) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const handleDeleteConfirmation = () => {
    setIsConfirming(false); // Reset confirmation
    onDeleteRow(product._id); 
  };

  return (
    <div className="px-8 pt-4">
      <div className="bg-black-nav/50 p-3 rounded-lg">
        <div className="grid grid-cols-12 gap-x-4 rounded-lg w-full">
          <div className="col-span-5">
            <Input
              size="md"
              value={product.name}
              variant="underlined"
              fullWidth
              type="text"
              onChange={(e) => onNameChange(product._id, e.target.value)}
            />
          </div>

          <div className="col-span-2 pl-4">
            <Input
              size="md"
              value={Number(product.quantity).toLocaleString("de-DE", {
                minimumFractionDigits: 0,
              })}
              variant="underlined"
              fullWidth
              onChange={(e) => {
                const value = e.target.value.replace(/\./g, "").replace(/,/g, "");
                if (!isNaN(Number(value)) && Number(value) >= 0) {
                  onQuantityChange(value, product._id);
                }
              }}
              style={{ textAlign: "right" }}
              type="text"
              inputMode="numeric"
            />
          </div>

          <div className="col-span-2 pl-4">
            <Input
              size="md"
              value={Number(product.price).toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              variant="underlined"
              fullWidth
              onChange={(e) => {
                const inputValue = e.target.value.replace(/\./g, "").replace(/,/g, "");
                const numericValue = parseInt(inputValue || "0", 10);
                // Actualizamos el precio con lógica de centavos, dividimos entre 100
                const adjustedValue = numericValue / 100;
                onPriceChange(product._id, adjustedValue);
              }}
              type="text"
              inputMode="numeric"
              style={{ textAlign: "right" }}
            />
          </div>

          <div className="col-span-2 pl-4">
            <Input
              size="md"
              value={Number(product.price * product.quantity).toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              variant="underlined"
              fullWidth
              disabled
              style={{ textAlign: "right" }}
              type="text"
              inputMode="numeric"
            />
          </div>

          {isConfirming ? (
            <div className="flex justify-center gap-2">
              <Button
                color="danger"
                variant="flat"
                isIconOnly
                className="w-10 h-10 min-w-10 rounded-full"
                onClick={() => setIsConfirming(false)}
              >
                <AiOutlineClose className="w-8 h-8" />
              </Button>

              <Button
                color="success"
                variant="flat"
                isIconOnly
                className="w-10 h-10 min-w-10 rounded-full"
                onClick={handleDeleteConfirmation}
              >
                <AiOutlineCheck className="w-8 h-8" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-center gap-2">
              <Tooltip content="Eliminar Producto">
                <Button
                  color="default"
                  variant="flat"
                  isIconOnly
                  className="w-10 h-10 min-w-10 rounded-full"
                  onClick={() => setIsConfirming(true)} // Activar modo de confirmación
                >
                  <MdDelete className="w-8 h-8" />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
