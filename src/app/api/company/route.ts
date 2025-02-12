import { NextResponse } from "next/server";
import { connectDB } from 'src/server/dataBase/connectDB'; 
import Company from 'src/models/company.schema';

// Obtener la información de la empresa
export async function GET() {
  await connectDB();
  try {
    const company = await Company.findOne();
    if (!company) {
        return NextResponse.json({ message: 'Empresa no encontrada' }, { status: 404 });
    }
    return NextResponse.json(company);
  } catch (error: unknown) {
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error desconocido' }, { status: 400 });
  }
}

// crear la información de la empresa
export async function POST(request: Request) {
  await connectDB();
  try {
    const data = await request.json();

    let company = await Company.findOne();

    if (company) {
      company.name = data.name;
      company.address = data.address;
      company.email = data.email;
      company.phone = data.phone;

      const updatedCompany = await company.save();
      return NextResponse.json(updatedCompany);
    } else {
      const newCompany = new Company(data);
      const savedCompany = await newCompany.save();
      return NextResponse.json(savedCompany);
    }

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error desconocido' }, { status: 400 });
  }
}


// Actualizar la información de la empresa
export async function PUT(request: Request) {
  await connectDB();
  try {
      const data = await request.json();
      const companyUpdated = await Company.findOneAndUpdate({}, data, { new: true });
      
      if (!companyUpdated) {
          return NextResponse.json(
              { message: "Empresa no encontrada" },
              { status: 404 }
          );
      }
      return NextResponse.json(companyUpdated);
  } catch (error: unknown) {
      if (error instanceof Error) {
          return NextResponse.json(
              { error: error.message },
              { status: 400 }
          );
      }
      return NextResponse.json(
          { error: 'Error desconocido' },
          { status: 400 }
      );
  }
}

// Eliminar la empresa
export async function DELETE(request: Request) {
  await connectDB();
  try {
      const companyDeleted = await Company.findOneAndDelete();
      
      if (!companyDeleted) {
          return NextResponse.json(
              { message: "Empresa no encontrada" },
              { status: 404 }
          );
      }

      return NextResponse.json({ message: "Empresa borrada exitosamente!" });
  } catch (error: unknown) {
      if (error instanceof Error) {
          return NextResponse.json(
              { error: error.message },
              { status: 400 }
          );
      }
      return NextResponse.json(
          { error: 'Unknown error' },
          { status: 400 }
      );
  }
}