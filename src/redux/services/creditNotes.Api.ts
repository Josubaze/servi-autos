import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';

export const creditNotesApi = createApi({
    reducerPath: 'creditNoteApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    }),
    tagTypes: ['CreditNotes'], 
    endpoints: (builder) => ({
        // Obtener todas las notas de crédito
        getCreditNotes: builder.query<CreditNote[], void>({
            query: () => '/creditNotes',
            providesTags: ['CreditNotes'],
            transformResponse: (response: CreditNote[]) => {
                return response.sort((a, b) => dayjs(b.formCreditNote.dateCreation).isBefore(dayjs(a.formCreditNote.dateCreation)) ? 1 : -1);
            },
            keepUnusedDataFor: 600, 
        }),
        // Obtener una nota de crédito por ID
        getCreditNoteById: builder.query<CreditNote, string>({
            query: (id) => `/creditNotes/${id}`,
            providesTags: ['CreditNotes'],
        }),
        // Eliminar una nota de crédito
        deleteCreditNote: builder.mutation<void, string>({
            query: (id) => ({
                url: `/creditNotes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CreditNotes'],
        }),
        // Crear una nueva nota de crédito
        createCreditNote: builder.mutation<void, Omit<CreditNote, '_id'>>({
            query: (newCreditNote) => ({
                url: '/creditNotes',
                method: 'POST',
                body: newCreditNote,
            }),
            invalidatesTags: ['CreditNotes'],
        }),
        // Actualizar una nota de crédito existente
        updateCreditNote: builder.mutation<void, CreditNote>({
            query: (creditNote) => ({
                url: `/creditNotes/${creditNote._id}`,
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
