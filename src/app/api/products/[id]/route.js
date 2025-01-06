import { NextResponse  } from "next/server";
import {connectDB} from 'src/utils/mongoose'
import Product from '/src/schemas/product.schema' 
export async function GET(request, {  params }){
    await connectDB();
    try {
        const productFound = await Product.findById( params.id )
        if(!productFound) 
            return NextResponse.json(
                {message: "Product not found"},
                { status: 404 }
            )
        return NextResponse.json(productFound)
    } catch (error) {
        return NextResponse.json(
            error.message,
            { status: 400 }
        )
    }
    
}
export async function PUT(request, {  params }){
    await connectDB();
    try {
        const data = await request.json()
        const productUpdated = await Product.findByIdAndUpdate(params.id, data, { new: true });
        return NextResponse.json(productUpdated)
    } catch (error) {
        return NextResponse.json(
            error.message,
            { status: 400 }
        )
    }
}

export async function PATCH(request, { params }) {
    await connectDB();
    try {
        const { quantity, operation } = await request.json(); // Recibir cantidad y operación (sumar/restar)

        // Buscar el producto por su ID
        const product = await Product.findById(params.id);
        if (!product) {
            return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
        }

        // Validar y realizar la operación
        if (operation === "subtract") {
            // Validar que haya suficiente cantidad para deducir
            if (product.quantity < quantity) {
                return NextResponse.json(
                    { message: "Cantidad insuficiente en almacén" },
                    { status: 400 }
                );
            }
            product.quantity -= quantity; // Restar cantidad
        } else if (operation === "add") {
            product.quantity += quantity; // Sumar cantidad
        } else {
            return NextResponse.json(
                { message: "Operación inválida. Use 'add' o 'subtract'" },
                { status: 400 }
            );
        }

        // Guardar el producto actualizado
        await product.save();

        return NextResponse.json({
            message: "Cantidad actualizada exitosamente",
            product,
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Ocurrió un error desconocido" },
            { status: 500 }
        );
    }
}


export async function DELETE(request, {  params }){
    await connectDB();
    try {
        const productDeleted = await Product.findByIdAndDelete(params.id)
        if(!productDeleted) 
            return NextResponse.json(
                {message: "Product not found"},
                { status: 404 }
            )
        const products = await Product.find()    
        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json(
            error.message,
            { status: 400 }
        )
    }
}