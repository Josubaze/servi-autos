import { PurchaseOrderUpload } from "src/components/PurchaseOrder/PurchaseOrderUpload";

export default function purchaseOrderUpdatePage({ params }: { params: { id: string } }) {
  return <PurchaseOrderUpload id={params.id}/>
}
