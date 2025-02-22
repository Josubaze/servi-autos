import { NextResponse } from "next/server";
import Budget from 'src/models/budget.schema';
import { connectDB } from 'src/server/dataBase/connectDB'; 

interface Params {
    params: { id: string };
  }

export async function GET(request: Request, { params }: Params) {
    await connectDB();
    try {
        const budgetFound = await Budget.findById(params.id).populate({
            path: 'report',
            select: 'form.nameWorker form.emailWorker'
        });

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

export async function PUT(request: Request, { params }: Params) {
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

export async function PATCH(request: Request, { params }: Params) {
    await connectDB();

    try {
        const { id } = params; 

        const existingBudget = await Budget.findById(id);

        if (!existingBudget) {
            return NextResponse.json(
                { message: "Budget not found" },
                { status: 404 }
            );
        }

        // No permitir actualización si el estado es "Borrador"
        if (existingBudget.state === "Borrador") {
            return NextResponse.json(
                { message: "Cannot update state. 'Borrador' is not allowed to be updated." },
                { status: 400 }
            );
        }

        let newState;
        if (existingBudget.state === "Aprobado") {
            newState = "Facturado";
        } else if (existingBudget.state === "Facturado") {
            return NextResponse.json(
                { message: "Cannot update state. 'Facturado' is a final state." },
                { status: 400 }
            );
        } else {
            return NextResponse.json(
                { message: `Invalid state: '${existingBudget.state}'` },
                { status: 400 }
            );
        }

        const updatedBudget = await Budget.findByIdAndUpdate(
            id,
            {
                state: newState,
                $set: { "form.dateUpdate": new Date() },
            },
            { new: true } 
        );

        return NextResponse.json(updatedBudget);
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



export async function DELETE(request: Request, { params }: Params) {
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

