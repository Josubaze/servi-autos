import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const servicesApi = createApi({
    reducerPath: 'servicesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    }),
    tagTypes: ['Services'],
    endpoints: (builder) => ({
        getServices: builder.query<Service[], void>({
            query: () => '/services',
            providesTags: ['Services'],
            transformResponse: (response: Service[]) => {
                return response.sort((a, b) => a.name.localeCompare(b.name));
            },
            keepUnusedDataFor: 600,
        }),
        deleteService: builder.mutation<void, string>({
            query: (id) => ({
                url: `/services/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Services'],
        }),
        createService: builder.mutation<void, Omit<Service, '_id'>>({
            query: (newService) => ({
                url: '/services',
                method: 'POST',
                body: newService,
            }),
            invalidatesTags: ['Services'],
        }),
        updateService: builder.mutation<void, Service>({
            query: (service) => ({
                url: `/services/${service._id}`,
                method: 'PUT',
                body: service,
            }),
            invalidatesTags: ['Services'],
        }),
    }),
});

export const {
    useGetServicesQuery,
    useDeleteServiceMutation,
    useCreateServiceMutation,
    useUpdateServiceMutation,
} = servicesApi;
