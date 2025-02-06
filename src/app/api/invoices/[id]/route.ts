import { NextResponse } from "next/server";
import Invoice from 'src/schemas/invoice.schema';
import { connectDB } from 'src/server/dataBase/connectDB'; 
import dayjs from "dayjs";

interface RouteParams {
    id: string; 
}

export async function GET(request: Request, { params }: { params: RouteParams }) {
    await connectDB();
    try {
        const invoiceFound = await Invoice.findById(params.id);
        if (!invoiceFound) {
            return NextResponse.json(
                { message: "Invoice not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(invoiceFound);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'An unknown error occurred' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: { params: RouteParams }) {
    await connectDB();
    try {
        const data = await request.json(); // Obtiene los datos para actualizar
        const updatedInvoice = await Invoice.findByIdAndUpdate(params.id, data, { new: true });
        if (!updatedInvoice) {
            return NextResponse.json(
                { message: "Invoice not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(updatedInvoice);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'An unknown error occurred' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request, { params }: { params: RouteParams }) {
    await connectDB();

    try {
        const { id } = params; // Obtén el ID del invoice de los parámetros

        // Busca el Invoice para verificar su estado actual
        const existingInvoice = await Invoice.findById(id);

        if (!existingInvoice) {
            return NextResponse.json(
                { message: "Invoice not found" },
                { status: 404 }
            );
        }

        // Verifica que el estado actual sea "Pendiente"
        if (existingInvoice.state !== "Pendiente") {
            return NextResponse.json(
                { message: `Cannot update state. Current state is '${existingInvoice.state}', only 'Pendiente' can be updated.` },
                { status: 400 }
            );
        }

        // Actualiza el estado a "Pagada" y la fecha de actualización
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id,
            {
                state: "Pagada",
                // Actualiza solo la fecha de actualización sin modificar el resto del objeto `form`
                $set: { "form.dateUpdate": dayjs().toDate() },
            },
            { new: true } // Devuelve el documento actualizado
        );

        return NextResponse.json(updatedInvoice); // Devuelve el invoice actualizado
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
        const invoiceDeleted = await Invoice.findByIdAndDelete(params.id);
        if (!invoiceDeleted) {
            return NextResponse.json(
                { message: "Invoice not found" },
                { status: 404 }
            );
        }
        // Devuelve la lista actualizada de facturas
        const allInvoices = await Invoice.find();
        return NextResponse.json(allInvoices);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'An unknown error occurred' },
            { status: 500 }
        );
    }
}