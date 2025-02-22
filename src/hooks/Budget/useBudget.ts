import { useEffect, useRef, useState } from "react";
import { useGetCompanyQuery } from "src/redux/services/company.Api";
import { useCreateBudgetMutation, useUpdateBudgetMutation } from "src/redux/services/budgets.Api";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import {useBudgetSummary} from './useBudgetSummary'
import { useUpdateStateReportMutation } from "src/redux/services/reports.Api";
import { useSession } from "next-auth/react";
import { useCheckAvailabilityMutation } from "src/redux/services/productsApi";
import { ObjectId } from 'mongodb';

interface FormHandle {
    submitForm: () => Promise<Form | null>;
    submitFormCustomer: () => Promise<Customer | null>;
    setForm: ( form : Form ) => void;
    setFormCustomer: ( customer: Customer ) => void;
    getForm: () => Form | null;
    getFormCustomer: () => Customer | null;
    resetFormCustomer: () => void;
}

interface UseBudgetProps {
    mode?: "create" | "upload";
    budgetData?: Budget | null;
}

export const useBudget = ({ mode = "create", budgetData = null }: UseBudgetProps) => {

    const { calculateIgft, calculateIva, calculateTotal, calculateSubtotal } = useBudgetSummary();
    const formCustomerRef = useRef<FormHandle | null>(null);
    const formRef = useRef<FormHandle | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [originalServices, setOriginalServices] = useState<Service[]>([]);
    const [currency, setCurrency] = useState<string>("$");
    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [description, setDescription] = useState<string>("");
    const { data: company, isLoading, isError } = useGetCompanyQuery();
    const [createBudget] = useCreateBudgetMutation();
    const [updateBudget] = useUpdateBudgetMutation();
    const [dateUpdate, setDateUpdate] = useState<Date | null>(null);
    const router = useRouter();
    const [ivaPercentage, setIvaPercentage] = useState<number>(16); // IVA predeterminado al 16%
    const [igtfPercentage, setIgtfPercentage] = useState<number>(3); // IGTF predeterminado al 3%
    const subtotal = calculateSubtotal(selectedServices);
    const calculatedIva = calculateIva(subtotal, ivaPercentage);
    const calculatedIgtf = calculateIgft((subtotal+calculatedIva), igtfPercentage);
    const total = calculateTotal((subtotal), calculatedIva, 0);
    const totalWithIgft = calculateTotal((subtotal), calculatedIva, calculatedIgtf);
    const [refReport, setRefReport] = useState<string | null>(null);
    const [ updateStateReport ]  = useUpdateStateReportMutation();
    const { data: session } = useSession();
    const [ checkAvailability ] = useCheckAvailabilityMutation();

    // Inicializar datos si el modo es "update"
    useEffect(() => {
        if (mode === "upload" && budgetData) {
            handleSetForm(budgetData.form);
            handleSetFormCustomer(budgetData.customer);
            setCurrency(budgetData.form.currency);
            setExchangeRate(budgetData.form.exchangeRate);
            setSelectedServices(budgetData.services);

            if (budgetData.form.currency === "Bs" && budgetData.form.exchangeRate > 1) {
                const updatedOriginalServices = budgetData.services.map((service) => ({
                    ...service,
                    totalPrice: parseFloat((service.totalPrice / budgetData.form.exchangeRate).toFixed(2)),
                    servicePrice: parseFloat((service.servicePrice / budgetData.form.exchangeRate).toFixed(2)),
                    products: service.products.map((product) => ({
                        ...product,
                        product: {
                            ...product.product,
                            price: parseFloat((product.product.price / budgetData.form.exchangeRate).toFixed(2)),
                        },
                    })),
                }));

                setOriginalServices(updatedOriginalServices);
            } else {
                setOriginalServices(budgetData.services);
            }

            setIvaPercentage(budgetData.ivaPercentage || 16);
            setIgtfPercentage(budgetData.igtfPercentage || 3);
            setDescription(budgetData.description);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, budgetData]);

    const resetValues = () => {
        setSelectedServices([]);
        setOriginalServices([]);
        setDescription("");
        if (formCustomerRef.current) {
            formCustomerRef.current.resetFormCustomer();
        }
        setIvaPercentage(16);
        setIgtfPercentage(3);
    };

    const handleSetForm = (form : Form) => {
        formRef.current?.setForm(form);
    };

    const handleSetFormCustomer = (customer : Customer) => {
        formCustomerRef.current?.setFormCustomer(customer);
    };

    const extractFormData = () => {
        const customerData = formCustomerRef.current?.getFormCustomer?.() || null;
        let form = formRef.current?.getForm?.() || null;
      
        if (form) {
          form = {
            ...form,
            nameWorker: session!.user.name!,
            emailWorker: session!.user.email!
          };
        }
      
        return { customerData, form };
      };
      

    const extractFormDataAndValidate = async () => {

        while (!formCustomerRef?.current || !formRef?.current) {
            await new Promise((resolve) => setTimeout(resolve, 50)); // Espera hasta que las referencias estén listas
        }
        const customerData = formCustomerRef.current
            ? await formCustomerRef.current?.submitFormCustomer()
            : null;
    
        const form = formRef.current
            ? await formRef.current?.submitForm()
            : null;
        return { customerData, form }; // Devuelve los datos
    };

    // Función para validar los datos del presupuesto
    const validateBudget = async () => {
        const { customerData, form } = await extractFormDataAndValidate();
        
        if (!company) {
          toast.error("Faltan datos de la empresa");
          throw new Error("Datos de la empresa incompletos");
        }
      
        if (!customerData) {
          toast.error("Faltan datos del cliente");
          throw new Error("Datos del cliente incompletos");
        }
      
        if (!form) {
          toast.error("Faltan datos de las fechas");
          throw new Error("Datos de las fechas incompletos");
        }
      
        if (selectedServices.length === 0) {
          toast.error("Agrega un servicio");
          throw new Error("No hay servicios seleccionados");
        }
      
        if (!description || description.trim() === "") {
          toast.error("Falta agregar una descripción");
          throw new Error("Descripción vacía");
        }
      
        if (ivaPercentage <= 0) {
          toast.error("El IVA debe ser mayor a 0");
          throw new Error("IVA inválido");
        }
      
        if (igtfPercentage <= 0) {
          toast.error("El IGTF debe ser mayor a 0");
          throw new Error("IGTF inválido");
        }
      
        // Validar que los datos del trabajador estén definidos
        if (!session?.user?.name) {
          toast.error("Falta el nombre del trabajador");
          throw new Error("Nombre del trabajador no definido");
        }
        
        if (!session?.user?.email) {
          toast.error("Falta el correo del trabajador");
          throw new Error("Correo del trabajador no definido");
        }
      
        return {
          customerData,
          form,
          company,
          selectedServices,
          description,
          currency,
          exchangeRate,
        };
      };
      
    // Función principal para guardar el presupuesto
    const handleSave = async (action: "draft" | "approved", mode: "create" | "upload", budget_id: string) => {
        try {
            const {
                customerData,
                form,
                company,
                selectedServices,
                description,
                currency,
                exchangeRate,
            } = await validateBudget();
    
            // Extraer productos para verificar disponibilidad
            const productsToCheck = selectedServices.flatMap(service =>
                service.products.map(product => ({
                    id: product.product._id,
                    quantity: product.quantity,
                }))
            );
    
            // Validar disponibilidad en inventario
            if (mode === "create") {
                const { results } = await checkAvailability(productsToCheck).unwrap();
                const unavailableProducts = results.filter(product => !product.available);
    
                if (unavailableProducts.length > 0) {
                    unavailableProducts.forEach(product => {
                        toast.error(
                            `Stock insuficiente para ${product.name}. Disponible: ${product.currentQuantity ?? 0}`
                        );
                    });
                    return;
                }
            }
    
            // Construcción del objeto `budget`
            const budget: Omit<BudgetCreate, "_id"> = {
                form: {
                    num: form.num,
                    dateCreation: form.dateCreation.toDate(),
                    dateExpiration: form.dateExpiration.toDate(),
                    dateUpdate: null,
                    currency,
                    exchangeRate,
                    nameWorker: session!.user.name!,
                    emailWorker: session!.user.email!,
                },
                company: { ...company },
                customer: { ...customerData },
                services: selectedServices.map(service => ({
                    ...service,
                    products: service.products.map(product => ({
                        product: { ...product.product },
                        quantity: product.quantity,
                    })),
                })),
                description,
                state: action === "draft" ? "Borrador" : action === "approved" ? "Aprobado" : "",
                subtotal,
                ivaPercentage,
                igtfPercentage,
                calculatedIva,
                calculatedIgtf,
                total,
                totalWithIgft,
                ...(refReport ? { report: refReport } : {}) 
            };
    
            // Crear o Actualizar según `mode`
            if (mode === "create") {
                await createBudget(budget).unwrap();
    
                if (refReport !== null) {
                    try {
                        await updateStateReport({ id: refReport }).unwrap();
                        toast.info("Se ha actualizado el estado del Informe");
                    } catch (updateError) {
                        toast.error("Presupuesto creado, pero ocurrió un error al actualizar el estado del informe");
                    }
                }
                toast.success("Presupuesto creado exitosamente!");
            } else if (mode === "upload") {
                const budgetWithId = {
                    ...budget,
                    _id: budget_id,
                    form: {
                        ...budget.form,
                        dateUpdate: new Date(), 
                    },
                };
    
                await updateBudget(budgetWithId).unwrap();
                router.push("/control/budgets");
                toast.success("Presupuesto actualizado exitosamente!");
            }
    
            resetValues();
        } catch (error) {
            toast.error("Ha ocurrido un error");
        }
    };
    
    


    return {
        formCustomerRef,
        formRef,
        selectedServices,
        setSelectedServices,
        originalServices,
        setOriginalServices,
        subtotal,
        currency,
        setCurrency,
        exchangeRate,
        setExchangeRate,
        description,
        setDescription,
        company,
        dateUpdate,
        setDateUpdate,
        ivaPercentage, 
        setIvaPercentage,
        igtfPercentage, 
        setIgtfPercentage,
        calculatedIva,
        calculatedIgtf,
        total,
        totalWithIgft,
        isLoading,
        isError,
        handleSetForm,
        handleSetFormCustomer,
        handleSave,
        extractFormData,
        refReport,
        setRefReport,
    };
};