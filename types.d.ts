
interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    quantity: number;
    price: number;
  }

  interface ProductSinId {
    name: string;
    description: string;
    category: string;
    quantity: number;
    price: number;
  }

  interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    secret_question: string;
    secret_answer: string;
    image?: string; 
  }

  interface UserSinId {
    username: string;
    email: string;
    password: string;
    role: string;
    secret_question: string;
    secret_answer: string;
  }

  interface ProductState {
    list: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string;
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
  }

  interface ButtonProps {
    children: ReactNode;
    size?: string;
    block?: boolean;
    outlined?: boolean;
    secondary?: boolean;
    success?: boolean;
    danger?: boolean;
    color?: string;
}

interface LoginFormValues {
  email: string;
  password: string;
}

interface OptionsMenuProps {
  session: Session | null;
}

declare module 'mui-datatables';
