import { z } from "zod"

const roles = ["administrador", "lider"] as const;
export type Roles = (typeof roles)[number];

export const mapRoles: {[key in Roles]: string} = {
    administrador: "Administrador",
    lider: "Líder"
}

export const loginSchema = z.object({
    email: z.string().email({ message: "Correo electrónico inválido" }),
    password: z.string().min(8, { message: "La contraseña es inválida" })
});

export const UserSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    email: z.string().email('Ingrese un correo válido'),
    password: z.string().min(8, { message: "Las contraseñas son mayor o igual a 8 caracteres" }),
    role: z.enum(["administrador", "lider"], { message: "Seleccione un rol"}),
    secret_question: z.string().min(5, 'La pregunta debe tener al menos 5 caracteres'),
    secret_answer: z.string().min(2, 'La respuesta debe tener al menos 2 caracteres'),
})

export const ProductSchema = z.object({
    name: z.string().min(3, { message: "El nombre debe ser mayor o igual a 3 caracteres" }).max(25, { message: "El nombre debe ser menor o igual a 25 caracteres" }),
    vehicle_type: z.string().max(25, { message: "La descripción debe ser menor a 25 caracteres" }).nullish(),
    description: z.string().max(30, { message: "La descripción debe ser menor a 30 caracteres" }).nullish(),
    category: z.string().min(3, { message: "La categoría debe ser mayor a 3 caracteres" }).max(25, { message: "La categoría debe ser menor a 25 caracteres" }),
    price: z.union([
        z.string()
          .refine(price => !isNaN(parseFloat(price)) && parseFloat(price) > 0, { message: "El precio debe ser un número positivo" })
          .transform(price => parseFloat(price)),
        z.number()
          .refine(price => price > 0, { message: "El precio debe ser un número positivo" })
      ]),
    
      quantity: z.union([
        z.string()
          .refine(quantity => /^[0-9]+$/.test(quantity) && parseInt(quantity, 10) > 0, { message: "La cantidad debe ser un número entero positivo" })
          .transform(quantity => parseInt(quantity, 10)),
        z.number()
          .refine(quantity => Number.isInteger(quantity) && quantity > 0, { message: "La cantidad debe ser un número entero positivo" })
      ])
  });
  

  export const CustomerSchema = z.object({
    name: z.string()
      .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
      .max(40, { message: "El nombre no puede exceder los 40 caracteres" })
      .trim(),
    
    id_card: z.string().regex(
      /^(V|E|J|G)\d{7,8}(\d)?$/,
      "Formato inválido. Debe ser 'V1234567', 'E12345678' para cédulas, o 'J12345678'/'G12345678' con un dígito final opcional para RIF."
    ),
    
    email: z.string()
      .email({ message: "Debe ser un correo electrónico válido" })
      .trim(),
    
    phone: z.string()
      .min(3, { message: "El teléfono debe tener al menos 3 caracteres" })
      .max(40, { message: "El teléfono no puede exceder los 40 caracteres" })
      .trim(),
    
    address: z.object({
      city: z.string()
        .min(3, { message: "La ciudad debe tener al menos 3 caracteres" })
        .max(40, { message: "La ciudad no puede exceder los 40 caracteres" })
        .trim(),
      
      state: z.string()
        .min(3, { message: "El estado debe tener al menos 3 caracteres" })
        .max(40, { message: "El estado no puede exceder los 40 caracteres" })
        .trim(),
    })
  });
  
export const ProviderSchema = z.object({
  name: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(40, "El nombre debe tener como máximo 40 caracteres"),
  contactName: z.string()
    .min(3, "El nombre de contacto debe tener al menos 3 caracteres")
    .max(40, "El nombre de contacto debe tener como máximo 40 caracteres"),
  email: z.string()
    .email("Correo electrónico inválido"),
  phone: z.string()
    .min(3, "El teléfono debe tener al menos 3 caracteres")
    .max(40, "El teléfono debe tener como máximo 40 caracteres"),
  address: z.object({
    city: z.string()
      .min(3, "La ciudad debe tener al menos 3 caracteres")
      .max(40, "La ciudad debe tener como máximo 40 caracteres"),
    state: z.string()
      .min(3, "El estado debe tener al menos 3 caracteres")
      .max(40, "El estado debe tener como máximo 40 caracteres"),
  }),
});
