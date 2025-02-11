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
        updateProduct: builder.mutation<void, Product>({
            query: (product) => ({
                url: `/products/${product._id}`,
                method: 'PUT',
                body: product,
            }),
            invalidatesTags: ['Products'],
        }),
        updateProductQuantity: builder.mutation<void, { _id: string; quantity: number; operation: string }>({
            query: ({ _id, quantity, operation }) => ({
                url: `/products/${_id}`,
                method: "PATCH",
                body: { quantity, operation },
            }),
            invalidatesTags: ['Products'],
        }),
    }),
});

export const { useGetProductsQuery, useDeleteProductMutation , useCreateProductMutation, useUpdateProductMutation, useUpdateProductQuantityMutation,
 } =  productsApi