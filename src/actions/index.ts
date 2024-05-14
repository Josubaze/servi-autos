'use server'
import { z } from "zod"
import { redirect } from 'next/navigation'

const loginSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido" }),
    password: z.string().min(8, { message: "Las contraseñas son mayor o igual a 8 caracteres" })
})

const SignupSchema = z.object({
    username: z.string().min(5, { message: "Debe ser mayor a 5 caracteres" }),
    email: z.string().email({ message: "Correo electrónico inválido" }),
    password: z.string().min(8, { message: "Las contraseñas son mayor o igual a 8 caracteres" }),
    role: z.enum(["administrador", "lider"]),
    secret_question: z.string(),
    secret_answer: z.string()
})

export const Login = async (prevState: any, formData: FormData) => { 
    let shouldRedirect = false;
    try {
        const parsedData = loginSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        });
        try {
            const res = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'login',
                    ...parsedData
                })
            })
            const data = await res.json()
            if (res.status === 404) {
                return {  errorMsg: data }
            }
            shouldRedirect = true;
        } catch (error) {
            return {  errorMsg: 'ha ocurrido un error' }
        }
    } catch (error) {
        let errorMsg = 'Algo ha salido mal'
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
            errorMsg = `Error: ${error.message}`
        }
        return {
            error: errorMsg
        }
    }
    if (shouldRedirect) {
        return redirect('/')
    }
}


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

        const res = await fetch('http://localhost:3000/api/auth/signup', {
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