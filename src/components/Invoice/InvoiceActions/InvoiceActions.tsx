import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { IoMdCheckmark, IoMdArrowBack } from "react-icons/io";
import { LuFileCheck, LuFileClock } from "react-icons/lu";
import {
  Button,
  Divider,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Loading } from "src/components/Common/Loading";

interface InvoiceActionsProps {
  description: string;
  setDescription: (value: string) => void;
  handleButtonType: (action: "pending" | "paid") => Promise<void>;
}

export const InvoiceActions = ({
  description,
  setDescription,
  handleButtonType,
}: InvoiceActionsProps) => {
  // Estado para la acción activa: solo "pending" o "paid"
  const [activeAction, setActiveAction] = useState<"pending" | "paid" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Textos de tooltip para las dos acciones
  const pendingTooltipText = "Pendiente";
  const paidTooltipText = "Pagada";

  // Función para abrir el modal y fijar la acción activa
  const handleOpenModal = (action: "pending" | "paid") => {
    setActiveAction(action);
    onOpen();
  };

  // Reiniciar activeAction cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      setActiveAction(null);
    }
  }, [isOpen]);

  return (
    <>
      <div className="grid grid-cols-2 rounded-lg w-full py-3 mt-6 pr-4">
        <div className="col-start-2 flex items-center justify-end gap-x-4">
          <div>
            <motion.div
              animate={{ x: ["0px", "20px", "0px"] }}
              transition={{ duration: 1, repeat: 5, ease: "easeInOut" }}
              className="flex gap-x-2 justify-center items-center"
            >
              <span className="font-knewave text-4xl">GUARDAR</span>
              <TbArrowBadgeRightFilled className="text-5xl" />
            </motion.div>
          </div>

          {/* Botón para acción "Pendiente" */}
          <Tooltip content={pendingTooltipText}>
            <Button
              color="warning"
              variant="flat"
              isIconOnly
              className="w-16 h-16 min-w-16 rounded-full"
              onClick={() => handleOpenModal("pending")}
            >
              <LuFileClock className="w-10 h-10" />
            </Button>
          </Tooltip>

          <Divider orientation="vertical" />
          
          {/* Botón para acción "Pagada" */}
          <Tooltip content={paidTooltipText}>
            <Button
              color="success"
              variant="flat"
              isIconOnly
              className="w-16 h-16 min-w-16 rounded-full"
              onClick={() => handleOpenModal("paid")}
            >
              <LuFileCheck className="w-10 h-10" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Modal para ingresar la descripción y confirmar la acción */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {activeAction === "pending"
                  ? "GUARDAR COMO: PENDIENTE"
                  : activeAction === "paid"
                  ? "GUARDAR COMO: PAGADA"
                  : "Guardar"}
              </ModalHeader>
              <ModalBody>
                <Textarea
                  className="p-2 rounded-md"
                  label="Descripción"
                  variant="underlined"
                  labelPlacement="outside"
                  placeholder="Escribe aquí la descripción..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="flat"
                  onPress={() => {
                    setDescription("");
                    onClose();
                  }}
                  startContent={<IoMdArrowBack />}
                >
                  Volver
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={async () => {
                    if (activeAction) {
                      setIsLoading(true);
                      try {
                        await handleButtonType(activeAction);
                      } finally {
                        setIsLoading(false);
                        onClose();
                      }
                    }
                  }}
                  startContent={<IoMdCheckmark />}
                >
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
