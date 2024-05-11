import { NextResponse  } from "next/server";
import {connectDB} from 'src/utils/mongoose'
import Product from '/src/schemas/product.schema' 
connectDB()
export async function GET(request, {  params }){
    try {
        const products = await Product.find()
        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400 
        })
    }
    
}

export async function POST(request){
    try {
        const data = await request.json()
        const newProduct = new Product(data)
        const savedProduct = await newProduct.save()
        return NextResponse.json(savedProduct)
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400 
        })
    }
}

