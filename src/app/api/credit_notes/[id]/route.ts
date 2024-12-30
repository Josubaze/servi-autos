import { NextResponse } from "next/server";
import CreditNote from 'src/schemas/creditNote.schema';
import { connectDB } from 'src/utils/mongoose'; 

interface RouteParams {
    id: string; 
}

export async function GET(request: Request, { params }: { params: RouteParams }) {
    await connectDB();
    try {
        const creditNoteFound = await CreditNote.findById(params.id);
        if (!creditNoteFound) {
            return NextResponse.json(
                { message: "Nota de credito no encontrada!" },
                { status: 404 }
            );
        }
        return NextResponse.json(creditNoteFound);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'ha ocurrido un error desconocido' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: { params: RouteParams }) {
    await connectDB();
    try {
        const data = await request.json(); // Obtiene los datos para actualizar
        const updatedCreditNote = await CreditNote.findByIdAndUpdate(params.id, data, { new: true });
        if (!updatedCreditNote) {
            return NextResponse.json(
                { message: "Nota de credito no encontrada!" },
                { status: 404 }
            );
        }
        return NextResponse.json(updatedCreditNote);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'ha ocurrido un error desconocido' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: RouteParams }) {
    await connectDB();
    try {
      const deletedCreditNote = await CreditNote.findByIdAndDelete(params.id);
      if (!deletedCreditNote) {
        return NextResponse.json(
          { message: "Nota de crédito no encontrada!" },
          { status: 404 }
        );
      }
      const allInvoices = await CreditNote.find();
      return NextResponse.json(allInvoices);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Ha ocurrido un error desconocido' },
        { status: 500 }
      );
    }
  }
  