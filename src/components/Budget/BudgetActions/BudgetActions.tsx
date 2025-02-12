import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  Textarea,
  useDisclosure,
} from "@nextui-org/react";

interface BudgetActionsProps {
  description: string;
  setDescription: (value: string) => void;
  handleButtonType: (action: "draft" | "approved") => Promise<void>;
  mode?: "create" | "upload";
}

export const BudgetActions = ({
    description,
    setDescription,
    handleButtonType,
    mode,
  }: BudgetActionsProps) => {
    const [activeAction, setActiveAction] = useState<"draft" | "approved" | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
    // Texto de los tooltips basado en el valor de 'mode'
    const draftTooltipText = mode === "upload" ? "Actualizar como Borrador" : "Borrador";
    const approvedTooltipText = mode === "upload" ? "Actualizar como Aprobado" : "Aprobado";
  
    const handleOpenModal = (action: "draft" | "approved") => {
      setActiveAction(action);
      onOpen();
    };
  
    // Reiniciar activeAction cuando el modal se cierre
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
  
            {/* Botón de Borrador */}
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
  
            {/* Botón de Aprobado */}
            <Tooltip content={approvedTooltipText}>
              <Button
                color="success"
                variant="flat"
                isIconOnly
                className="w-16 h-16 min-w-16 rounded-full"
                onClick={() => handleOpenModal("approved")}
              >
                <LuFileCheck className="w-10 h-10" />
              </Button>
            </Tooltip>
          </div>
        </div>
  
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  {activeAction === "draft" ? "Guardar como Borrador" : "Guardar como Aprobado"}
                </ModalHeader>
                <ModalBody>
                  <Textarea
                    className="p-2 rounded-md bg-black-nav/50"
                    label="Descripción del Presupuesto"
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
