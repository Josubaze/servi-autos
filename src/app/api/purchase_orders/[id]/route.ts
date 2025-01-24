import { NextResponse } from "next/server";
import PurchaseOrder from "src/schemas/purchaseOrder.schema";
import { connectDB } from "src/utils/mongoose";

interface RouteParams {
    id: string;
}

export async function GET(request: Request, { params }: { params: RouteParams }) {
    await connectDB();
    try {
        const purchaseOrderFound = await PurchaseOrder.findById(params.id);
        if (!purchaseOrderFound) {
            return NextResponse.json(
                { message: "PurchaseOrder not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(purchaseOrderFound);
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
        const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(params.id, data, { new: true });
        if (!updatedPurchaseOrder) {
            return NextResponse.json(
                { message: "PurchaseOrder not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(updatedPurchaseOrder);
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
        const existingPurchaseOrder = await PurchaseOrder.findById(id);

        if (!existingPurchaseOrder) {
            return NextResponse.json(
                { message: "PurchaseOrder not found" },
                { status: 404 }
            );
        }

        if (existingPurchaseOrder.state !== "En Proceso") {
            return NextResponse.json(
                { message: `Cannot update state. Current state is '${existingPurchaseOrder.state}', only 'En proceso' can be updated.` },
                { status: 400 }
            );
        }

        const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
            id,
            {
                state: "Recibido",
                $set: { "form.dateUpdate": Date() },
            },
            { new: true }
        );

        return NextResponse.json(updatedPurchaseOrder);
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
        const purchaseOrderDeleted = await PurchaseOrder.findByIdAndDelete(params.id);
        if (!purchaseOrderDeleted) {
            return NextResponse.json(
                { message: "PurchaseOrder not found" },
                { status: 404 }
            );
        }
        const allPurchaseOrders = await PurchaseOrder.find();
        return NextResponse.json(allPurchaseOrders);
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
