import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
                return response.sort((a, b) => b.form.num - a.form.num);
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
        createBudget: builder.mutation<void, Omit<BudgetCreate, '_id'>>({
            query: (newBudget) => ({
                url: '/budgets',
                method: 'POST',
                body: newBudget,
            }),
            invalidatesTags: ['Budgets'], // Invalidar la caché de Budgets después de crear
        }),
        // Actualizar un presupuesto existente
        updateBudget: builder.mutation<void, BudgetCreate>({
            query: (budget) => ({
                url: `/budgets/${budget._id}`,
                method: 'PUT',
                body: budget,
            }),
            invalidatesTags: ['Budgets'], // Invalidar la caché de Budgets después de actualizar
        }),
        updateStateBudget: builder.mutation<Budget, { id: string }>({
            query: ({ id }) => ({
                url: `/budgets/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Budgets'],
        }),
        markAsInvoice: builder.mutation<Budget, { id: string }>({
            query: ({ id }) => ({
                url: `/budgets/mark_as_invoice/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Budgets'],
        }),
    }),
});

export const {
    useGetBudgetsQuery,
    useGetBudgetByIdQuery,
    useDeleteBudgetMutation,
    useCreateBudgetMutation,
    useUpdateBudgetMutation,
    useUpdateStateBudgetMutation,
    useMarkAsInvoiceMutation
} = budgetsApi;
