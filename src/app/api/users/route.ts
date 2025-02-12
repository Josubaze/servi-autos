import { NextResponse } from 'next/server';
import { connectDB } from 'src/server/dataBase/connectDB'; 
import User from 'src/models/user.schema';
import bcrypt from "bcrypt";

// GET: Obtener todos los usuarios
export async function GET() {
    await connectDB();
    try {
      const users = await User.find(); // Obtener todos los usuarios
      // Convertir los documentos de Mongoose a objetos JavaScript
      const usersWithoutSensitiveInfo = users.map(user => {
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
          {
            message: error.message,
          },
          {
            status: 500,
          }
        );
      }
      return NextResponse.json(
        {
          message: 'An unknown error occurred',
        },
        {
          status: 500,
        }
      );
    }
  }

export async function POST(request: Request) {
  await connectDB(); 
  try {
    const data = await request.json();

    // Verificar si el correo electrónico ya está registrado
    const userFound = await User.findOne({ email: data.email });

    if (userFound) {
      return NextResponse.json(
        {
          message: "El correo electrónico ya existe",
        },
        {
          status: 400,
        }
      );
    }

    // Verificar si el nombre de usuario ya está registrado
    const usernameFound = await User.findOne({ username: data.username });

    if (usernameFound) {
      return NextResponse.json(
        {
          message: "El nombre de usuario ya existe",
        },
        {
          status: 400,
        }
      );
    }

    // Hashing de la contraseña y las preguntas secretas
    data.password = await bcrypt.hash(data.password, 10);
    data.secret_question = await bcrypt.hash(data.secret_question, 10);
    data.secret_answer = await bcrypt.hash(data.secret_answer, 10);

    // Crear un nuevo usuario
    const newUser = new User(data);
    const savedUser = await newUser.save();

    // Convertir el documento de Mongoose a un objeto JavaScript
    let user = savedUser.toObject();
    
    // Eliminar la propiedad password, secret_question y secret_answer del objeto
    delete user.password;
    delete user.secret_question;
    delete user.secret_answer;

    // Devolver el usuario sin las propiedades sensibles
    return NextResponse.json(user);

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      {
        message: 'An unknown error occurred',
      },
      {
        status: 500,
      }
    );
  }
}
