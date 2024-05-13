import { NextResponse  } from "next/server";
import {connectDB} from 'src/utils/mongoose'
import User  from '/src/schemas/users.schema'

connectDB()
export async function GET(request, {  params }){
    try {
        const users = await User.find()
        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400 
        })
    }
    
}
export async function POST(request){
    const data = await request.json()
    const type = data.type;
    if (type === 'register'){
        try {
            const newUser = new User(data)
            const savedUser = await newUser.save()
            return NextResponse.json(savedUser)
        } catch (error) {
            return NextResponse.json(error.message, {
                status: 400 
            })
        }
    }else if (type === 'login') {
        const user = await User.findOne({ email: data.email, password: data.password })
        if (!user) {
            return NextResponse.json('Usuario no encontrado', {
                status: 404 
            })
        }
        return NextResponse.json({ status: 200 })
    } else {
        return NextResponse.json('Tipo de solicitud no válido', {
            status: 400 
        })
    }
}

