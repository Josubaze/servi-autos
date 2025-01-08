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

  interface CreditNote {
    _id: string;
    form: FormCreditNote;
    company: Company;
    customer: Customer;
    services: Service[];
    description: string;
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

  interface FormCreditNote{
    num: number;
    numInvoice: number;
    dateCreation: Dayjs;
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
    handleStateUpdate: (budgetId: string) => void;
    handlePrint: (budget: Budget) => Promise<void>
    handleExportPDF: (budget: Budget) => Promise<void>
  }

  interface TableControlInvoiceProps extends TableBaseProps {
    data: Invoice[]; 
    selectedRange: RangeValue<DateValue> | null;
    handleView: (invoice: Invoice) => void;
    handleDelete: (invoiceId: string) => void;
    handleUpdate: (invoiceId: string) => void;
    handleUpload: (invoiceId: string) => void;
    handleStateUpdate: (invoiceId: string) => void;
    handlePrint: (invoice: Invoice) => Promise<void>
    handleExportPDF: (invoice: Invoice) => Promise<void>
  }

  interface TableControlCreditNoteProps extends TableBaseProps {
    data: CreditNote[]; 
    selectedRange: RangeValue<DateValue> | null;
    handleView: (creditNote: CreditNote) => void;
    handleDelete: (creditNoteId: string) => void;
    handlePrint: (creditNote: CreditNote) => Promise<void>
    handleExportPDF: (creditNote: CreditNote) => Promise<void>
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


interface ErrorResponse {
  data: {
    message: string;
  };
  status: number;
}

declare module 'mui-datatables';
