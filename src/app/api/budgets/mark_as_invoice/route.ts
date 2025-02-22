import { NextResponse } from "next/server";
import Budget from 'src/models/budget.schema';
import { connectDB } from 'src/server/dataBase/connectDB'; 

interface Params {
    params: { id: string };
}

export async function PATCH(request: Request, { params }: Params) {
    await connectDB();

    try {
        const { id } = params; 

        
        const existingBudget = await Budget.findById(id).populate({
            path: 'report',
            select: 'form.nameWorker form.emailWorker' 
        });

        console.log('muestra :', existingBudget);  // revisar
        if (!existingBudget) {
            return NextResponse.json(
                { message: "Budget not found" },
                { status: 404 }
            );
        }

        // Verifica que el estado actual sea "Borrador"
        if (existingBudget.state !== "Aprobado") {
            return NextResponse.json(
                { message: `Cannot update state. Current state is '${existingBudget.state}', only 'Aprobado' can be updated.` },
                { status: 400 }
            );
        }

        // Actualiza el estado a "Aprobado" y la fecha de actualización
        const updatedBudget = await Budget.findByIdAndUpdate(
            id,
            {
                state: "Facturado",
                $set: { "form.dateUpdate": Date() },
            },
            { new: true } 
        );

        return NextResponse.json(updatedBudget); // Devuelve el budget actualizado
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