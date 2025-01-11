'use client'

import { Input, Button, Pagination } from "@nextui-org/react";
import { motion } from "framer-motion";
import { BsSearch } from "react-icons/bs";
import { MdOutlineSearchOff } from "react-icons/md";
import { Loading } from "../Common/Loading";
import { useMarket } from "../../hooks/Market/useMarket"; // Importa el hook personalizado
import { MarketTable } from "./MarketTable"; // Importa el nuevo componente

export const Market = () => {
  const {
    product,
    setProduct,
    page,
    setPage,
    results,
    isLoading,
    isError,
    currentPageData,
    handleSearchSubmit,
    isFetching,
    pages,
  } = useMarket("");

  return (
    <div className="px-10 py-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}>
        {!results.length && !isLoading && !isError ? (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
            <div className="flex items-center">
              <h1 className="text-8xl font-bold">Mercado</h1>
              <h1 className="text-8xl font-bold text-yellow-500">Libre</h1>
            </div>
            <p className="text-lg text-gray-400">
              Consulte precios de MercadoLibre desde aquí.
            </p>
            <div className="flex items-center justify-center space-x-2 max-w-full sm:max-w-md">
              <form onSubmit={handleSearchSubmit}>
                <Input
                  aria-label="Buscar productos"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="Buscar..."
                  className="flex-1"
                  classNames={{ inputWrapper: "pr-0 pl-3" }}
                  endContent={
                    <Button
                      isIconOnly
                      variant="ghost"
                      className="bg-yellow-500 hover:bg-yellow-600"
                      type="submit"
                      isLoading={isLoading || isFetching}
                      disabled={isLoading || isFetching}
                    >
                      <BsSearch />
                    </Button>
                  }
                />
              </form>
            </div>
          </div>
        ) : (
          <div>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.5 }}>
              <div className="flex items-center pt-6 mb-4">
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold">Consultar Mercado</h1>
                  <h1 className="text-3xl font-bold text-yellow-500">Libre</h1>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 mb-4">
                <h2 className="font-title text-xl">Publicaciones encontradas:</h2>
                <div className="flex items-center max-w-full sm:max-w-md">
                  <form onSubmit={handleSearchSubmit}>
                    <Input
                      aria-label="Buscar productos"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder="Buscar..."
                      className="flex-1"
                      classNames={{ inputWrapper: "pr-0 pl-3" }}
                      endContent={
                        <Button
                          isIconOnly
                          variant="ghost"
                          className="bg-yellow-500 hover:bg-yellow-600"
                          type="submit"
                          isLoading={isLoading || isFetching}
                          disabled={isLoading || isFetching}
                        >
                          <BsSearch />
                        </Button>
                      }
                    />
                  </form>
                </div>
              </div>
              <div className="mt-4">
                {isLoading || isFetching ? (
                  <div className="flex justify-center items-center h-[500px]">
                    <Loading />
                  </div>
                ) : isError ? (
                  <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4">
                    <MdOutlineSearchOff className="h-24 w-24 text-yellow-400" />
                    <h1 className="font-bold">No hay publicaciones que coincidan con tu búsqueda.</h1>
                  </div>
                ) : results.length > 0 ? (
                  <motion.div  
                    initial={{ x: '100%' }} 
                    animate={{ x: 0 }} 
                    transition={{ type: 'spring', stiffness: 50 }}>
                    <MarketTable currentPageData={currentPageData} />
                  </motion.div>
                ) : null}
              </div>
            </motion.div>

            {/* Animación de la paginación */}
            {results.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.5 }} 
                className="flex justify-center mt-4">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
