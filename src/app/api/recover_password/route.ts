import { NextRequest, NextResponse } from "next/server";
import User from "src/models/user.schema";
import { connectDB } from "src/server/dataBase/connectDB";
import bcrypt from "bcrypt";

export async function PUT(request: NextRequest) {
  await connectDB();
  try {
    // Extraer los datos enviados en el body
    const {
      email,
      password: newPassword,
      secret_question: providedQuestion,
      secret_answer: providedAnswer,
    } = await request.json();

    // Buscar el usuario por su email
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Validar que la pregunta secreta coincida
    const isQuestionValid = await bcrypt.compare(
      providedQuestion,
      userFound.secret_question
    );
    // Validar que la respuesta secreta coincida
    const isAnswerValid = await bcrypt.compare(
      providedAnswer,
      userFound.secret_answer
    );

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
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Ocurrió un error inesperado" },
      { status: 500 }
    );
  }
}
