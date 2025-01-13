import { useState, useMemo, useEffect } from "react";
import { useGetMarketQuery } from "../../redux/services/market.Api";

export const useMarket = (initialProduct: string) => {
  const [product, setProduct] = useState(initialProduct);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortMode, setSortMode] = useState<"unordered" | "asc" | "desc">("unordered");
  const itemsPerPage = 10;

  const { data, isLoading, isError, refetch, isFetching, isSuccess } = useGetMarketQuery(query, {
    skip: !query,
  });

  const results = data?.results || [];

  const sortedResults = (() => {
    if (sortMode === "asc") {
      return [...results].sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^\d.-]/g, ""));
        const priceB = parseFloat(b.price.replace(/[^\d.-]/g, ""));
        return priceA - priceB;
      });
    }
    if (sortMode === "desc") {
      return [...results].sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^\d.-]/g, ""));
        const priceB = parseFloat(b.price.replace(/[^\d.-]/g, ""));
        return priceB - priceA;
      });
    }
    return results;
  })();

  const currentPageData = (() => {
    const startIndex = (page - 1) * itemsPerPage;
    return sortedResults.slice(startIndex, startIndex + itemsPerPage);
  })();

  const totalPages = Math.ceil(sortedResults.length / itemsPerPage);

  const handleSortToggle = () => {
    setSortMode((prevMode) => {
      if (prevMode === "unordered") return "asc";
      if (prevMode === "asc") return "desc";
      return "unordered";
    });
  };

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
    itemsPerPage,
    currentPageData,
    totalPages,
    isLoading,
    isError,
    isFetching,
    isSuccess,
    handleSearchSubmit,
    sortMode,
    handleSortToggle,
  };
};
