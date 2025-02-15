import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const recoverPasswordApi = createApi({
  reducerPath: 'recoverPasswordApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  }),
  tagTypes: ['RecoverPassword'],
  endpoints: (builder) => ({
    recoverPassword: builder.mutation<User, RecoverPasswordData>({
      query: (updatedData) => ({
        url: `/recover_password`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['RecoverPassword'],
    }),
  }),
});

export const {
  useRecoverPasswordMutation, // Actualiza el hook acorde al cambio de nombre
} = recoverPasswordApi;
