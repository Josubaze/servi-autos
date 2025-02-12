import { NextResponse } from "next/server";
import { connectDB } from 'src/server/dataBase/connectDB'; 
import Service from 'src/models/service.schema';
import Product from 'src/models/product.schema';
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
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
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const data: Service = await request.json();

    if (!data.products || data.products.length === 0) {
      return NextResponse.json(
        { message: "Debe enviar una lista de productos válida." },
        { status: 400 }
      );
    }

    const productIds = data.products.map(item => item.product);
    const products = await Product.find({ '_id': { $in: productIds } });

    const productsPrice = data.products.reduce((total, productInService) => {
      const product = products.find(p => p._id.toString() === productInService.product);
      if (product) {
        return total + (product.price * productInService.quantity);
      }
      return total;
    }, 0);

    const serviceQuantity = data.serviceQuantity || 1;
    const totalPrice = serviceQuantity * (productsPrice + data.servicePrice);

    const newService = new Service({
      ...data,
      productsPrice,
      totalPrice,
    });

    const savedService = await newService.save();

    return NextResponse.json(savedService, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
