import { NextResponse } from "next/server";
import { connectDB } from 'src/server/dataBase/connectDB'; 
import Product from "src/models/product.schema";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();
  try {
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

interface ProductData {
  name: string;
  price: number;
  quantity: number;
  description?: string;
  vehicleType?: string;
  category?: string;
}

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const data: ProductData | ProductData[] = await request.json();

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return NextResponse.json(
          { message: "Debe enviar una lista de productos válida." },
          { status: 400 }
        );
      }

      const savedProducts = [];

      for (const product of data) {
        const { name, price, quantity } = product;

        const existingProduct = await Product.findOne({ name, price });

        if (existingProduct) {
          existingProduct.quantity += quantity;
          await existingProduct.save();
          savedProducts.push(existingProduct);
        } else {
          const newProduct = new Product({
            name,
            description: product.description || "Por definir",
            vehicleType: product.vehicleType || "Por definir",
            category: product.category || "Por definir",
            quantity,
            price,
          });

          const savedProduct = await newProduct.save();
          savedProducts.push(savedProduct);
        }
      }

      return NextResponse.json(savedProducts, { status: 201 });
    } else {
      const newProduct = new Product(data);
      const savedProduct = await newProduct.save();
      return NextResponse.json(savedProduct, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
