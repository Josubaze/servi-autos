import { NextResponse } from 'next/server';
import { connectDB } from 'src/server/dataBase/connectDB'; 
import PurchaseOrder from 'src/schemas/purchaseOrder.schema';

// GET: Obtener todas las órdenes de compra
export async function GET() {
    await connectDB(); 
    try {
        const purchaseOrders = await PurchaseOrder.find(); 
        return NextResponse.json(purchaseOrders);
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

// POST: Crear una nueva orden de compra
export async function POST(request: Request) {
    await connectDB(); 
    try {
        const data = await request.json(); 
        const lastPurchaseOrder = await PurchaseOrder.findOne().sort({ n_order: -1 }); 
        const newOrderNumber = lastPurchaseOrder ? lastPurchaseOrder.n_order + 1 : 1; // Si no hay órdenes, inicia en 1

        const newPurchaseOrder = new PurchaseOrder({
            ...data,
            n_order: newOrderNumber,
        });

        const savedPurchaseOrder = await newPurchaseOrder.save();
        return NextResponse.json(savedPurchaseOrder);
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