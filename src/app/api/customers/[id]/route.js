import { NextResponse } from "next/server";
import Customer from '/src/schemas/customer.schema';
import {connectDB} from 'src/utils/mongoose'
export async function GET(request, { params }) {
    await connectDB();
    try {
        const customerFound = await Customer.findById(params.id);
        if (!customerFound) {
            return NextResponse.json(
                { message: "Customer not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(customerFound);
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
        const customerUpdated = await Customer.findByIdAndUpdate(params.id, data, { new: true });
        return NextResponse.json(customerUpdated);
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
        const customerDeleted = await Customer.findByIdAndDelete(params.id);
        if (!customerDeleted) {
            return NextResponse.json(
                { message: "Customer not found" },
                { status: 404 }
            );
        }
        const customers = await Customer.find();
        return NextResponse.json(customers); // envía todos menos el borrado
    } catch (error) {
        return NextResponse.json(
            error.message,
            { status: 400 }
        );
    }
}
