import { useEffect, useRef, useState } from "react";
import { useGetCompanyQuery } from "src/redux/services/company.Api";
import { useCreateBudgetMutation, useUpdateBudgetMutation } from "src/redux/services/budgets.Api";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from 'next/navigation';
import {useBudgetSummary} from './useBudgetSummary'


interface BudgetFormHandle {
    submitFormDateBudget: () => Promise<BudgetForm | null>;
    submitFormCustomer: () => Promise<Customer | null>;
    setFormDateBudget: ( budgetForm : BudgetForm ) => void;
    setFormCustomer: ( customer: Customer ) => void;
    getFormDateBudget: () => BudgetForm | null;
    getFormCutomer: () => Customer | null;
    resetFormCustomer: () => void;
}

interface UseBudgetProps {
    mode?: "create" | "update";
    budgetData?: Budget | null;
}

export const useBudget = ({ mode = "create", budgetData = null }: UseBudgetProps) => {

    const { calculateIgft, calculateIva, calculateTotal, calculateSubtotal } = useBudgetSummary();
    const formCustomerRef = useRef<BudgetFormHandle | null>(null);
    const formDateRef = useRef<BudgetFormHandle | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [originalServices, setOriginalServices] = useState<Service[]>([]);
    const [currency, setCurrency] = useState<string>("$");
    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [description, setDescription] = useState<string>("");
    const { data: company, isLoading, isError } = useGetCompanyQuery();
    const [createBudget] = useCreateBudgetMutation();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [updateBudget] = useUpdateBudgetMutation();
    const [dateUpdate, setDateUpdate] = useState<Dayjs | null>(null);
    const router = useRouter();
    const [ivaPercentage, setIvaPercentage] = useState<number>(16); // IVA predeterminado al 16%
    const [igtfPercentage, setIgtfPercentage] = useState<number>(3); // IGTF predeterminado al 3%
    const subtotal = calculateSubtotal(selectedServices);
    const calculatedIva = calculateIva(subtotal, ivaPercentage);
    const calculatedIgtf = calculateIgft((subtotal+calculatedIva), igtfPercentage);
    const total = calculateTotal((subtotal), calculatedIva, 0);
    const totalWithIgft = calculateTotal((subtotal), calculatedIva, calculatedIgtf);
    // Inicializar datos si el modo es "update"
    useEffect(() => {
        if (mode === "update" && budgetData) {
            handleSetFormDate(budgetData.budgetForm);
            handleSetFormCustomer(budgetData.customer);
            setSelectedServices(budgetData.services);
            setDescription(budgetData.description);
            setIvaPercentage(budgetData.ivaPercentage || 16);
            setIgtfPercentage(budgetData.igtfPercentage || 3);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, budgetData]);

    const resetValues = () => {
        setSelectedServices([]);
        setDescription("");
        if (formCustomerRef.current) {
            formCustomerRef.current.resetFormCustomer();
        }
        setIvaPercentage(16);
        setIgtfPercentage(3);
    };

    const handleSetFormDate = (budgetForm : BudgetForm) => {
        formDateRef.current?.setFormDateBudget(budgetForm);
    };

    const handleSetFormCustomer = (customer : Customer) => {
        formCustomerRef.current?.setFormCustomer(customer);
    };

    const extractFormData = () => {
        const customerData = formCustomerRef.current
            ? formCustomerRef.current.getFormCutomer()
            : null;
    
        const budgetForm = formDateRef.current
            ? formDateRef.current.getFormDateBudget()
            : null;
    
        return { customerData, budgetForm }; 
    };

    const extractFormDataAndValidate = async () => {
        const customerData = formCustomerRef.current
            ? await formCustomerRef.current.submitFormCustomer()
            : null;
    
        const budgetForm = formDateRef.current
            ? await formDateRef.current.submitFormDateBudget()
            : null;
    
        return { customerData, budgetForm }; // Devuelve los datos
    };
    

    // Función para validar los datos del presupuesto
    const validateBudget = async () => {
        const { customerData, budgetForm } = await extractFormDataAndValidate();

        if (!company) {
            toast.error("Faltan datos de la empresa");
            throw new Error("Datos de la empresa incompletos");
        }

        if (!customerData) {
            toast.error("Faltan datos del cliente");
            throw new Error("Datos del cliente incompletos");
        }

        if (!budgetForm) {
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

        return {
            customerData,
            budgetForm,
            company,
            selectedServices,
            description,
            currency,
            exchangeRate,
        };
    };

    // Función principal para guardar el presupuesto
    const handleSave = async (action: "draft" | "accepted", mode: "create" | "update", budget_id : string) => {
        setIsSaving(true);
        try {
            const {
                customerData,
                budgetForm,
                company,
                selectedServices,
                description,
                currency,
                exchangeRate,
            } = await validateBudget();
    
            // Construcción del objeto `budget`
            const budget: Omit<Budget, "_id"> = {
                budgetForm: {
                    n_budget: budgetForm.n_budget,
                    dateCreation: dayjs(budgetForm.dateCreation).toDate(),
                    dateExpiration: dayjs(budgetForm.dateExpiration).toDate(),
                    dateUpdate: null,
                    currency,
                    exchangeRate,
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
                state: action === "draft" ? "Borrador" : action === "accepted" ? "Aceptado" : "",
                subtotal,
                ivaPercentage,
                igtfPercentage,
                calculatedIva,
                calculatedIgtf,
                total,
                totalWithIgft,
            };
    
            // Crear o Actualizar según `mode`
            if (mode === "create") {
                await createBudget(budget).unwrap();
                toast.success("Presupuesto creado exitosamente!");
            } else if (mode === "update") {
                const budgetWithId = {
                    ...budget,
                    _id: budget_id,
                    budgetForm: {
                        ...budget.budgetForm, // Asegúrate de mantener las propiedades existentes de `budgetForm`
                        dateUpdate: dayjs().toDate(), // Actualiza la fecha
                    }
                };
                
                await updateBudget(budgetWithId).unwrap(); // Aquí usas la mutación de actualización
                router.push("/control/budgets");
                toast.success("Presupuesto actualizado exitosamente!");
            }
    
            resetValues();
        } catch (error) {
            toast.error("Ha ocurrido un error");
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formCustomerRef,
        formDateRef,
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
        isSaving,
        handleSetFormDate,
        handleSetFormCustomer,
        handleSave,
        extractFormData
    };
};