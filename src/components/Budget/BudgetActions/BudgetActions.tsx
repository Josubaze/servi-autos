import { LuSaveAll } from "react-icons/lu";
import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import { RiDraftLine } from "react-icons/ri";
import { ThemeProvider, TextField } from "@mui/material";
import { TextFieldTheme } from "src/styles/themes/themeTextField";
import { useState } from "react";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { RiArrowGoBackFill } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import { Loading } from "src/components/Common/Loading";
import { LuFileText } from "react-icons/lu";
import { LuFileCheck } from "react-icons/lu";

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
    mode
}: BudgetActionsProps) => {
    const [activeButton, setActiveButton] = useState<"draft" | "approved" | null>(null);

    const showTextField = activeButton === "draft" || activeButton === "approved"; 

    // Texto de los tooltips basado en el valor de 'mode'
    const draftTooltipText = mode === "upload" ? "Actualizar como Borrador" : "Borrador";
    const approvedTooltipText = mode === "upload" ? "Actualizar como Aprobado" : "Aprobado";
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
                {activeButton !== "approved" && ( 
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

                {/* Botón de aprobado */}
                {activeButton !== "draft" && ( 
                    <Tooltip title={activeButton === "approved" ? "Volver" : approvedTooltipText} arrow>
                        <button
                            className={`w-16 h-16 rounded-full bg-transparent border-2 ${activeButton === "approved" ? "border-gray-600 hover:bg-gray-600" : "border-green-600 hover:border-green-600 hover:bg-green-600"}  flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 duration-300`}
                            onClick={() => setActiveButton(activeButton === "approved" ? null : "approved")}
                        >
                            {activeButton === "approved" ? (
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
