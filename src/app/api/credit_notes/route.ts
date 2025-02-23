import { NextResponse } from 'next/server';
import { connectDB } from 'src/server/dataBase/connectDB'; 
import CreditNote from 'src/models/creditNote.schema';

// GET: Obtener todas las notas de crédito
export async function GET() {
    await connectDB();
    try {
        const creditNotes = await CreditNote.find();
        return NextResponse.json(creditNotes);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Ha ocurrido un error desconocido' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    await connectDB();
    try {
        const data = await request.json();
        const lastCreditNote = await CreditNote.findOne().sort({ "form.num": -1 });
        const newCreditNoteNumber = lastCreditNote ? lastCreditNote.form.num + 1 : 1;

        const newCreditNote = new CreditNote({
            ...data,
            form: {
                ...data.form,
                num: newCreditNoteNumber,
            }
        });

        const savedCreditNote = await newCreditNote.save();
        return NextResponse.json(savedCreditNote);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Ha ocurrido un error desconocido' },
            { status: 500 }
        );
    }
}
