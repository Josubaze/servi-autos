import { NextResponse } from "next/server";
import { connectDB } from 'src/server/dataBase/connectDB'; 
import Service from 'src/models/service.schema'; // Importa el esquema de servicio
import Product from 'src/models/product.schema';
import { NextRequest } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
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
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: Params) {
    await connectDB();
    try {
        const data: Service = await request.json();
        const productsInService = data.products;

        const productIds = productsInService.map(item => (item.product));
        const products = await Product.find({ '_id': { $in: productIds } });

        const productsPrice = productsInService.reduce((total, productInService) => {
            const product = products.find(p => p._id.toString() === productInService.product);
            return product ? total + (product.price * productInService.quantity) : total;
        }, 0);

        const serviceQuantity = data.serviceQuantity || 1;
        const totalPrice = serviceQuantity * (productsPrice + data.servicePrice);

        // Actualizar el servicio con los precios calculados
        const serviceUpdated = await Service.findByIdAndUpdate(
            params.id,
            {
                ...data,
                productsPrice,
                totalPrice
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
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: Params) {
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
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}
