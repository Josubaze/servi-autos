import { NextResponse } from "next/server";
import ExecutionOrder from "src/schemas/executionOrder.schema";
import { connectDB } from "src/utils/mongoose";
import dayjs from "dayjs";

interface RouteParams {
    id: string;
}

export async function GET(request: Request, { params }: { params: RouteParams }) {
    await connectDB();
    try {
        const executionOrderFound = await ExecutionOrder.findById(params.id);
        if (!executionOrderFound) {
            return NextResponse.json(
                { message: "ExecutionOrder not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(executionOrderFound);
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

export async function PUT(request: Request, { params }: { params: RouteParams }) {
    await connectDB();
    try {
        const data = await request.json();
        const updatedExecutionOrder = await ExecutionOrder.findByIdAndUpdate(params.id, data, { new: true });
        if (!updatedExecutionOrder) {
            return NextResponse.json(
                { message: "ExecutionOrder not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(updatedExecutionOrder);
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

export async function PATCH(request: Request, { params }: { params: RouteParams }) {
    await connectDB();

    try {
        const { id } = params;
        const existingExecutionOrder = await ExecutionOrder.findById(id);

        if (!existingExecutionOrder) {
            return NextResponse.json(
                { message: "ExecutionOrder not found" },
                { status: 404 }
            );
        }

        if (existingExecutionOrder.state !== "En proceso") {
            return NextResponse.json(
                { message: `Cannot update state. Current state is '${existingExecutionOrder.state}', only 'En proceso' can be updated.` },
                { status: 400 }
            );
        }

        const updatedExecutionOrder = await ExecutionOrder.findByIdAndUpdate(
            id,
            {
                state: "Finalizado",
                $set: { "form.dateUpdate": dayjs().toDate() },
            },
            { new: true }
        );

        return NextResponse.json(updatedExecutionOrder);
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

export async function DELETE(request: Request, { params }: { params: RouteParams }) {
    await connectDB();
    try {
        const executionOrderDeleted = await ExecutionOrder.findByIdAndDelete(params.id);
        if (!executionOrderDeleted) {
            return NextResponse.json(
                { message: "ExecutionOrder not found" },
                { status: 404 }
            );
        }
        const allExecutionOrders = await ExecutionOrder.find();
        return NextResponse.json(allExecutionOrders);
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
