import { Tooltip, Button } from "@nextui-org/react";
import { IoDocumentText } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FaWarehouse } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { LuFiles } from "react-icons/lu";

const buttons = [
  { tooltip: "Agregar Informe", icon: IoDocumentText, path: "/create/report"},
  { tooltip: "Mostrar Informes", icon: LuFiles, path: "/control/reports"},
  { tooltip: "Mostrar Órdenes de Ejecución", icon: FaListCheck, path: "/control/execution-orders"},
  { tooltip: "Mostrar Almacén", icon: FaWarehouse, path: "/manage/storehouse" },
];

export const ShortcutButtonsLider = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-4 justify-items-center items-center gap-4 bg-black-nav/40 rounded-xl p-8">
      {buttons.map(({ tooltip, icon: Icon, path }) => (
        <Tooltip key={path} content={tooltip}>
          <Button
            color="success"
            variant="flat"
            isIconOnly
            className="w-16 h-16 min-w-16 rounded-full"
            onClick={() => router.push(path)}
          >
            <Icon className="h-10 w-10" />
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};
