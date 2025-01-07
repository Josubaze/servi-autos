import { CreditNoteUpload } from "src/components/CreditNote/CreditNoteUpload";


export default function CreditNoteUpdatePage({ params }: { params: { id: string } }) {
  return <CreditNoteUpload id={params.id}/>
}
