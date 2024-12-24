import { InvoiceUpdate } from "src/components/Invoice/InvoiceUpdate";

export default function UpdateBudgetPage({ params }: { params: { id: string } }) {
  return <InvoiceUpdate id={params.id}/>
}
