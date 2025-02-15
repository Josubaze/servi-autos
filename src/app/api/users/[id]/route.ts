import { NextRequest, NextResponse } from "next/server";
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



export async function PUT(request : NextRequest, { params }: { params: UpdatePasswordData }) {
  await connectDB();
  try {
    // Extraer los datos enviados en el body
    const { password: newPassword, secret_question: providedQuestion, secret_answer: providedAnswer } = await request.json();

    // Buscar el usuario por su ID
    const userFound = await User.findById(params.id);
    if (!userFound) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Validar que la pregunta secreta coincida
    const isQuestionValid = await bcrypt.compare(providedQuestion, userFound.secret_question);
    // Validar que la respuesta secreta coincida
    const isAnswerValid = await bcrypt.compare(providedAnswer, userFound.secret_answer);

    if (!isQuestionValid || !isAnswerValid) {
      return NextResponse.json(
        { error: "Pregunta secreta o respuesta incorrecta" },
        { status: 401 }
      );
    }

    // Encriptar la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos
    userFound.password = hashedNewPassword;
    await userFound.save();

    // Eliminar información sensible antes de retornar la respuesta
    const userResponse = userFound.toObject();
    delete userResponse.password;
    delete userResponse.secret_question;
    delete userResponse.secret_answer;

    return NextResponse.json(userResponse, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Ocurrió un error inesperado" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: RouteParams }): Promise<NextResponse> {
  await connectDB();
  try {
    // Extraemos los datos del body, en este caso, esperamos solo el campo "image"
    const data = await request.json();

    // Actualizamos el usuario con el nuevo campo "image"
    const updatedUser = await User.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    // Si quieres eliminar información sensible en la respuesta
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    delete userResponse.secret_question;
    delete userResponse.secret_answer;

    return NextResponse.json(userResponse, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Ocurrió un error inesperado" }, { status: 500 });
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