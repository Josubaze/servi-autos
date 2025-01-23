import { ReportUpdate } from "src/components/Report/ReportUpdate";

export default function UpdateReportPage({ params }: { params: { id: string } }) {
  return <ReportUpdate id={params.id}/>
}
