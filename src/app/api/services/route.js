import { NextResponse } from "next/server";
import { connectDB } from 'src/utils/mongoose';
import Service from '/src/schemas/service.schema';
import Product from 'src/schemas/product.schema';

export async function GET(request, { params }) {
    await connectDB();
    try {
        const services = await Service.find()
            .populate({
                path: 'products.product',
                select: 'name category price' // Los campos específicos que deseas poblar
            });
        if (!services) {
            return NextResponse.json(
                { message: "Services not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json(
            error.message,
            { status: 400 }
        );
    }
}

export async function POST(request) {
    await connectDB();
    try {
        const data = await request.json();
        const productsInService = data.products; 

        // Obtener los productos desde la base de datos usando sus ObjectId
        const productIds = productsInService.map(item => item.product);
        const products = await Product.find({ '_id': { $in: productIds } });

        // Calcular el precio total de los productos teniendo en cuenta la cantidad
        const productsPrice = productsInService.reduce((total, productInService) => {
            const product = products.find(p => p._id.toString() === productInService.product);
            if (product) {
                return total + (product.price * productInService.quantity);
            }
            return total;
        }, 0);

        const serviceQuantity = data.serviceQuantity || 1;
        const totalPrice = serviceQuantity * (productsPrice + data.servicePrice);

        // Crear un nuevo servicio con los precios calculados
        const newService = new Service({
            ...data,
            productsPrice: productsPrice,  
            totalPrice: totalPrice
        });

        const savedService = await newService.save();

        return NextResponse.json(savedService);
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400 
        });
    }
}
