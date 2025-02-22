import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'; 

export const productsApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,       
    }),
    tagTypes: ['Products'], 
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], void>({
            query: () => '/products',
            providesTags: ['Products'],
            transformResponse: (response: Product[]) => {
                return response.sort((a, b) => a.name.localeCompare(b.name));
            },
            keepUnusedDataFor: 600,
        }),
        deleteProduct: builder.mutation<void, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),
        // ✅ acepta tanto un solo producto como varios productos en un array
        createProduct: builder.mutation<void, Omit<Product, '_id'> | Omit<Product, '_id'>[]>({
            query: (newProduct) => ({
                url: '/products',
                method: 'POST',
                body: newProduct,
            }),
            invalidatesTags: ['Products'],
        }),
         // ✅ acepta tanto un solo producto como varios productos en un array
        checkAvailability: builder.mutation<
            { results: { name: string; available: boolean; currentQuantity?: number; message?: string }[] }, 
            { id: string; quantity: number }[]
        >({
            query: (productsToCheck) => ({
                url: '/products/check_availability',
                method: 'POST',
                body: productsToCheck,
            }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation<void, Product>({
            query: (product) => ({
                url: `/products/${product._id}`,
                method: 'PUT',
                body: product,
            }),
            invalidatesTags: ['Products'],
        }),
        updateProductQuantity: builder.mutation<void, { id: string; quantity: number; operation: string }[]>({
            query: (products) => ({
              url: `/products`,
              method: "PATCH",
              body: products,
            }),
            invalidatesTags: ["Products"],
        }),
          
          
    }),
});

export const { useGetProductsQuery, useDeleteProductMutation , useCreateProductMutation, useUpdateProductMutation, useUpdateProductQuantityMutation, useCheckAvailabilityMutation
 } =  productsApi