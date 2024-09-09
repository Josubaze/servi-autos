import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'; 

export const usersApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,       
    }),
    tagTypes: ['Users'], 
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => '/users',
            providesTags: ['Users'],
            transformResponse: (response: User[]) => {
                return response.sort((a, b) => a.username.localeCompare(b.username));
            },
        }),
        deleteUser: builder.mutation<void, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
        createUser: builder.mutation<void, UserSinId>({
            query: (newUser) => ({
                url: '/auth/signup',
                method: 'POST',
                body: newUser,
            }),
            invalidatesTags: ['Users'],
        }),
        updateUser: builder.mutation<void, User>({
            query: (user) => ({
                url: `/users/${user._id}`,
                method: 'PUT',
                body: user,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const { useGetUsersQuery, useDeleteUserMutation , useCreateUserMutation, useUpdateUserMutation } =  usersApi