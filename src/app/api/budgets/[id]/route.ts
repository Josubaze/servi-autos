import { NextResponse } from "next/server";
import Budget from 'src/schemas/budget.schema';
import { connectDB } from 'src/utils/mongoose'; 

interface RouteParams {
    id: string; 
}

export async function GET(request: Request, { params }: { params: RouteParams }) {
    await connectDB();
    try {
        const budgetFound = await Budget.findById(params.id);
        if (!budgetFound) {
            return NextResponse.json(
                { message: "Budget not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(budgetFound);
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
        const updatedBudget = await Budget.findByIdAndUpdate(params.id, data, { new: true });
        if (!updatedBudget) {
            return NextResponse.json(
                { message: "Budget not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(updatedBudget);
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
        const budgetDeleted = await Budget.findByIdAndDelete(params.id);
        if (!budgetDeleted) {
            return NextResponse.json(
                { message: "Budget not found" },
                { status: 404 }
            );
        }
        // Devuelve la lista actualizada de presupuestos
        const allBudgets = await Budget.find();
        return NextResponse.json(allBudgets);
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

