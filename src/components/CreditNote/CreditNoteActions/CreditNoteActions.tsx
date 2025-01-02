import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import { IoMdCheckmark } from "react-icons/io";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Loading } from "src/components/Common/Loading";
import { useState } from "react";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { LuFileCheck } from "react-icons/lu";

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
                        {/* Textarea centrado */}
                        <motion.textarea
                            className="w-full sm:w-3/4 max-w-xl p-4 rounded-md bg-black-nav text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                            placeholder="Escribe aquí el motivo de la nota de crédito..."
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        />

                        {/* Botones debajo del textarea */}
                        <div className="flex gap-4">
                            {/* Botón Confirmar */}
                            <Tooltip title="Confirmar" arrow>
                                <button
                                    className={`w-16 h-16 rounded-full bg-transparent border-2 ${
                                        isLoading
                                            ? "cursor-wait opacity-50"
                                            : "cursor-pointer hover:scale-110"
                                    } border-blue-600 flex justify-center items-center transition-all ease-in-out delay-150 hover:bg-blue-600 hover:border-blue-600 duration-300`}
                                    onClick={async () => {
                                        setIsLoading(true);
                                        try {
                                            await handleSave();
                                        } finally {
                                            setIsLoading(false);
                                            setIsActive(false);
                                        }
                                    }}
                                    disabled={isLoading || !isActive}
                                >
                                    {isLoading ? (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                                            <Loading />
                                        </div>
                                    ) : (
                                        <IoMdCheckmark className="w-8 h-8" />
                                    )}
                                </button>
                            </Tooltip>

                            {/* Botón Volver */}
                            <Tooltip title="Volver" arrow>
                                <button
                                    className="w-16 h-16 rounded-full bg-transparent border-2 border-gray-600 flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 hover:bg-gray-600 hover:border-gray-600 duration-300"
                                    onClick={() => {
                                        setDescription("");
                                        setIsActive(false);
                                    }}
                                >
                                    <RiArrowGoBackFill className="w-8 h-8" />
                                </button>
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

                            <Tooltip title="Guardar" arrow>
                                <button
                                    className={`w-16 h-16 rounded-full bg-transparent border-2 border-green-600 hover:border-green-600 hover:bg-green-600 flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 duration-300`}
                                    onClick={() => setIsActive(true)}
                                >
                                    <LuFileCheck className="w-16 h-16 p-3" />
                                </button>
                            </Tooltip>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
