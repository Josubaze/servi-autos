import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reportsApi = createApi({
    reducerPath: 'reportsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    }),
    tagTypes: ['Reports'], // Etiqueta personalizada para invalidar los datos de reports
    endpoints: (builder) => ({
        // Obtener todos los reportes
        getReports: builder.query<ReportWork[], void>({
            query: () => '/reports',
            providesTags: ['Reports'],
            transformResponse: (response: ReportWork[]) => {
                return response.sort((a, b) => 
                    new Date(b.form.dateCreation).getTime() - new Date(a.form.dateCreation).getTime()
                );
            },
            keepUnusedDataFor: 600, 
        }),
        // Obtener un reporte por ID
        getReportById: builder.query<ReportWork, string>({
            query: (id) => `/reports/${id}`,
            providesTags: ['Reports'],
        }),
        // Eliminar un reporte
        deleteReport: builder.mutation<void, string>({
            query: (id) => ({
                url: `/reports/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Reports'],
        }),
        // Crear un nuevo reporte
        createReport: builder.mutation<void, Omit<ReportWork, '_id'>>({
            query: (newReport) => ({
                url: '/reports',
                method: 'POST',
                body: newReport,
            }),
            invalidatesTags: ['Reports'],
        }),
        // Actualizar un reporte existente
        updateReport: builder.mutation<void, ReportWork>({
            query: (report) => ({
                url: `/reports/${report._id}`,
                method: 'PUT',
                body: report,
            }),
            invalidatesTags: ['Reports'],
        }),
        // Nueva API: Actualizar solo el estado de un reporte
        updateStateReport: builder.mutation<ReportWork, { id: string }>({
            query: ({ id }) => ({
                url: `/reports/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Reports'],
        }),
    }),
});

export const {
    useGetReportsQuery,
    useGetReportByIdQuery,
    useDeleteReportMutation,
    useCreateReportMutation,
    useUpdateReportMutation,
    useUpdateStateReportMutation,
} = reportsApi;
