'use server'
import { z } from "zod"
import { redirect } from 'next/navigation'
import {connectDB} from 'src/utils/mongoose'
import {ProductSchema, SignupSchema } from 'src/utils/validation.zod'

connectDB()

export const handlerSignup = async (prevState: any, formData: FormData) => { 
    let shouldRedirect = false;
    
    try {
        const parsedData = SignupSchema.parse({
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('role'),
            secret_question: formData.get('secret-question'),
            secret_answer: formData.get('secret-answer'),
            //image: formData.get('link-image'),
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

export const handleViewProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      if (!res.ok) {
        throw new Error(`Error fetching products: ${res.statusText}`);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return null; // o lanza el error nuevamente dependiendo de cómo quieras manejarlo
    }
  };

  export const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const productsUpdate = await res.json();
        return productsUpdate;
      } else {
        throw new Error(`Error deleting product: ${res.statusText}`);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
};

export const handleAddProduct = async (prevState: any, formData: FormData) => {
  try {
    if (!(formData instanceof FormData)) {
      throw new Error("Invalid formData");
    }
    const parsedData = ProductSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      quantity: Number(formData.get('quantity')),
      price: Number(formData.get('price')),
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedData)
    })
      
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message);  
    }
    const newProduct = await res.json();
    return { ...prevState, shouldClose: true, newProduct };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: 'Ha ocurrido un error desconocido',
    };
  }
};


export const handleUpdateProduct = async (prevState: any, formData: FormData) => {
  try {
    if (!(formData instanceof FormData)) {
      throw new Error("Invalid formData");
    }

    const parsedData = ProductSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      quantity: Number(formData.get('quantity')),
      price: Number(formData.get('price')),
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${formData.get('id')}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedData)
    })
      
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message);  
    }
    const newProduct = await res.json();
    console.log(newProduct);
    return { shouldClose: true, newProduct };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: 'Ha ocurrido un error desconocido',
    };
  }
};