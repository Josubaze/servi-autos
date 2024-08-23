import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'; 

export const productsApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,       
    }),
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], void>({
            query: () => '/products',
        }),
        ProductDelete: builder.mutation<void, {id: string}>({
            query: ({id}) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
        }),
        // addProduct: builder.mutation<void, Product>({
        //     query: (product) => ({
        //         url: '/products',
        //         method: 'POST',
        //         body: product,
        //     }),
        // }),
        // updateProduct: builder.mutation<void, Product>({
        //     query: (product) => ({
        //         url: `/products/${product._id}`,
        //         method: 'PUT',
        //         body: product,
        //     }),
        // }),
    }),
});

export const { useGetProductsQuery, useProductDeleteMutation } =  productsApi