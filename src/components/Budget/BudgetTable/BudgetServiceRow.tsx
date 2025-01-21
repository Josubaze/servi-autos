import React, { useState } from "react";
import { MdDelete, MdVisibility } from "react-icons/md";
import { Button, Input, Tooltip } from "@nextui-org/react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { BudgetProductTable } from "../BudgetProductTable";

export const BudgetServiceRow: React.FC<{
  service: Service;
  serviceDetailsVisible: boolean;
  onViewDetails: (service: Service) => void;
  onDeleteRow: (id: string) => void;
  onNameChange: (value: string, id: string) => void;
  onQuantityChange: (value: string, id: string) => void;
  onPriceChange: (id: string, newPrice: number) => void;
  onProductQuantityChange: (serviceId: string, productId: string, newQuantity: number) => void;
  onProductDelete: (productId: string) => void;
  onShowProductTable: (serviceId: string) => void;
}> = ({
  service,
  serviceDetailsVisible,
  onViewDetails,
  onDeleteRow,
  onNameChange,
  onQuantityChange,
  onPriceChange,
  onProductQuantityChange,
  onProductDelete,
  onShowProductTable,
}) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const handleDeleteConfirmation = () => {
    setIsConfirming(false); // Reset confirmation
    onDeleteRow(service._id); // Call delete
  };

  return (
    <div className="px-8 pt-4">
      <div
        className={`bg-black-nav/50 p-3 ${
          serviceDetailsVisible ? "rounded-none rounded-tl-lg rounded-tr-lg" : "rounded-lg"
        }`}
      >
        <div className="grid grid-cols-12 gap-x-4 rounded-lg w-full">
          <div className="col-span-5">
            <Input
              size="md"
              value={service.name}
              variant="underlined"
              fullWidth
              type="text"
              onChange={(e) => onNameChange(service._id, e.target.value)}
            />
          </div>

          <div className="col-span-2 pl-4">
            <Input
              size="md"
              value={Number(service.serviceQuantity).toLocaleString("de-DE", {
                minimumFractionDigits: 0,
              })}
              variant="underlined"
              fullWidth
              onChange={(e) => {
                const value = e.target.value.replace(/\./g, "").replace(/,/g, "");
                if (!isNaN(Number(value)) && Number(value) >= 0) {
                  onQuantityChange(value, service._id);
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
              value={Number(service.totalPrice).toLocaleString("de-DE", {
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

          <div className="col-span-2 pl-4">
            <Input
              size="md"
              value={Number(service.totalPrice * service.serviceQuantity).toLocaleString("de-DE", {
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
            <>
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
            </>
          ) : (
            <>
            <div className="flex justify-center gap-2">
              <Tooltip content="Ver Detalles">
                <Button
                  color="default"
                  variant="flat"
                  isIconOnly
                  className="w-10 h-10 min-w-10 rounded-full"
                  onClick={() => onViewDetails(service)}
                >
                  <MdVisibility className="w-8 h-8" />
                </Button>
              </Tooltip>

              <Tooltip content="Eliminar Servicio">
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
            </>
          )}
        </div>
      </div>

      {serviceDetailsVisible && (
        <BudgetProductTable
          productos={service.products}
          servicePrice={service.servicePrice || 0}
          onServicePriceChange={(newPrice) => onPriceChange(service._id, newPrice)}
          onProductQuantityChange={(productId, newQuantity) =>
            onProductQuantityChange(service._id, productId, newQuantity)
          }
          onProductDelete={(productId) => onProductDelete(productId)}
          onProductTableVisible={() => onShowProductTable(service._id)}
        />
      )}
    </div>
  );
};
