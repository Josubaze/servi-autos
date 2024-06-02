import { NextResponse  } from "next/server";
import {connectDB} from 'src/utils/mongoose'
import Product from '/src/schemas/product.schema' 

export async function GET(request, {  params }){
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

export async function DELETE(request, {  params }){
    try {
        const productDeleted = await Product.findByIdAndDelete(params.id)
        if(!productDeleted) 
            return NextResponse.json(
                {message: "Product not found"},
                { status: 404 }
            )
        const products = await Product.find()    
        return NextResponse.json(products) // envio todos menos el borrado
    } catch (error) {
        return NextResponse.json(
            error.message,
            { status: 400 }
        )
    }
}