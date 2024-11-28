import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const companyApi = createApi({
    reducerPath: 'companyApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    }),
    tagTypes: ['Company'],
    endpoints: (builder) => ({
        // Obtener la información de la empresa
        getCompany: builder.query<Company, void>({
            query: () => '/company',
            providesTags: ['Company'],
        }),
        // Actualizar la empresa
        updateCompany: builder.mutation<Company, Company>({
            query: (company) => ({
                url: '/company',
                method: 'PUT',
                body: company,
            }),
            invalidatesTags: ['Company'],
        }),
        // Eliminar la empresa (si fuera necesario)
        deleteCompany: builder.mutation<void, void>({
            query: () => ({
                url: '/company',
                method: 'DELETE',
            }),
            invalidatesTags: ['Company'],
        }),
        // Crear la empresa (en caso de que no exista)
        createCompany: builder.mutation<Company, Omit<Company, '_id'>>({
            query: (newCompany) => ({
                url: '/company',
                method: 'POST',
                body: newCompany,
            }),
            invalidatesTags: ['Company'],
        }),
    }),
});

export const { 
    useGetCompanyQuery, 
    useUpdateCompanyMutation, 
    useDeleteCompanyMutation, 
    useCreateCompanyMutation 
} = companyApi;
