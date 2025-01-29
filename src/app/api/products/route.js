import { NextResponse  } from "next/server";
import {connectDB} from 'src/utils/mongoose'
import Product from '/src/schemas/product.schema' 
export async function GET(request, {  params }){
    await connectDB();
    try {
        const products = await Product.find()
        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400 
        })
    }
    
}

export async function POST(request) {
    await connectDB();
    try {
        const data = await request.json();

        if (Array.isArray(data)) {
            // Si es una lista de productos
            if (data.length === 0) {
                return NextResponse.json({ message: "Debe enviar una lista de productos válida." }, { status: 400 });
            }

            const savedProducts = [];

            for (const product of data) {
                const { name, price, quantity } = product;

                // Buscar si ya existe un producto con el mismo nombre y precio
                const existingProduct = await Product.findOne({ name, price });

                if (existingProduct) {
                    // Si el producto existe, solo actualizamos la cantidad
                    existingProduct.quantity += quantity;
                    await existingProduct.save();
                    savedProducts.push(existingProduct);
                } else {
                    // Si no existe, creamos uno nuevo con valores por defecto
                    const newProduct = new Product({
                        name,
                        description: product.description || "Por definir",
                        vehicleType: product.vehicleType || "Por definir",
                        category: product.category || "Por definir",
                        quantity,
                        price
                    });

                    const savedProduct = await newProduct.save();
                    savedProducts.push(savedProduct);
                }
            }

            return NextResponse.json(savedProducts, { status: 201 });
        } else {
            // Si es un solo producto
            const newProduct = new Product(data);
            const savedProduct = await newProduct.save();
            return NextResponse.json(savedProduct, { status: 201 });
        }

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}
