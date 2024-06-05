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
})

export const ProductSchema = z.object({
    name: z.string().min(3, { message: "El nombre debe ser mayor o igual a 3 caracteres" }).max(25, { message: "El nombre debe ser menor o igual a 25 caracteres" }),
    description: z.string().max(25, { message: "La descripción debe ser menor a 25 caracteres" }).nullish(),
    category: z.string().max(25, { message: "La categoría debe ser menor a 25 caracteres" }),
    price: z.number().min(0).lte(99999),
    quantity: z.number().min(0).int().lte(10000),
})