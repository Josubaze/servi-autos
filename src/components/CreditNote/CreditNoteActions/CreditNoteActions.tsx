import { motion, AnimatePresence } from "framer-motion";
import { IoMdCheckmark } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { Loading } from "src/components/Common/Loading";
import { useState } from "react";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { LuFileCheck } from "react-icons/lu";
import { Button, Textarea, Tooltip } from "@nextui-org/react";

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
    const [isActive, setIsActive] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
            {isActive ? (
                <motion.div
                key="active"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col items-center gap-6 py-6"
                >
                {/* Textarea de NextUI con animaciones */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full sm:w-3/4 max-w-xl"
                >
                    <Textarea
                    className="p-4 rounded-md bg-black-nav/50"
                    label="Motivo de la Nota de Crédito"
                    variant="underlined"
                    labelPlacement="outside"
                    placeholder="Escribe aquí el motivo de la nota de crédito..."
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </motion.div>

                {/* Botones debajo del textarea */}
                <div className="flex gap-4">
                    <Tooltip content="Volver">
                        <Button
                            color="default"
                            variant="flat"
                            isIconOnly
                            className="w-16 h-16 min-w-16 rounded-full"
                            onClick={() => {
                            setDescription("");
                            setIsActive(false);
                            }}
                        >
                            <IoMdArrowBack className="w-10 h-10" />
                        </Button>
                    </Tooltip>

                    <Tooltip content="Confirmar">
                        <Button
                            color="primary"
                            variant="flat"
                            isIconOnly
                            className="w-16 h-16 min-w-16 rounded-full"
                            onClick={async () => {
                            setIsLoading(true);
                            try {
                                await handleSave();
                            } finally {
                                setIsLoading(false);
                                setIsActive(false);
                            }
                            }}
                            isLoading={isLoading}
                        >
                            {isLoading ? (
                            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                                <Loading />
                            </div>
                            ) : (
                            <IoMdCheckmark className="w-10 h-10" />
                            )}
                        </Button>
                    </Tooltip>
                </div>
                </motion.div>
            ) : (
                <motion.div
                key="inactive"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
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
                        onClick={() => setIsActive(true)}
                    >
                        <LuFileCheck className="w-10 h-10" />
                    </Button>
                    </Tooltip>
                </div>
                </motion.div>
            )}
            </AnimatePresence>

        </div>
    );
};
