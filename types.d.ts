interface Product {
    _id: string;
    name: string;
    description: string;
    vehicleType: string;
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
    contactName: string;
    phone: string;
    email: string;
    address: {
      city: string
      state: string; 
    };
  }

  interface ProductServ {
    _id: string; 
    name: string; 
    category: string;
    price: number; 
}

  interface ProductInService {
      product: string; 
      quantity: number; 
  }


  interface Service {
    _id: string;
    name: string;
    servicePrice: number;
    products: ProductInService[];
  }


  interface TableServicesProps {
    data: Service[];
    searchTerm: string;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    handleDelete: (id: string) => void;
    handleEdit: (service: Service) => void;
  }

  interface RowProps {
    row: Service;
    handleEdit: (service: Service) => void;
    handleDelete: (id: string) => void;
  }

  interface ProductRowProps {
    product: { product: { _id: string; name: string; category: string; price: number }; quantity: number };
  }


  interface Customer {
    _id: string;
    id_card: string; 
    name: string; 
    email: string; 
    phone: string;
    address: {
      city: string
      state: string; 
    };
  }

  interface BudgetForm{
    n_budget: string;
    dateCreation: Dayjs;
    dateExpiration: Dayjs;
    currency: string;
  }

  interface TableBaseProps {
    searchTerm: string;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    isSuccess: boolean;
  }

  interface TableProductProps extends TableBaseProps {
    data: Product[];
    handleDelete: (productId: string) => void;
    handleEdit: (product: Product) => void;
  }
  
  interface TableCustomerProps extends TableBaseProps {
    data: Customer[]; 
    handleDelete: (customerId: string) => void;
    handleEdit: (customer: Customer) => void;
  }
  
  interface TableProviderProps extends TableBaseProps {
    data: Provider[]; 
    handleDelete: (providerId: string) => void;
    handleEdit: (provider: Provider) => void;
  }
  
  interface OptionsMenuProps {
    session: Session | null;
  }

  interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    placeholder: string;
  }



  interface LoginFormValues {
    email: string;
    password: string;
  }




declare module 'mui-datatables';
