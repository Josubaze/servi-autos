import { z } from "zod"

const roles = ["administrador", "lider"] as const;
export type Roles = (typeof roles)[number];

export const mapRoles: {[key in Roles]: string} = {
    administrador: "Administrador",
    lider: "Líder"
}

export const loginSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido" }),
    password: z.string().min(8, { message: "Las contraseñas son mayor o igual a 8 caracteres" })
});

export const SignupSchema = z.object({
    username: z.string().min(5, { message: "EL nombre de usuario debe ser mayor a 5 caracteres" }),
    email: z.string().email({ message: "Correo electrónico inválido" }),
    password: z.string().min(8, { message: "Las contraseñas son mayor o igual a 8 caracteres" }),
    role: z.enum(["administrador", "lider"], { message: "Seleccione un rol"}),
    secret_question: z.string({ message: "Por favor ingrese una pregunta secreta"}),
    secret_answer: z.string({ message: "Por favor ingrese una respuesta a la pregunta"}),
})

export const ProductSchema = z.object({
    name: z.string().min(3, { message: "El nombre debe ser mayor o igual a 3 caracteres" }).max(25, { message: "El nombre debe ser menor o igual a 25 caracteres" }),
    description: z.string().max(25, { message: "La descripción debe ser menor a 25 caracteres" }).nullish(),
    category: z.string().min(3, { message: "La categoría debe ser mayor a 3 caracteres" }).max(25, { message: "La categoría debe ser menor a 25 caracteres" }),
    price: z.string().refine(price => !isNaN(parseFloat(price)), { message: "El precio no es un número" }).transform(price => parseFloat(price)),
    quantity: z.string().refine(quantity => /^[0-9]+$/.test(quantity), { message: "La cantidad no es un número entero" }).transform(quantity => parseInt(quantity, 10)),
})
