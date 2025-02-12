import { NextResponse } from 'next/server';
import { connectDB } from 'src/server/dataBase/connectDB'; 
import Invoice from 'src/models/invoice.schema';

// GET: Obtener todas las facturas
export async function GET() {
    await connectDB(); 
    try {
        const invoices = await Invoice.find(); 
        return NextResponse.json(invoices);
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

// POST: Crear una nueva factura
export async function POST(request: Request) {
    await connectDB(); 
    try {
        const data: Invoice = await request.json(); 
        const lastInvoice = await Invoice.findOne().sort({ n_invoice: -1 }); 
        const newInvoiceNumber = lastInvoice ? lastInvoice.n_invoice + 1 : 1; // Si no hay facturas, inicia en 1

        const newInvoice = new Invoice({
            ...data,
            n_invoice: newInvoiceNumber,
        });

        const savedInvoice = await newInvoice.save();
        return NextResponse.json(savedInvoice);
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