import { NextResponse } from "next/server";
import Invoice from 'src/schemas/invoice.schema';
import { connectDB } from 'src/utils/mongoose'; 

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