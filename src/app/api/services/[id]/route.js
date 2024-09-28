import { NextResponse } from "next/server";
import { connectDB } from 'src/utils/mongoose';
import Service from '/src/schemas/service.schema'; // Importa el esquema de servicio
import Product from 'src/schemas/product.schema';

export async function GET(request, { params }) {
    await connectDB();
    try {
        const serviceFound = await Service.findById(params.id).populate({
            path: 'products.product',
            select: 'name category price' 
        });
        if (!serviceFound) {
            return NextResponse.json(
                { message: "Service not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(serviceFound);
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
        const productsInService = data.products;
        
        const productIds = productsInService.map(item => item.product);
        const products = await Product.find({ '_id': { $in: productIds } });

        const productsPrice = productsInService.reduce((total, productInService) => {
            const product = products.find(p => p._id.toString() === productInService.product);
            if (product) {
                return total + (product.price * productInService.quantity);
            }
            return total;
        }, 0);

        const serviceQuantity = data.serviceQuantity || 1;
        const totalPrice = serviceQuantity * (productsPrice + data.servicePrice);

        // Actualizar el servicio con los precios calculados
        const serviceUpdated = await Service.findByIdAndUpdate(
            params.id,
            {
                ...data,
                productsPrice: productsPrice,
                totalPrice: totalPrice
            },
            { new: true }
        ).populate({
            path: 'products.product',
            select: 'name category price'
        });

        if (!serviceUpdated) {
            return NextResponse.json(
                { message: "Service not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(serviceUpdated);
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
        const serviceDeleted = await Service.findByIdAndDelete(params.id);
        if (!serviceDeleted) {
            return NextResponse.json(
                { message: "Service not found" },
                { status: 404 }
            );
        }
        const services = await Service.find().populate('products'); // Retornar todos los servicios restantes
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json(
            error.message,
            { status: 400 }
        );
    }
}
