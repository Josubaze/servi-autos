import { BudgetUpdate } from "src/components/Budget/BudgetUpdate";


export default function UpdateBudgetPage({ params }: { params: { id: string } }) {
  return <BudgetUpdate id={params.id}/>
}
