import { NextResponse } from "next/server";
import { connectDB } from 'src/server/dataBase/connectDB'; 
import Product from "src/models/product.schema";
import Service from "src/models/service.schema";
import { NextRequest } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  await connectDB();
  try {
    const productFound = await Product.findById(params.id);
    if (!productFound)
      return NextResponse.json({ message: "Product not found" }, { status: 404 });

    return NextResponse.json(productFound);
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
    const data = await request.json();
    const productUpdated = await Product.findByIdAndUpdate(params.id, data, { new: true });

    return NextResponse.json(productUpdated);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const productId = params.id;

  try {
    // Buscar todos los servicios que contienen el producto
    const servicesWithProduct = await Service.find({ 'products.product': productId });

    if (servicesWithProduct.length > 0) {
      // Remover el producto de todos los servicios que lo referencian
      await Service.updateMany(
        { 'products.product': productId },
        { $pull: { products: { product: productId } } }
      );

      // Por cada servicio afectado, recalcular sus valores
      for (const service of servicesWithProduct) {
        const updatedService = await Service.findById(service._id).populate({
          path: 'products.product',
          select: 'name category price'
        });
        if (!updatedService) continue;

        const productsInService = updatedService.products;
        const productIds = productsInService.map((item: any) => item.product._id.toString());
        const products = await Product.find({ _id: { $in: productIds } });

        const productsPrice = productsInService.reduce((total: number, productInService: any) => {
          const prod = products.find(
            (p) => p._id.toString() === productInService.product._id.toString()
          );
          return prod ? total + prod.price * productInService.quantity : total;
        }, 0);

        const serviceQuantity = updatedService.serviceQuantity || 1;
        const totalPrice = serviceQuantity * (productsPrice + updatedService.servicePrice);

        await Service.findByIdAndUpdate(service._id, { productsPrice, totalPrice });
      }
    }

    // Eliminar el producto de la base de datos
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return NextResponse.json(
        { message: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}