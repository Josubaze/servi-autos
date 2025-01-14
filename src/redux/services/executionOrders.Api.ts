import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';

export const executionOrdersApi = createApi({
    reducerPath: 'executionOrderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    }),
    tagTypes: ['ExecutionOrders'], // Etiqueta personalizada para invalidar los datos de órdenes de ejecución
    endpoints: (builder) => ({
        // Obtener todas las órdenes de ejecución
        getExecutionOrders: builder.query<ExecutionOrder[], void>({
            query: () => '/execution_orders',
            providesTags: ['ExecutionOrders'],
            transformResponse: (response: ExecutionOrder[]) => {
                return response.sort((a, b) =>
                    dayjs(b.form.dateCreation).isAfter(dayjs(a.form.dateCreation)) ? 1 : -1
                );
            },
            keepUnusedDataFor: 600,
        }),
        // Obtener una orden de ejecución por ID
        getExecutionOrderById: builder.query<ExecutionOrder, string>({
            query: (id) => `/execution_orders/${id}`,
            providesTags: ['ExecutionOrders'],
        }),
        // Eliminar una orden de ejecución
        deleteExecutionOrder: builder.mutation<void, string>({
            query: (id) => ({
                url: `/execution_orders/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ExecutionOrders'],
        }),
        // Crear una nueva orden de ejecución
        createExecutionOrder: builder.mutation<void, Omit<ExecutionOrder, '_id'>>({
            query: (newExecutionOrder) => ({
                url: '/execution_orders',
                method: 'POST',
                body: newExecutionOrder,
            }),
            invalidatesTags: ['ExecutionOrders'],
        }),
        // Nueva API: Actualizar solo el estado de una orden de ejecución
        updateStateExecutionOrder: builder.mutation<ExecutionOrder, { id: string }>({
            query: ({ id }) => ({
                url: `/execution_orders/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['ExecutionOrders'],
        }),
    }),
});

export const {
    useGetExecutionOrdersQuery,
    useGetExecutionOrderByIdQuery,
    useDeleteExecutionOrderMutation,
    useCreateExecutionOrderMutation,
    useUpdateStateExecutionOrderMutation,
} = executionOrdersApi;
