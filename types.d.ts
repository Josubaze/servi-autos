interface Product {
    _id: string;
    name: string;
    description: string;
    vehicleType: string;
    category: string;
    quantity: number;
    price: number;
  }

  interface Company {
    _id: string;
    id_card: string;
    name: string;
    address: string;
    email: string;
    phone: string;
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

  interface Budget {
    _id: string;
    form: Form;
    company: Company;
    customer: Customer;
    services: Service[];
    description: string;
    state: string;
    subtotal: number;
    ivaPercentage: number;
    igtfPercentage: number;
    calculatedIva: number;
    calculatedIgtf: number;
    total: number;
    totalWithIgft: number;
  }
  
  interface Invoice {
    _id: string;
    form: Form;
    company: Company;
    customer: Customer;
    services: Service[];
    description: string;
    state: string;
    subtotal: number;
    ivaPercentage: number;
    igtfPercentage: number;
    calculatedIva: number;
    calculatedIgtf: number;
    total: number;
    totalWithIgft: number;
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
    onServiceSelect: (service: Service) => void;
    onCloseTable: () => void,
  }

  interface SelectRowProps {
    service: Service;
    onServiceSelect: (service: Service) => void;
  }


  interface Form{
    num: number;
    dateCreation: Dayjs;
    dateExpiration: Dayjs;
    dateUpdate: Dayjs;
    currency: string;
    exchangeRate: number;
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

  interface TableControlBudgetProps extends TableBaseProps {
    data: Budget[]; 
    selectedRange: RangeValue<DateValue> | null;
    handleView: (budget: Budget) => void;
    handleDelete: (budgetId: string) => void;
    handleUpdate: (budgetId: string) => void;
    handlePrint: (budget: Budget) => Promise<void>
    handleExportPDF: (budget: Budget) => Promise<void>
  }

  interface TableControlInvoiceProps extends TableBaseProps {
    data: Invoice[]; 
    selectedRange: RangeValue<DateValue> | null;
    handleView: (budget: Invoice) => void;
    handleDelete: (budgetId: string) => void;
    handleUpdate: (budgetId: string) => void;
    handlePrint: (budget: Invoice) => Promise<void>
    handleExportPDF: (budget: Invoice) => Promise<void>
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
