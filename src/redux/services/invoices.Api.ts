import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';

export const invoicesApi = createApi({
    reducerPath: 'invoiceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    }),
    tagTypes: ['Invoices'], // Etiqueta personalizada para invalidar los datos de invoices
    endpoints: (builder) => ({
        // Obtener todas las facturas
        getInvoices: builder.query<Invoice[], void>({
            query: () => '/invoices',
            providesTags: ['Invoices'],
            transformResponse: (response: Invoice[]) => {
                return response.sort((a, b) => dayjs(b.form.dateExpiration).isBefore(dayjs(a.form.dateCreation)) ? 1 : -1);
            },
            keepUnusedDataFor: 600, 
        }),
        // Obtener una factura por ID
        getInvoiceById: builder.query<Invoice, string>({
            query: (id) => `/invoices/${id}`,
            providesTags: ['Invoices'],
        }),
        // Eliminar una factura
        deleteInvoice: builder.mutation<void, string>({
            query: (id) => ({
                url: `/invoices/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Invoices'],
        }),
        // Crear una nueva factura
        createInvoice: builder.mutation<void, Omit<Invoice, '_id'>>({
            query: (newInvoice) => ({
                url: '/invoices',
                method: 'POST',
                body: newInvoice,
            }),
            invalidatesTags: ['Invoices'],
        }),
        // Actualizar una factura existente
        updateInvoice: builder.mutation<void, Invoice>({
            query: (invoice) => ({
                url: `/invoices/${invoice._id}`,
                method: 'PUT',
                body: invoice,
            }),
            invalidatesTags: ['Invoices'],
        }),
    }),
});

export const {
    useGetInvoicesQuery,
    useGetInvoiceByIdQuery,
    useDeleteInvoiceMutation,
    useCreateInvoiceMutation,
    useUpdateInvoiceMutation
} = invoicesApi;