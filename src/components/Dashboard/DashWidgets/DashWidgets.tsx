import React from "react";
import dynamic from "next/dynamic";
import { NumericFormat } from "react-number-format";
import { Spinner } from "@nextui-org/react";
import { useDashWidgets } from "src/hooks/Dashboard/useDashWidgets"; // Ajusta la ruta según tu estructura

// Importaciones dinámicas de los Lottie
export const LottieMoney = dynamic(
  () => import("src/components/LottieIcon/LottieMoney"),
  { ssr: false }
);
export const LottieBudget = dynamic(
  () => import("src/components/LottieIcon/LottieBudget"),
  { ssr: false }
);
export const LottieInvoice = dynamic(
  () => import("src/components/LottieIcon/LottieInvoice"),
  { ssr: false }
);
export const LottiePersons = dynamic(
  () => import("src/components/LottieIcon/LottiePersons"),
  { ssr: false }
);
export const LottieProduct = dynamic(
  () => import("src/components/LottieIcon/LottieProduct"),
  { ssr: false }
);
export const LottieSupplier = dynamic(
  () => import("src/components/LottieIcon/LottieSupplier"),
  { ssr: false }
);
export const LottieCreditNote = dynamic(
  () => import("src/components/LottieIcon/LottieCreditNote"),
  { ssr: false }
);
export const LottieTools = dynamic(
  () => import("src/components/LottieIcon/LottieTools"),
  { ssr: false }
);
export const LottiePending = dynamic(
  () => import("src/components/LottieIcon/LottieMoneyPending"),
  { ssr: false }
);

export const DashWidgets = () => {
  const {
    budgets,
    invoices,
    providers,
    customers,
    products,
    services,
    loadingBudgets,
    loadingInvoices,
    loadingProviders,
    loadingCustomers,
    loadingProducts,
    loadingServices,
    totals,
  } = useDashWidgets();

  const { pendingTotal, paidTotal } = totals;

  return (
    <div className="flex flex-wrap">
      {/* Widget de Ingresos Recibidos */}
      <div className="w-full mb-3 md:w-1/2">
        <div className="p-4 bg-black-nav/50 rounded-xl md:mr-4 hover:shadow-sm">
          <div className="font-title">Ingresos Recibidos</div>
          <div className="flex justify-between items-center">
            <div className="h-30 aspect-w-1 aspect-h-1">
              <LottieMoney loop className="h-20" />
            </div>
            <div className="text-2xl mr-8">
              {loadingInvoices ? (
                <Spinner color="default" size="sm" />
              ) : (
                <NumericFormat
                  value={paidTotal}
                  decimalScale={2}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  fixedDecimalScale
                  displayType="text"
                  prefix="$"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Widget de Ingresos Pendientes */}
      <div className="w-full mb-3 md:w-1/2">
        <div className="p-4 bg-black-nav/50 rounded-xl hover:shadow-sm">
          <div className="font-title">Ingresos Pendientes</div>
          <div className="flex justify-between items-center">
            <div className="h-30 aspect-w-1 aspect-h-1">
              <LottiePending loop className="h-20" />
            </div>
            <div className="text-2xl mr-8">
              {loadingInvoices ? (
                <Spinner color="default" size="sm" />
              ) : (
                <NumericFormat
                  value={pendingTotal}
                  decimalScale={2}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  fixedDecimalScale
                  displayType="text"
                  prefix="$"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Widget Nº Productos */}
      <div className="w-full mb-3 md:w-1/2">
        <div className="p-4 bg-black-nav/50 rounded-xl md:mr-4 hover:shadow-sm">
          <div className="font-title">Nº Productos</div>
          <div className="flex justify-between items-center">
            <div className="h-30 aspect-w-1 aspect-h-1">
              <LottieTools loop className="h-20" />
            </div>
            <div className="text-2xl mr-8">
              {loadingProducts ? (
                <Spinner color="default" size="sm" />
              ) : (
                <NumericFormat
                  value={products?.length}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  fixedDecimalScale
                  displayType="text"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Widget Nº Servicios */}
      <div className="w-full mb-3 md:w-1/2">
        <div className="p-4 bg-black-nav/50 rounded-xl hover:shadow-sm">
          <div className="font-title">Nº Servicios</div>
          <div className="flex justify-between items-center">
            <div className="h-30 aspect-w-1 aspect-h-1">
              <LottieProduct loop className="h-20" />
            </div>
            <div className="text-2xl mr-8">
              {loadingServices ? (
                <Spinner color="default" size="sm" />
              ) : (
                <NumericFormat
                  value={services?.length}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  fixedDecimalScale
                  displayType="text"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Widget Nº Presupuestos */}
      <div className="w-full mb-3 md:w-1/2">
        <div className="p-4 bg-black-nav/50 rounded-xl md:mr-4 hover:shadow-sm">
          <div className="font-title">Nº Presupuestos</div>
          <div className="flex justify-between items-center">
            <div className="h-30 aspect-w-1 aspect-h-1">
              <LottieBudget loop className="h-20" />
            </div>
            <div className="text-2xl mr-8">
              {loadingBudgets ? (
                <Spinner color="default" size="sm" />
              ) : (
                <NumericFormat
                  value={budgets?.length}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  fixedDecimalScale
                  displayType="text"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Widget Nº Facturas */}
      <div className="w-full mb-3 md:w-1/2">
        <div className="p-4 bg-black-nav/50 rounded-xl hover:shadow-sm">
          <div className="font-title">Nº Facturas</div>
          <div className="flex justify-between items-center">
            <div className="h-30 aspect-w-1 aspect-h-1">
              <LottieInvoice loop className="h-20" />
            </div>
            <div className="text-2xl mr-8">
              {loadingInvoices ? (
                <Spinner color="default" size="sm" />
              ) : (
                <NumericFormat
                  value={invoices?.length}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  fixedDecimalScale
                  displayType="text"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Widget Nº Clientes */}
      <div className="w-full mb-3 md:w-1/2">
        <div className="p-4 bg-black-nav/50 rounded-xl md:mr-4 hover:shadow-sm">
          <div className="font-title">Nº Clientes</div>
          <div className="flex justify-between items-center">
            <div className="h-30 aspect-w-1 aspect-h-1">
              <LottiePersons loop className="h-20" />
            </div>
            <div className="text-2xl mr-8">
              {loadingCustomers ? (
                <Spinner color="default" size="sm" />
              ) : (
                <NumericFormat
                  value={customers?.length}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  fixedDecimalScale
                  displayType="text"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Widget Nº Proveedores */}
      <div className="w-full mb-3 md:w-1/2">
        <div className="p-4 bg-black-nav/50 rounded-xl hover:shadow-sm">
          <div className="font-title">Nº Proveedores</div>
          <div className="flex justify-between items-center">
            <div className="h-30 aspect-w-1 aspect-h-1">
              <LottieSupplier loop className="h-20" />
            </div>
            <div className="text-2xl mr-8">
              {loadingProviders ? (
                <Spinner color="default" size="sm" />
              ) : (
                <NumericFormat
                  value={providers?.length}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  fixedDecimalScale
                  displayType="text"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
