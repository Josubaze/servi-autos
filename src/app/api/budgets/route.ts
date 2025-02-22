import { NextResponse } from 'next/server';
import { connectDB } from 'src/server/dataBase/connectDB'; 
import Budget from 'src/models/budget.schema';

// GET: Obtener todos los presupuestos
export async function GET() {
  await connectDB();
  try {
    const budgets = await Budget.find().populate({
      path: 'report',
      select: 'form.nameWorker form.emailWorker',
    });

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
        const data: BudgetCreate = await request.json(); 
        console.log(data);
        const lastBudget = await Budget.findOne().sort({ num: -1 }); 
        const newBudgetNumber = lastBudget ? lastBudget.num + 1 : 1; // Si no hay presupuestos, inicia en 1

        const newBudget = new Budget({
            ...data,
            num: newBudgetNumber,
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
