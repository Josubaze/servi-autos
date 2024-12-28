import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import { ThemeProvider, TextField } from "@mui/material";
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import { useState } from "react";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { RiArrowGoBackFill } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import { LuFileClock } from "react-icons/lu";
import { LuFileText } from "react-icons/lu";
import { LuFileCheck } from "react-icons/lu";
import { Loading } from "src/components/Common/Loading";
import { set } from "mongoose";

interface InvoiceActionsProps {
    description: string;
    setDescription: (value: string) => void;
    handleButtonType: (action: "draft" | "paid" | "pending") => Promise<void>;
    mode: string;
}

export const InvoiceActions = ({
    description,
    setDescription,
    handleButtonType,
    mode,
}: InvoiceActionsProps) => {
    const [activeButton, setActiveButton] = useState<"draft" | "paid" | "pending" | null>(null);

    const showTextField = activeButton === "draft" || activeButton === "paid" || activeButton === "pending";

    // Texto de los tooltips basado en el valor de 'mode'
    const draftTooltipText = mode === "update" ? "Actualizar como Borrador" : "Borrador";
    const paidTooltipText = mode === "update" ? "Actualizar como Pagada" : "Pagada";
    const pendingTooltipText = mode === "update" ? "Actualizar como Pendiente" : "Pendiente";
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="grid grid-cols-2 rounded-lg w-full py-3 mt-6 pr-4">
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

                {/* Mostrar el TextField solo cuando un botón está activo */}
                {showTextField && (
                    <ThemeProvider theme={TextFieldTheme}>
                        <TextField
                            label="Descripción"
                            variant="outlined"
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </ThemeProvider>
                )}

                {/* Botón de borrador */}
                {activeButton !== "paid" && activeButton !== "pending" && (
                    <Tooltip title={activeButton === "draft" ? "Volver" : draftTooltipText} arrow>
                        <button
                            className="w-16 h-16 rounded-full bg-transparent border-2 border-gray-600 flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 hover:bg-gray-600 hover:border-gray-600 duration-300"
                            onClick={() => setActiveButton(activeButton === "draft" ? null : "draft")}
                        >
                            {activeButton === "draft" ? (
                                <RiArrowGoBackFill className="w-16 h-16 p-4" />
                            ) : (
                                <LuFileText className="w-16 h-16 p-3" />
                            )}
                        </button>
                    </Tooltip>
                )}

                {/* Botón de pendiente */}
                {activeButton !== "draft" && activeButton !== "paid" && (
                    <Tooltip title={activeButton === "pending" ? "Volver" : pendingTooltipText} arrow>
                        <button
                            className={`w-16 h-16 rounded-full bg-transparent border-2 ${
                                activeButton === "pending"
                                    ? "border-gray-600 hover:bg-gray-600"
                                    : "border-yellow-600 hover:border-yellow-600 hover:bg-yellow-600"
                            } flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 duration-300`}
                            onClick={() => setActiveButton(activeButton === "pending" ? null : "pending")}
                        >
                            {activeButton === "pending" ? (
                                <RiArrowGoBackFill className="w-16 h-16 p-4" />
                            ) : (
                                <LuFileClock  className="w-16 h-16 p-3" />
                            )}
                        </button>
                    </Tooltip>
                )}

                {/* Botón de aceptado */}
                {activeButton !== "draft" && activeButton !== "pending" && (
                    <Tooltip title={activeButton === "paid" ? "Volver" : paidTooltipText} arrow>
                        <button
                            className={`w-16 h-16 rounded-full bg-transparent border-2 ${
                                activeButton === "paid"
                                    ? "border-gray-600 hover:bg-gray-600"
                                    : "border-green-600 hover:border-green-600 hover:bg-green-600"
                            }  flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 duration-300`}
                            onClick={() => setActiveButton(activeButton === "paid" ? null : "paid")}
                        >
                            {activeButton === "paid" ? (
                                <RiArrowGoBackFill className="w-16 h-16 p-4" />
                            ) : (
                                <LuFileCheck className="w-16 h-16 p-3" />
                            )}
                        </button>
                    </Tooltip>
                )}

                {/* Botón de confirmación */}
                {activeButton && (
                    <Tooltip title="Confirmar" arrow>
                        <button
                            className={`w-16 h-16 rounded-full bg-transparent border-2 ${
                                isLoading ? "cursor-wait opacity-50" : "cursor-pointer hover:scale-110"
                            } border-blue-600 flex justify-center items-center transition-all ease-in-out delay-150 hover:bg-blue-600 hover:border-blue-600 duration-300`}
                            onClick={async () => {
                                if (activeButton) {
                                    setIsLoading(true); 
                                    try {
                                        await handleButtonType(activeButton); 
                                    } finally {
                                        setActiveButton(null);
                                        setIsLoading(false); 
                                    }
                                }
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                                    <Loading />
                                </div>
                            ) : (
                                <IoMdCheckmark className="w-16 h-16 p-4" />
                            )}
                        </button>
                    </Tooltip>
                )}
            </div>
        </div>
    );
};
