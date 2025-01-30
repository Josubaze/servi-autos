import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'; 

export const usersApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  }),
  tagTypes: ['Users'], // Esto permite invalidar las cachés relacionadas con 'Users'
  endpoints: (builder) => ({
    // Crear un nuevo usuario
    createUser: builder.mutation<void, Omit<User, '_id'>>({
      query: (newUser) => ({
        url: '/users', // Asegúrate de que la URL de creación de usuario sea la correcta
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['Users'], // Invalidar la caché de 'Users' después de la creación
    }),

    // Actualizar un usuario existente
    updateUser: builder.mutation<User, { id: string; updatedData: Omit<User, '_id'> }>({
      query: ({ id, updatedData }) => ({
        url: `/users/${id}`, // Ruta para actualizar un usuario por su ID
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: ['Users'], // Invalidar la caché de 'Users' después de la actualización
    }),

    // Eliminar un usuario
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`, // Ruta para eliminar un usuario por su ID
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'], // Invalidar la caché de 'Users' después de la eliminación
    }),

    // Obtener todos los usuarios
    getUsers: builder.query<User[], void>({
      query: () => '/users', // Ruta para obtener todos los usuarios
      providesTags: ['Users'], // Proveer los tags relacionados con 'Users' para la caché
    }),

    // Obtener un usuario por su ID
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`, // Ruta para obtener un usuario por su ID
      providesTags: ['Users'],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
} = usersApi;
