
import { motion } from "framer-motion";
import { useState } from "react";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { IoMdCheckmark } from "react-icons/io";
import { Loading } from "src/components/Common/Loading";
import { LuFileText } from "react-icons/lu";
import { LuFileCheck } from "react-icons/lu";
import { Button, Input, Tooltip } from "@nextui-org/react";
import { IoMdArrowBack } from "react-icons/io";


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

                {/* Mostrar el TextField solo cuando un botón está activo */}
                {showTextField && (
                    <Input
                    label="Descripción"
                    variant="underlined"
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                )}

                {/* Botón de borrador */}
                {activeButton !== "approved" && ( 
                    <Tooltip content={activeButton === "draft" ? "Volver" : draftTooltipText}>
                        <Button
                            color="default"
                            variant="flat"
                            isIconOnly
                            className="w-16 h-16 min-w-16 rounded-full"
                            onClick={() => setActiveButton(activeButton === "draft" ? null : "draft")}
                        >
                            {activeButton === "draft" ? (
                                <IoMdArrowBack className="w-10 h-10" />
                            ) : (
                                <LuFileText className="w-10 h-10" />
                            )}
                        </Button>
                    </Tooltip>
                )}

                {/* Botón de aprobado */}
                {activeButton !== "draft" && (
                    <Tooltip content={activeButton === "approved" ? "Volver" : approvedTooltipText}>
                        <Button
                        color={activeButton === "approved" ? "default" : "success"}
                        variant="flat"
                        isIconOnly
                        className="w-16 h-16 min-w-16 rounded-full"
                        onClick={() => setActiveButton(activeButton === "approved" ? null : "approved")}
                        >
                        {activeButton === "approved" ? (
                            <IoMdArrowBack className="w-10 h-10" />
                        ) : (
                            <LuFileCheck className="w-10 h-10" />
                        )}
                        </Button>
                    </Tooltip>
                )}


                {/* Botón de confirmación */}
                {activeButton && (
                    <Tooltip content="Confirmar">
                        <Button
                            color="primary"
                            variant="flat"
                            isIconOnly
                            className="w-16 h-16 min-w-16 rounded-full"
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
                )}
            </div>
        </div>
    );
};
