import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'; 

export const usersApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,       
    }),
    tagTypes: ['Users'], 
    endpoints: (builder) => ({
        createUser: builder.mutation<void, Omit<User, '_id'>>({
            query: (newUser) => ({
                url: '/auth/signup',
                method: 'POST',
                body: newUser,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const {  useCreateUserMutation,  } =  usersApi