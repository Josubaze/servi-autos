import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'; 

export const providersApi = createApi({
    reducerPath: 'providersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,       
    }),
    tagTypes: ['Providers'], 
    endpoints: (builder) => ({
        getProviders: builder.query<Provider[], void>({
            query: () => '/providers',
            providesTags: ['Providers'],
            transformResponse: (response: Provider[]) => {
                return response.sort((a, b) => a.name.localeCompare(b.name));
            },
            keepUnusedDataFor: 600,
        }),
        deleteProvider: builder.mutation<void, string>({
            query: (id) => ({
                url: `/providers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Providers'],
        }),
        createProvider: builder.mutation<void, Omit<Provider, '_id'>>({
            query: (newProvider) => ({
                url: '/providers',
                method: 'POST',
                body: newProvider,
            }),
            invalidatesTags: ['Providers'],
        }),
        updateProvider: builder.mutation<void, Provider>({
            query: (provider) => ({
                url: `/providers/${provider._id}`,
                method: 'PUT',
                body: provider,
            }),
            invalidatesTags: ['Providers'],
        }),
    }),
});

export const { useGetProvidersQuery, useDeleteProviderMutation, useCreateProviderMutation, useUpdateProviderMutation } = providersApi;
