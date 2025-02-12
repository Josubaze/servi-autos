import { NextResponse } from "next/server";
import { connectDB } from 'src/server/dataBase/connectDB'; 
import Customer from '/src/models/customer.schema';

export async function GET(request, { params }) {
    await connectDB();
    try {
        const customers = await Customer.find();
        return NextResponse.json(customers);
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
        const newCustomer = new Customer(data);
        const savedCustomer = await newCustomer.save();
        return NextResponse.json(savedCustomer);
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400
        });
    }
}
