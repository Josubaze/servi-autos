import { useState } from "react";
import { motion } from "framer-motion";
import { IoMdCheckmark, IoMdArrowBack } from "react-icons/io";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { LuFileCheck } from "react-icons/lu";
import { Loading } from "src/components/Common/Loading";
import {
  Button,
  Textarea,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

interface CreditNoteActionsProps {
  description: string;
  setDescription: (value: string) => void;
  handleSave: () => Promise<void>;
}

export const CreditNoteActions = ({
  description,
  setDescription,
  handleSave,
}: CreditNoteActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full">
      {/* Botón que abre el modal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
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

      {/* Modal de confirmación */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>GUARDAR NOTA DE CRÉDITO</ModalHeader>
              <ModalBody>
                <Textarea
                    className="p-2 rounded-md bg-black-nav/50"
                    label="Sea breve, por favor."
                    variant="underlined"
                    labelPlacement="outside"
                    placeholder="Escribe aquí el motivo de la nota de crédito..."
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
                  variant="flat"
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
