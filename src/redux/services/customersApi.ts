import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'; 

export const customersApi = createApi({
    reducerPath: 'customersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,       
    }),
    tagTypes: ['Customers'], 
    endpoints: (builder) => ({
        getCustomers: builder.query<Customer[], void>({
            query: () => '/customers',
            providesTags: ['Customers'],
            transformResponse: (response: Customer[]) => {
                return response.sort((a, b) => a.name.localeCompare(b.name));
            },
            keepUnusedDataFor: 600,
        }),
        deleteCustomer: builder.mutation<void, string>({
            query: (id) => ({
                url: `/customers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Customers'],
        }),
        createCustomer: builder.mutation<void, Omit<Customer, '_id'>>({
            query: (newCustomer) => ({
                url: '/customers',
                method: 'POST',
                body: newCustomer,
            }),
            invalidatesTags: ['Customers'],
        }),
        updateCustomer: builder.mutation<void, Customer>({
            query: (customer) => ({
                url: `/customers/${customer._id}`,
                method: 'PUT',
                body: customer,
            }),
            invalidatesTags: ['Customers'],
        }),
    }),
});

export const { useGetCustomersQuery, useDeleteCustomerMutation, useCreateCustomerMutation, useUpdateCustomerMutation } = customersApi;
