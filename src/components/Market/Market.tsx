'use client'

import { useState, useMemo } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Input, Button } from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import Link from "next/link";

export const Market = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 15; // Cambié de 10 a 15

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch(`/api/market?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const pages = Math.ceil(results.length / rowsPerPage);

  const currentPageData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return results.slice(start, end);
  }, [page, results]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Buscar artículos en MercadoLibre</h1>
      <div className="flex items-center justify-center space-x-2 max-w-full sm:max-w-md mx-auto">
        <Input
          aria-label="Buscar productos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..."
          className="flex-1"
        />
        <Button
          onClick={handleSearch}
          color="primary"
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-4">
        {results.length > 0 ? (
          <Table
            aria-label="Artículos encontrados en MercadoLibre"
            classNames={{
              wrapper: "min-h-[222px]",
            }}
          >
            <TableHeader>
              <TableColumn key="title">Título</TableColumn>
              <TableColumn key="price">Precio</TableColumn>
              <TableColumn key="rating">Calificación</TableColumn>
              <TableColumn key="shipping">Envío</TableColumn>
              <TableColumn key="options">Opciones</TableColumn>
            </TableHeader>
            <TableBody items={currentPageData}>
              {(item) => (
                <TableRow key={item.permalink}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.currency}{item.price}</TableCell>
                  <TableCell>{item.rating}</TableCell>
                  <TableCell>{item.shipping}</TableCell>
                  <TableCell>
                    <Link href={item.permalink} target="_blank" rel="noopener noreferrer">
                      <button className="text-blue-500">
                        <FaEye size={20} />
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          !loading && <p>No se encontraron resultados.</p>
        )}
      </div>

      {results.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </div>
  );
};
