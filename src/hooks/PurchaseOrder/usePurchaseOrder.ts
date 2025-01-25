import { useEffect, useRef, useState } from "react";
import { useGetCompanyQuery } from "src/redux/services/company.Api";
import { useCreatePurchaseOrderMutation, useUpdatePurchaseOrderMutation } from "src/redux/services/purchaseOrders.Api";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import {useBudgetSummary} from '../Budget/useBudgetSummary';

interface FormHandle {
    submitForm: () => Promise<FormPurchaseOrder | null>;
    submitFormProvider: () => Promise<Provider | null>;
    setForm: ( form : FormPurchaseOrder ) => void;
    setFormProvider: ( provider: Provider ) => void;
    getForm: () => FormPurchaseOrder | null;
    getFormProvider: () => Provider | null;
    resetFormProvider: () => void;
}

interface UsePurchaseOrderProps {
    mode?: "create" | "upload";
    purchaseOrderData?: PurchaseOrder | null;
}

export const usePurchaseOrder = ({ mode = "create", purchaseOrderData = null }: UsePurchaseOrderProps) => {

    const { calculateIgft, calculateIva, calculateTotal, calculateSubtotal } = useBudgetSummary();
    const formProviderRef = useRef<FormHandle | null>(null);
    const formRef = useRef<FormHandle | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
    const [currency, setCurrency] = useState<string>("$");
    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [description, setDescription] = useState<string>("");
    const { data: company, isLoading, isError } = useGetCompanyQuery();
    const [createPurchaseOrder] = useCreatePurchaseOrderMutation();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation();
    const [dateUpdate, setDateUpdate] = useState<Date | null>(null);
    const router = useRouter();
    const [ivaPercentage, setIvaPercentage] = useState<number>(16); // IVA predeterminado al 16%
    const [igtfPercentage, setIgtfPercentage] = useState<number>(3); // IGTF predeterminado al 3%
    const subtotal = 1000;//calculateSubtotal(selectedServices);
    const calculatedIva = calculateIva(subtotal, ivaPercentage);
    const calculatedIgtf = calculateIgft((subtotal+calculatedIva), igtfPercentage);
    const total = calculateTotal((subtotal), calculatedIva, 0);
    const totalWithIgft = calculateTotal((subtotal), calculatedIva, calculatedIgtf);
    // Inicializar datos si el modo es "update"
    useEffect(() => {
        if (mode === "upload" && purchaseOrderData) {
            handleSetForm(purchaseOrderData.form);
            handleSetFormProvider(purchaseOrderData.provider);
            setCurrency(purchaseOrderData.form.currency);
            setExchangeRate(purchaseOrderData.form.exchangeRate);
            // selectedProducts(purchaseOrderData.products);

            // if (budgetData.form.currency === "Bs" && budgetData.form.exchangeRate > 1) {
            //     const updatedOriginalServices = budgetData.services.map((service) => ({
            //         ...service,
            //         totalPrice: parseFloat((service.totalPrice / budgetData.form.exchangeRate).toFixed(2)),
            //         servicePrice: parseFloat((service.servicePrice / budgetData.form.exchangeRate).toFixed(2)),
            //         products: service.products.map((product) => ({
            //             ...product,
            //             product: {
            //                 ...product.product,
            //                 price: parseFloat((product.product.price / budgetData.form.exchangeRate).toFixed(2)),
            //             },
            //         })),
            //     }));

            //     setOriginalServices(updatedOriginalServices);
            // } else {
            //     setOriginalServices(budgetData.services);
            // }

            setIvaPercentage(purchaseOrderData.ivaPercentage || 16);
            setIgtfPercentage(purchaseOrderData.igtfPercentage || 3);
            setDescription(purchaseOrderData.description);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, purchaseOrderData]);

    // const resetValues = () => {
    //     setSelectedServices([]);
    //     setOriginalServices([]);
    //     setDescription("");
    //     if (formCustomerRef.current) {
    //         formCustomerRef.current.resetFormCustomer();
    //     }
    //     setIvaPercentage(16);
    //     setIgtfPercentage(3);
    // };

    const handleSetForm = (form : FormPurchaseOrder) => {
        formRef.current?.setForm(form);
    };

    const handleSetFormProvider = (provider : Provider) => {
        formProviderRef.current?.setFormProvider(provider);
    };

    const extractFormData = () => {
        const providerData = formProviderRef.current?.getFormProvider?.() || null;
        const form = formRef.current?.getForm?.() || null;
    
        return { providerData, form }; 
    };

    const extractFormDataAndValidate = async () => {

        while (!formProviderRef?.current || !formRef?.current) {
            await new Promise((resolve) => setTimeout(resolve, 50)); // Espera hasta que las referencias estén listas
        }
        const providerData = formProviderRef.current
            ? await formProviderRef.current?.submitFormProvider()
            : null;
    
        const form = formRef.current
            ? await formRef.current?.submitForm()
            : null;
        return { providerData, form }; // Devuelve los datos
    };

    // Función para validar los datos del presupuesto
    const validateBudget = async () => {
        const { providerData, form } = await extractFormDataAndValidate();
        if (!company) {
            toast.error("Faltan datos de la empresa");
            throw new Error("Datos de la empresa incompletos");
        }

        if (!providerData) {
            toast.error("Faltan datos del proveedor");
            throw new Error("Datos del proveedor incompletos");
        }

        if (!form) {
            toast.error("Faltan datos de las fechas");
            throw new Error("Datos de las fechas incompletos");
        }

        // if (selectedServices.length === 0) {
        //     toast.error("Agrega un servicio");
        //     throw new Error("No hay servicios seleccionados");
        // }

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
            providerData,
            form,
            company,
            //selectedServices,
            description,
            currency,
            exchangeRate,
        };
    };

    // Función principal para guardar el presupuesto
    const handleSave = async ( mode: "create" | "upload", purchaseOrder_id : string) => {
        setIsSaving(true);
        try {
            const {
                providerData,
                form,
                company,
                // selectedServices,
                description,
                currency,
                exchangeRate,
            } = await validateBudget();
    
            // Construcción del objeto `budget`
            const purchaseOrder: Omit<PurchaseOrder, "_id"> = {
                form: {
                    num: form.num,
                    dateCreation: form.dateCreation.toDate(),
                    dateUpdate: null,
                    currency,
                    exchangeRate,
                },
                company: { ...company },
                provider: { ...providerData },
                products: [],
                // products: selectedServices.map(service => ({
                //     ...service,
                //     products: service.products.map(product => ({
                //         product: { ...product.product },
                //         quantity: product.quantity,
                //     })),
                // })),
                description,
                state: "En Proceso",
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
                await createPurchaseOrder(purchaseOrder).unwrap();
                toast.success("Presupuesto creado exitosamente!");
            } else if (mode === "upload") {
                const purchaseOrderWithId = {
                    ...purchaseOrder,
                    _id: purchaseOrder_id,
                    form: {
                        ...purchaseOrder.form, 
                        dateUpdate: Date(),
                    }
                };
                
                await updatePurchaseOrder(purchaseOrderWithId).unwrap(); // Aquí usas la mutación de actualización
                router.push("/control/budgets");
                toast.success("Presupuesto actualizado exitosamente!");
            }
    
            //resetValues();
        } catch (error) {
            toast.error("Ha ocurrido un error");
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formProviderRef,
        formRef,
        // selectedServices,
        // setSelectedServices,
        // originalServices,
        // setOriginalServices,
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
        handleSetForm,
        handleSetFormProvider,
        handleSave,
        extractFormData
    };
};