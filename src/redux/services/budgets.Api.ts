import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';

export const budgetsApi = createApi({
    reducerPath: 'budgetApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    }),
    tagTypes: ['Budgets'], // Etiqueta personalizada para invalidar los datos de budgets
    endpoints: (builder) => ({
        // Obtener todos los presupuestos
        getBudgets: builder.query<Budget[], void>({
            query: () => '/budgets',
            providesTags: ['Budgets'],
            transformResponse: (response: Budget[]) => {
                return response.sort((a, b) => dayjs(b.form.dateExpiration).isBefore(dayjs(a.form.dateCreation)) ? 1 : -1);
            },
            keepUnusedDataFor: 600, 
        }),
        // Obtener un presupuesto por ID
        getBudgetById: builder.query<Budget, string>({
            query: (id) => `/budgets/${id}`,
            providesTags: ['Budgets'],
        }),
        // Eliminar un presupuesto
        deleteBudget: builder.mutation<void, string>({
            query: (id) => ({
                url: `/budgets/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Budgets'], // Invalidar la caché de Budgets después de eliminar
        }),
        // Crear un nuevo presupuesto
        createBudget: builder.mutation<void, Omit<Budget, '_id'>>({
            query: (newBudget) => ({
                url: '/budgets',
                method: 'POST',
                body: newBudget,
            }),
            invalidatesTags: ['Budgets'], // Invalidar la caché de Budgets después de crear
        }),
        // Actualizar un presupuesto existente
        updateBudget: builder.mutation<void, Budget>({
            query: (budget) => ({
                url: `/budgets/${budget._id}`,
                method: 'PUT',
                body: budget,
            }),
            invalidatesTags: ['Budgets'], // Invalidar la caché de Budgets después de actualizar
        }),
    }),
});

export const {
    useGetBudgetsQuery,
    useGetBudgetByIdQuery,
    useDeleteBudgetMutation,
    useCreateBudgetMutation,
    useUpdateBudgetMutation
} = budgetsApi;
