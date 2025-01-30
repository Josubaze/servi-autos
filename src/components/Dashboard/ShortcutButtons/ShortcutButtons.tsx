import { Tooltip, Button } from "@nextui-org/react";
import { FaFilePowerpoint } from "react-icons/fa6";
import { FaFileInvoice } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { useRouter } from "next/navigation";

const buttons = [
  { tooltip: "Agregar Presupuesto", icon: FaFilePowerpoint, path: "/create/budget" },
  { tooltip: "Agregar Factura", icon: FaFileInvoice, path: "/create/invoice" },
  { tooltip: "Agregar Informe", icon: IoDocumentText, path: "/create/report" },
  { tooltip: "Agregar Orden de Compra", icon: BiSolidPurchaseTag, path: "/create/purchase-order" },
];

export const ShortcutButtons = () => {
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
