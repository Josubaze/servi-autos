import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

    export const marketApi = createApi({
        reducerPath: "marketApi",
        baseQuery: fetchBaseQuery({
            baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
        }),
        endpoints: (builder) => ({
            getMarket: builder.query<MarketResults, string>({
            query: (query) => `/market?q=${encodeURIComponent(query)}`,
            transformResponse: (response: any, meta): MarketResults => {
                // Validar que los datos contengan resultados
                if (!response.results || !Array.isArray(response.results)) {
                throw new Error(response.message || "Error inesperado");
                }
                return response as MarketResults;
            },
            }),
        }),
        });
        
        export const { useGetMarketQuery } = marketApi;