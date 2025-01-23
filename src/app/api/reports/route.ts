import { NextResponse } from 'next/server';
import { connectDB } from 'src/utils/mongoose';
import Report from 'src/schemas/report.schema';

// GET: Obtener todos los reportes
export async function GET() {
    await connectDB(); 
    try {
        const reports = await Report.find(); 
        return NextResponse.json(reports);
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

// POST: Crear un nuevo reporte
export async function POST(request: Request) {
    await connectDB(); 
    try {
        const data: Report = await request.json(); 

        const lastReport = await Report.findOne().sort({ n_report: -1 }); 
        const newReportNumber = lastReport ? lastReport.n_report + 1 : 1; // Si no hay reportes, inicia en 1

        const newReport = new Report({
            ...data,
            n_report: newReportNumber,
        });

        const savedReport = await newReport.save();
        return NextResponse.json(savedReport);
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
