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
    try {
        const data = await request.json()
        const newUser = new User(data)
        const savedUser = await newUser.save()
        return NextResponse.json(savedUser)
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400 
        })
    }
}

