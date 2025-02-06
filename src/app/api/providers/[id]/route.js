import { NextResponse } from "next/server";
import Provider from '/src/schemas/provider.schema';
import { connectDB } from 'src/server/dataBase/connectDB'; 
export async function GET(request, { params }) {
    await connectDB();
    try {
        const providerFound = await Provider.findById(params.id);
        if (!providerFound) {
            return NextResponse.json(
                { message: "Provider not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(providerFound);
    } catch (error) {
        return NextResponse.json(
            error.message,
            { status: 400 }
        );
    }
}

export async function PUT(request, { params }) {
    await connectDB();
    try {
        const data = await request.json();
        const providerUpdated = await Provider.findByIdAndUpdate(params.id, data, { new: true });
        return NextResponse.json(providerUpdated);
    } catch (error) {
        return NextResponse.json(
            error.message,
            { status: 400 }
        );
    }
}

export async function DELETE(request, { params }) {
    await connectDB();
    try {
        const providerDeleted = await Provider.findByIdAndDelete(params.id);
        if (!providerDeleted) {
            return NextResponse.json(
                { message: "Provider not found" },
                { status: 404 }
            );
        }
        const providers = await Provider.find();
        return NextResponse.json(providers); // envía todos menos el borrado
    } catch (error) {
        return NextResponse.json(
            error.message,
            { status: 400 }
        );
    }
}
