import { NextResponse } from "next/server";
import { connectDB } from 'src/server/dataBase/connectDB'; 
import Product from "src/models/product.schema";
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

export async function PATCH(request: NextRequest, { params }: Params) {
  await connectDB();
  try {
    const { quantity, operation }: { quantity: number; operation: "add" | "subtract" } = 
      await request.json();

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    if (operation === "subtract") {
      if (product.quantity < quantity) {
        return NextResponse.json(
          { message: "Cantidad insuficiente en almacén" },
          { status: 400 }
        );
      }
      product.quantity -= quantity;
    } else if (operation === "add") {
      product.quantity += quantity;
    } else {
      return NextResponse.json(
        { message: "Operación inválida. Use 'add' o 'subtract'" },
        { status: 400 }
      );
    }

    await product.save();

    return NextResponse.json({
      message: "Cantidad actualizada exitosamente",
      product,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Ocurrió un error desconocido" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  await connectDB();
  try {
    const productDeleted = await Product.findByIdAndDelete(params.id);
    if (!productDeleted) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
