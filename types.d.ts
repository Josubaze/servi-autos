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
    id_card: string;
    name: string;
    contactName: string;
    phone: string;
    email: string;
    address: string;
  }

  interface Customer {
    _id: string;
    id_card: string; 
    name: string; 
    email: string; 
    phone: string;
    address: string;
  }

  interface ProductInService {
    product: {
      _id: string;
      name: string;
      category: string;
      price: number;
    };
    quantity: number;
  }

  interface Service {
    _id: string;
    name: string;
    serviceQuantity: number;
    servicePrice: number;
    products: ProductInService[];
    totalPrice: number;
  }

  interface ProductInServiceCreate {
    product: string;
    quantity: number;
  }

  interface ServiceCreate {
    _id: string;
    name: string;
    serviceQuantity: number;
    servicePrice: number;
    products: ProductInServiceCreate[];
    totalPrice: number;
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
    service: Service;
    handleEdit: (service: Service) => void;
    handleDelete: (id: string) => void;
  }

  interface ProductRowProps { 
    product: { 
      _id: string; 
      name: string; 
      category: string; 
      price: number 
    }; 
    quantity: number 
  }

  interface SelectServicesProps {
    data: Service[];
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    handleSelect: (service: Service) => void;
    onCloseTable: () => void,
  }

  interface SelectRowProps {
    service: Service;
    handleSelect: (service: Service) => void;
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


  
interface ProductTableProps {
  productos: ProductInService[];
  servicePrice: number;
  onServicePriceChange: (newPrice: number) => void;
  onProductQuantityChange: (productId: string, newQuantity: number) => void;
  onProductDelete: (productId: string) => void;
  onProductTableVisible: () => void,
}


declare module 'mui-datatables';
