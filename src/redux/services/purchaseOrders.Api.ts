import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const purchaseOrdersApi = createApi({
    reducerPath: 'purchaseOrdersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    }),
    tagTypes: ['PurchaseOrders'], // Etiqueta personalizada para invalidar los datos de purchaseOrders
    endpoints: (builder) => ({
        // Obtener todas las órdenes de compra
        getPurchaseOrders: builder.query<PurchaseOrder[], void>({
            query: () => '/purchase_orders',
            providesTags: ['PurchaseOrders'],
            transformResponse: (response: PurchaseOrder[]) => {
                return response.sort((a, b) => 
                    new Date(b.form.dateCreation).getTime() - new Date(a.form.dateCreation).getTime()
                );
            },
            keepUnusedDataFor: 600,
        }),
        // Obtener una orden de compra por ID
        getPurchaseOrderById: builder.query<PurchaseOrder, string>({
            query: (id) => `/purchase_orders/${id}`,
            providesTags: ['PurchaseOrders'],
        }),
        // Eliminar una orden de compra
        deletePurchaseOrder: builder.mutation<void, string>({
            query: (id) => ({
                url: `/purchase_orders/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['PurchaseOrders'],
        }),
        // Crear una nueva orden de compra
        createPurchaseOrder: builder.mutation<void, Omit<PurchaseOrder, '_id'>>({
            query: (newPurchaseOrder) => ({
                url: '/purchase_orders',
                method: 'POST',
                body: newPurchaseOrder,
            }),
            invalidatesTags: ['PurchaseOrders'],
        }),
        // Actualizar una orden de compra existente
        updatePurchaseOrder: builder.mutation<void, PurchaseOrder>({
            query: (purchaseOrder) => ({
                url: `/purchase_orders/${purchaseOrder._id}`,
                method: 'PUT',
                body: purchaseOrder,
            }),
            invalidatesTags: ['PurchaseOrders'],
        }),
        // Nueva API: Actualizar solo el estado de una orden de compra
        updateStatePurchaseOrder: builder.mutation<PurchaseOrder, { id: string }>({
            query: ({ id }) => ({
                url: `/purchase_orders/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['PurchaseOrders'],
        }),
    }),
});

export const {
    useGetPurchaseOrdersQuery,
    useGetPurchaseOrderByIdQuery,
    useDeletePurchaseOrderMutation,
    useCreatePurchaseOrderMutation,
    useUpdatePurchaseOrderMutation,
    useUpdateStatePurchaseOrderMutation,
} = purchaseOrdersApi;
