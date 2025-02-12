import { motion, AnimatePresence } from "framer-motion";
import { IoMdCheckmark } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { LuFileCheck } from "react-icons/lu";
import { Button, Textarea, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useState } from "react";

interface ReportActionsProps {
  description: string;
  setDescription: (value: string) => void;
  handleSave: () => Promise<void>;
}

export const ReportActions = ({
  description,
  setDescription,
  handleSave,
}: ReportActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key="inactive"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 rounded-lg w-full py-3 mt-6 pr-4"
        >
          <div className="col-start-2 flex items-center justify-end gap-x-4 relative">
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

            <Tooltip content="Guardar">
              <Button
                color="success"
                variant="flat"
                isIconOnly
                className="w-16 h-16 min-w-16 rounded-full"
                onClick={onOpen}
              >
                <LuFileCheck className="w-10 h-10" />
              </Button>
            </Tooltip>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modal de NextUI */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>GUARDAR INFORME</ModalHeader>
              <ModalBody>
                <Textarea
                  className="p-2 rounded-md bg-black-nav/50"
                  label="Algo breve, por favor."
                  variant="underlined"
                  labelPlacement="outside"
                  placeholder="Escribe aquí la descripción del informe..."
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
                    setIsLoading(true);
                    try {
                      await handleSave();
                    } finally {
                      setIsLoading(false);
                      onClose();
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
    </div>
  );
};
