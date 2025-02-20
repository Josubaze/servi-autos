import { NextResponse } from "next/server";
import { connectDB } from 'src/server/dataBase/connectDB'; 
import Product from "src/models/product.schema";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
    await connectDB();
    try {
      const productsToCheck: { id: string; quantity: number }[] = await request.json();
  
      const availabilityResults = await Promise.all(
        productsToCheck.map(async (item) => {
          const product = await Product.findById(item.id);
          if (!product) {
            return { name: "Producto desconocido", available: false, message: "Producto no encontrado" };
          }
          if (product.quantity >= item.quantity) {
            return { name: product.name, available: true, currentQuantity: product.quantity };
          } else {
            return { name: product.name, available: false, currentQuantity: product.quantity };
          }
        })
      );
  
      return NextResponse.json({ results: availabilityResults });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Ocurrió un error desconocido" },
        { status: 500 }
      );
    }
}
  
