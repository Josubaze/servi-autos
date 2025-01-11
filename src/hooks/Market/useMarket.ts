import { useState, useMemo, useEffect } from "react";
import { useGetMarketQuery } from "../../redux/services/market.Api";

export const useMarket = (initialProduct: string) => {
  const [product, setProduct] = useState(initialProduct);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;

  const { data, isLoading, isError, refetch, isFetching } = useGetMarketQuery(query, {
    skip: !query,
  });

  const results = data?.results || [];
  const pages = Math.ceil(results.length / rowsPerPage);

  const currentPageData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return results.slice(start, end);
  }, [page, results]);

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    setQuery(product);
    setPage(1);
  };

  useEffect(() => {
    if (query) {
      refetch();
    }
  }, [query, refetch]);

  return {
    product,
    setProduct,
    query,
    setQuery,
    page,
    setPage,
    rowsPerPage,
    results,
    isLoading,
    isError,
    currentPageData,
    handleSearchSubmit,
    isFetching,
    pages,
  };
};
