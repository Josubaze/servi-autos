import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const creditNotesApi = createApi({
    reducerPath: 'creditNoteApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    }),
    tagTypes: ['CreditNotes'], 
    endpoints: (builder) => ({
        // Obtener todas las notas de crédito
        getCreditNotes: builder.query<CreditNote[], void>({
            query: () => '/credit_notes',
            providesTags: ['CreditNotes'],          
            transformResponse: (response: CreditNote[]) => {
                return response.sort((a, b) => b.form.num - a.form.num);
            },
            keepUnusedDataFor: 600, 
        }),
        // Obtener una nota de crédito por ID
        getCreditNoteById: builder.query<CreditNote, string>({
            query: (id) => `/credit_notes/${id}`,
            providesTags: ['CreditNotes'],
        }),
        // Eliminar una nota de crédito
        deleteCreditNote: builder.mutation<void, string>({
            query: (id) => ({
                url: `/credit_notes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CreditNotes'],
        }),
        // Crear una nueva nota de crédito
        createCreditNote: builder.mutation<void, Omit<CreditNote, '_id'>>({
            query: (newCreditNote) => ({
                url: '/credit_notes',
                method: 'POST',
                body: newCreditNote,
            }),
            invalidatesTags: ['CreditNotes'],
        }),
        // Actualizar una nota de crédito existente
        updateCreditNote: builder.mutation<void, CreditNote>({
            query: (creditNote) => ({
                url: `/credit_notes/${creditNote._id}`,
                method: 'PUT',
                body: creditNote,
            }),
            invalidatesTags: ['CreditNotes'],
        }),
    }),
});

export const {
    useGetCreditNotesQuery,
    useGetCreditNoteByIdQuery,
    useDeleteCreditNoteMutation,
    useCreateCreditNoteMutation,
    useUpdateCreditNoteMutation
} = creditNotesApi;
