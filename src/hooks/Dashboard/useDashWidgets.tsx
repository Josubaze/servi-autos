import { useMemo } from "react";
import { useGetBudgetsQuery } from "src/redux/services/budgets.Api";
import { useGetInvoicesQuery } from "src/redux/services/invoices.Api";
import { useGetProvidersQuery } from "src/redux/services/providersApi";
import { useGetCustomersQuery } from "src/redux/services/customersApi";
import { useGetProductsQuery } from "src/redux/services/productsApi";
import { useGetServicesQuery } from "src/redux/services/servicesApi";
import { useGetCreditNotesQuery } from "src/redux/services/creditNotes.Api";

export interface IncomeTotals {
  pendingTotal: number;
  paidTotal: number;
}

export const useDashWidgets = () => {
  // Realizamos las consultas
  const { data: budgets = [], isLoading: loadingBudgets } = useGetBudgetsQuery();
  const { data: invoices = [], isLoading: loadingInvoices } = useGetInvoicesQuery();
  const { data: providers = [], isLoading: loadingProviders } = useGetProvidersQuery();
  const { data: customers = [], isLoading: loadingCustomers } = useGetCustomersQuery();
  const { data: products = [], isLoading: loadingProducts } = useGetProductsQuery();
  const { data: services = [], isLoading: loadingServices } = useGetServicesQuery();
  const { data: creditNotes = [] } = useGetCreditNotesQuery();

  // Calculamos los totales de ingresos
  const totals: IncomeTotals = useMemo(() => {
    let calculatedTotals: IncomeTotals = { pendingTotal: 0, paidTotal: 0 };

    // Si no hay facturas, retornamos totales en cero
    if (!invoices || invoices.length === 0) return calculatedTotals;

    // Sumar las facturas
    calculatedTotals = invoices.reduce((acc, invoice) => {
      const { subtotal, form, state } = invoice;
      let amount = 0;

      if (form.currency === "$") {
        amount = subtotal;
      } else if (form.currency === "Bs" && form.exchangeRate > 0) {
        amount = subtotal / form.exchangeRate;
      }

      if (state === "Pendiente") {
        acc.pendingTotal += amount;
      } else if (state === "Pagada") {
        acc.paidTotal += amount;
      }

      return acc;
    }, { pendingTotal: 0, paidTotal: 0 });

    // Restar las notas de crédito correspondientes
    if (creditNotes && creditNotes.length > 0) {
      creditNotes.forEach((creditNote) => {
        // Buscar la factura referenciada
        const matchingInvoice = invoices.find(
          (invoice) => invoice.form.num === creditNote.form.numInvoice
        );
        if (!matchingInvoice) return;

        const invoiceState = matchingInvoice.state;
        let noteAmount = 0;
        if (creditNote.form.currency === "$") {
          noteAmount = creditNote.subtotal;
        } else if (creditNote.form.currency === "Bs" && creditNote.form.exchangeRate > 0) {
          noteAmount = creditNote.subtotal / creditNote.form.exchangeRate;
        }

        if (invoiceState === "Pendiente") {
          calculatedTotals.pendingTotal -= noteAmount;
        } else if (invoiceState === "Pagada") {
          calculatedTotals.paidTotal -= noteAmount;
        }
      });
    }

    return calculatedTotals;
  }, [invoices, creditNotes]);

  return {
    budgets,
    invoices,
    providers,
    customers,
    products,
    services,
    creditNotes,
    loadingBudgets,
    loadingInvoices,
    loadingProviders,
    loadingCustomers,
    loadingProducts,
    loadingServices,
    totals,
  };
};
