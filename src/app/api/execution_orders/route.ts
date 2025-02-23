import { NextResponse } from 'next/server';
import { connectDB } from 'src/server/dataBase/connectDB'; 
import ExecutionOrder from 'src/models/executionOrder.schema';

// GET: Obtener todas las órdenes de ejecución
export async function GET() {
    await connectDB(); 
    try {
        const executionOrders = await ExecutionOrder.find(); 
        return NextResponse.json(executionOrders);
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

// POST: Crear una nueva orden de ejecución
export async function POST(request: Request) {
    await connectDB();
    try {
        const data = await request.json(); 
        // Busca la última orden de ejecución ordenando por 'form.num'
        const lastExecutionOrder = await ExecutionOrder.findOne().sort({ "form.num": -1 });
        const newOrderNumber = lastExecutionOrder ? lastExecutionOrder.form.num + 1 : 1; // Si no hay órdenes, inicia en 1

        // Asigna el nuevo número dentro de form
        const newExecutionOrder = new ExecutionOrder({
            ...data,
            form: {
                ...data.form,
                num: newOrderNumber,
            }
        });

        const savedExecutionOrder = await newExecutionOrder.save();
        return NextResponse.json(savedExecutionOrder);
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

