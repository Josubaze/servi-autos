'use server'
import { z } from "zod"
import { redirect } from 'next/navigation'
import {connectDB} from 'src/utils/mongoose'
import {SignupSchema } from 'src/utils/validation.zod'

connectDB()

export const Signup = async (prevState: any, formData: FormData) => { 
    let shouldRedirect = false;
    try {
        const parsedData = SignupSchema.parse({
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('role'),
            secret_question: formData.get('secret-question'),
            secret_answer: formData.get('secret-answer')
        });

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData)
        })
        
        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.message);     // creamos un nuevo error con el msj de la res 
        }
        shouldRedirect = true;         
    } catch (error) {
        let errorMessage = 'Algo ha salido mal'
        if (error instanceof z.ZodError) {{
            return {
                errors: error.errors.map((err) => {
                    return {
                        field: err.path.join('.'),
                        message: err.message
                    } 
                })
            }
        }}
        if(error instanceof Error) {
            errorMessage = `${error.message}`;
        }
        return {
            error: errorMessage
        }
    }
    if (shouldRedirect) {
        return redirect('/login')
    }
}