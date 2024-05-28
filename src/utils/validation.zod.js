import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido" }),
    password: z.string().min(8, { message: "Las contraseñas son mayor o igual a 8 caracteres" })
});

export const SignupSchema = z.object({
    username: z.string().min(5, { message: "EL nombre de usuario debe ser mayor a 5 caracteres" }),
    email: z.string().email({ message: "Correo electrónico inválido" }),
    password: z.string().min(8, { message: "Las contraseñas son mayor o igual a 8 caracteres" }),
    role: z.enum(["administrador", "lider"]),
    secret_question: z.string(),
    secret_answer: z.string(),
    image: z.string().nullable(), 
})