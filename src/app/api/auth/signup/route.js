import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {connectDB} from 'src/utils/mongoose'
import User  from '/src/schemas/user.schema'

connectDB()
export async function POST(request) {
  try {
    const data = await request.json();
    const userFound  = await User.findOne({ email: data.email})
        
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

    const usernameFound = await User.findOne({ username: data.username })

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

    data.password = await bcrypt.hash(data.password, 10); 
    data.secret_question = await bcrypt.hash(data.secret_question, 10);
    data.secret_answer = await bcrypt.hash(data.secret_answer, 10);
    const newUser = new User(data)
    const savedUser = await newUser.save()
    // Convertir el documento de Mongoose a un objeto JavaScript
    let user = savedUser.toObject();
    // Eliminar la propiedad password del objeto
    delete user.password;
    delete user.secret_question;
    delete user.secret_answer;
    return NextResponse.json(user);
    
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}