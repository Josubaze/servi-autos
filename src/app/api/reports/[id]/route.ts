import { NextResponse } from "next/server";
import Budget from "src/models/budget.schema";
import Report from "src/models/report.schema";
import { connectDB } from 'src/server/dataBase/connectDB'; 

interface RouteParams {
  id: string;
}

export async function GET(request: Request, { params }: { params: RouteParams }) {
  await connectDB();
  try {
    const reportFound = await Report.findById(params.id);
    if (!reportFound) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(reportFound);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: RouteParams }) {
  await connectDB();
  try {
    const data = await request.json();
    const updatedReport = await Report.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedReport) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedReport);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: RouteParams }) {
  await connectDB();

  try {
    const { id } = params;

    const existingReport = await Report.findById(id);

    if (!existingReport) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      );
    }

    // Verifica que el estado actual sea "Pendiente" (esto es un ejemplo, adapta según tus necesidades)
    if (existingReport.state !== "Sin Presupuestar") {
      return NextResponse.json(
        { message: `Cannot update state. Current state is '${existingReport.state}', only 'Sin Presupuestar' can be updated.` },
        { status: 400 }
      );
    }

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      {
        state: "Presupuestado", 
        $set: { "form.dateUpdate": Date() },
      },
      { new: true }
    );

    return NextResponse.json(updatedReport);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: RouteParams }) {
  await connectDB();
  try {
    const reportId = params.id;

    // Eliminar la referencia en Budget y asignar null
    await Budget.updateMany(
      { report: reportId },
      { $set: { report: null } } // Se reemplaza la referencia con null
    );

    // Eliminar el Report de la base de datos
    const reportDeleted = await Report.findByIdAndDelete(reportId);
    if (!reportDeleted) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
