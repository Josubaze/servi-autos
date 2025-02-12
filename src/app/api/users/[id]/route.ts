import { NextResponse } from "next/server";
import User from 'src/models/user.schema';
import { connectDB } from 'src/server/dataBase/connectDB'; 
import bcrypt from 'bcrypt';

interface RouteParams {
  id: string;
}
export async function GET(request: Request, { params }: { params: RouteParams }) {
  await connectDB();
  try {
    const userFound = await User.findById(params.id);
    if (!userFound) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    // Eliminar información sensible antes de retornar los datos
    let user = userFound.toObject();
    delete user.password;
    delete user.secret_question;
    delete user.secret_answer;

    return NextResponse.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request, { params }: { params: RouteParams }) {
  await connectDB();
  try {
    const data = await request.json(); // Obtiene los datos para actualizar

    // Si se está actualizando la contraseña, se debe encriptar
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if (data.secret_question) {
      data.secret_question = await bcrypt.hash(data.secret_question, 10);
    }

    if (data.secret_answer) {
      data.secret_answer = await bcrypt.hash(data.secret_answer, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Eliminar información sensible antes de retornar los datos
    let user = updatedUser.toObject();
    delete user.password;
    delete user.secret_question;
    delete user.secret_answer;

    return NextResponse.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: RouteParams }) {
    await connectDB();
    try {
      const userDeleted = await User.findByIdAndDelete(params.id);
      if (!userDeleted) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
  
      // Devuelve la lista actualizada de usuarios (opcional)
      const allUsers = await User.find();
      const usersWithoutSensitiveInfo = allUsers.map(user => {
        let userObj = user.toObject();
        delete userObj.password;
        delete userObj.secret_question;
        delete userObj.secret_answer;
        return userObj;
      });
  
      return NextResponse.json(usersWithoutSensitiveInfo);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }