import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { IoMdCheckmark, IoMdArrowBack } from "react-icons/io";
import { LuFileText, LuFileCheck } from "react-icons/lu";
import {
  Button,
  Divider,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";

interface PurchaseOrderActionsProps {
  description: string;
  setDescription: (value: string) => void;
  handleButtonType: (action: "draft" | "inProgress") => Promise<void>;
  mode?: "create" | "upload";
}

export const PurchaseOrderActions = ({
  description,
  setDescription,
  handleButtonType,
  mode,
}: PurchaseOrderActionsProps) => {
  // Para identificar la acción activa ("draft" o "inProgress")
  const [activeAction, setActiveAction] = useState<"draft" | "inProgress" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Textos de tooltip según el modo
  const draftTooltipText = mode === "upload" ? "Actualizar como Borrador" : "Borrador";
  const inProgressTooltipText = mode === "upload" ? "Actualizar como Procesar" : "Procesar";

  // Función para abrir el modal y establecer la acción activa
  const handleOpenModal = (action: "draft" | "inProgress") => {
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

          {/* Botón para acción "Borrador" */}
          <Tooltip content={draftTooltipText}>
            <Button
              color="default"
              variant="flat"
              isIconOnly
              className="w-16 h-16 min-w-16 rounded-full"
              onClick={() => handleOpenModal("draft")}
            >
              <LuFileText className="w-10 h-10" />
            </Button>
          </Tooltip>

          <Divider orientation="vertical" />

          {/* Botón para acción "En Proceso" */}
          <Tooltip content={inProgressTooltipText}>
            <Button
              color="success"
              variant="flat"
              isIconOnly
              className="w-16 h-16 min-w-16 rounded-full"
              onClick={() => handleOpenModal("inProgress")}
            >
              <LuFileCheck className="w-10 h-10" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {activeAction === "draft" ? "GUARDAR COMO: BORRADOR" : "GUARDAR COMO: PROCESAR"}
              </ModalHeader>
              <ModalBody>
                <Textarea
                    className="p-2 rounded-md"
                    label="Descripción"
                    variant="underlined"
                    placeholder="Escribe aquí la descripción..."
                    fullWidth
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
                  variant="flat"
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
