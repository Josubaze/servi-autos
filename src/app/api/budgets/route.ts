import { NextResponse } from 'next/server';
import { connectDB } from 'src/utils/mongoose';
import Budget from 'src/schemas/budget.schema';

// GET: Obtener todos los presupuestos
export async function GET() {
    await connectDB(); 
    try {
        const budgets = await Budget.find(); 
        return NextResponse.json(budgets);
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

// POST: Crear un nuevo presupuesto
export async function POST(request: Request) {
    await connectDB(); 
    try {
        const data: Budget = await request.json(); 
        const lastBudget = await Budget.findOne().sort({ n_budget: -1 }); 
        const newBudgetNumber = lastBudget ? lastBudget.n_budget + 1 : 1; // Si no hay presupuestos, inicia en 1

        const newBudget = new Budget({
            ...data,
            n_budget: newBudgetNumber,
        });

        const savedBudget = await newBudget.save();
        return NextResponse.json(savedBudget);
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
