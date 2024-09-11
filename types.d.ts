interface Product {
    _id: string;
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

  interface Provider {
    _id: string;
    name: string;
    contactName?: string;
    address?: string;
    phone?: string;
    email?: string;
  }

  interface Customer {
    _id: string; 
    name: string; 
    email: string; 
    phone: string;
    address: {
      city: string
      state: string; 
    };
  }


interface LoginFormValues {
  email: string;
  password: string;
}

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder: string;
}

interface OptionsMenuProps {
  session: Session | null;
}

declare module 'mui-datatables';
