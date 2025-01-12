import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Pagination } from "@nextui-org/react";
import Link from "next/link";
import { CiLink } from "react-icons/ci";

interface MarketTableProps {
  currentPageData: MarketProduct[];
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
  handleSortToggle: () => void;
  sortMode: "asc" | "desc" | "unordered"; // Opciones de ordenación
}

export const MarketTable: React.FC<MarketTableProps> = ({
  currentPageData,
  totalPages,
  page,
  setPage,
  handleSortToggle,
  sortMode,
}) => {
  return (
    <div>
      <Table
        aria-label="Artículos encontrados en MercadoLibre"
        color="default"
        selectionMode="single"
        classNames={{ wrapper: "min-h-[222px] max-h-[600px]"}}
      >
        <TableHeader>
          <TableColumn key="title">Título</TableColumn>
          <TableColumn key="price" className="hover:cursor-pointer hover:bg-gray-600/40" onClick={handleSortToggle}>
            Precio {sortMode === "asc" ? "↑" : sortMode === "desc" ? "↓" : ""}
          </TableColumn>
          <TableColumn key="rating">Calificación</TableColumn>
          <TableColumn key="shipping">Envío</TableColumn>
          <TableColumn key="link">Enlace</TableColumn>
        </TableHeader>
        <TableBody items={currentPageData}>
          {(item) => (
            <TableRow key={item.permalink}>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                {`${item.currency} ${item.price}`}
              </TableCell>
              <TableCell>{item.rating}</TableCell>
              <TableCell>
                {item.shipping === "Envío gratis" ? (
                  <Chip color="success" size="sm" variant="flat">
                    {item.shipping}
                  </Chip>
                ) : (
                  <Chip size="sm" variant="flat">
                    {item.shipping}
                  </Chip>
                )}
              </TableCell>
              <TableCell>
                <Link href={item.permalink} target="_blank" rel="noopener noreferrer">
                  <button className="w-8 h-8 rounded-full bg-transparent flex justify-center items-center transition-all ease-in-out delay-150 hover:scale-110 hover:bg-gray-600/20 hover:text-indigo-500 duration-300">
                    <CiLink className="w-8 h-8 p-1" />
                  </button>
                </Link>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center mt-4">
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          total={totalPages}
          initialPage={page}
          onChange={setPage}
        />
      </div>
    </div>
  );
};
