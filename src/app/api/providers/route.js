import { NextResponse } from "next/server";
import { connectDB } from 'src/utils/mongoose';
import Provider from '/src/schemas/provider.schema';

export async function GET(request, { params }) {
    await connectDB(); 
    try {
        const providers = await Provider.find();
        return NextResponse.json(providers);
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400
        });
    }
}

export async function POST(request) {
    await connectDB(); 
    try {
        const data = await request.json();
        const newProvider = new Provider(data);
        const savedProvider = await newProvider.save();
        return NextResponse.json(savedProvider);
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400
        });
    }
}
