interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    quantity: number;
    price: number;
  }

  interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  }

  interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    paginate: (pageNumber: number) => void;
    products: Product[];
  }


  
  