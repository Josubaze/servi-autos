import { useEffect, useRef, useState } from "react";
import { useGetCompanyQuery } from "src/redux/services/company.Api";
import { useCreatePurchaseOrderMutation, useUpdatePurchaseOrderMutation } from "src/redux/services/purchaseOrders.Api";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import {useBudgetSummary} from '../Budget/useBudgetSummary';
import { useSession } from "next-auth/react";

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

    const { calculateIgft, calculateIva, calculateTotal, calculateSubtotalPurchaseOrder } = useBudgetSummary();
    const formProviderRef = useRef<FormHandle | null>(null);
    const formRef = useRef<FormHandle | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
    const [currency, setCurrency] = useState<string>("$");
    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [description, setDescription] = useState<string>("");
    const { data: company, isLoading, isError } = useGetCompanyQuery();
    const [createPurchaseOrder] = useCreatePurchaseOrderMutation();
    const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation();
    const [dateUpdate, setDateUpdate] = useState<Date | null>(null);
    const router = useRouter();
    const [ivaPercentage, setIvaPercentage] = useState<number>(16); // IVA predeterminado al 16%
    const [igtfPercentage, setIgtfPercentage] = useState<number>(3); // IGTF predeterminado al 3%
    const subtotal = calculateSubtotalPurchaseOrder(selectedProducts);
    const calculatedIva = calculateIva(subtotal, ivaPercentage);
    const calculatedIgtf = calculateIgft((subtotal+calculatedIva), igtfPercentage);
    const total = calculateTotal((subtotal), calculatedIva, 0);
    const totalWithIgft = calculateTotal((subtotal), calculatedIva, calculatedIgtf);
    const { data: session } = useSession();

    // Inicializar datos si el modo es "update"
    useEffect(() => {
        if (mode === "upload" && purchaseOrderData) {
            handleSetForm(purchaseOrderData.form);
            handleSetFormProvider(purchaseOrderData.provider);
            setCurrency(purchaseOrderData.form.currency);
            setExchangeRate(purchaseOrderData.form.exchangeRate);
            setSelectedProducts(purchaseOrderData.products);

            if (purchaseOrderData.form.currency === "Bs" && purchaseOrderData.form.exchangeRate > 1) {
                const updatedOriginalProducts =  purchaseOrderData.products.map((product) => ({
                        ...product,
                        price: parseFloat((product.price / purchaseOrderData.form.exchangeRate).toFixed(2)),
                    }));
                setOriginalProducts(updatedOriginalProducts);
            } else {
                setOriginalProducts(purchaseOrderData.products);
            }

            setIvaPercentage(purchaseOrderData.ivaPercentage || 16);
            setIgtfPercentage(purchaseOrderData.igtfPercentage || 3);
            setDescription(purchaseOrderData.description);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, purchaseOrderData]);

    const resetValues = () => {
        setSelectedProducts([]);
        setOriginalProducts([]);
        setDescription("");
        if (formProviderRef.current) {
            formProviderRef.current.resetFormProvider();
        }
        setIvaPercentage(16);
        setIgtfPercentage(3);
    };

    const handleSetForm = (form : FormPurchaseOrder) => {
        formRef.current?.setForm(form);
    };

    const handleSetFormProvider = (provider : Provider) => {
        formProviderRef.current?.setFormProvider(provider);
    };

    const extractFormData = () => {
        const providerData = formProviderRef.current?.getFormProvider?.() || null;
        let form = formRef.current?.getForm?.() || null;
      
        if (form) {
          form = {
            ...form,
            nameWorker: session!.user.name!,
            emailWorker: session!.user.email!
          };
        }
      
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

        if(selectedProducts.length === 0) {
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
            providerData,
            form,
            company,
            selectedProducts,
            description,
            currency,
            exchangeRate,
        };
    };

    // Función principal para guardar el presupuesto
    const handleSave = async (action: "draft" | "inProgress", mode: "create" | "upload", purchaseOrder_id : string) => {
        try {
            const {
                providerData,
                form,
                company,
                selectedProducts,
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
                    nameWorker: session!.user.name!,
                    emailWorker: session!.user.email!,
                },
                company: { ...company },
                provider: { ...providerData },
                products: selectedProducts,
                description,
                state: action === "draft" ? "Borrador" : action === "inProgress" ? "En Proceso" : "",
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
                try {
                    await createPurchaseOrder(purchaseOrder).unwrap();
                    toast.success("Orden de Compra creada exitosamente!");
                } catch (error) {
                    toast.error("Error al crear la Orden de Compra");
                    return;
                    
                }
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
                router.push("/control/purchase-orders");
                toast.success("Orden de Compra actualizada exitosamente!");
            }
    
            resetValues();
        } catch (error) {
            toast.error("Ha ocurrido un error");
        }
    };

    return {
        formProviderRef,
        formRef,
        selectedProducts,
        setSelectedProducts,
        originalProducts,
        setOriginalProducts,
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
        handleSetFormProvider,
        handleSave,
        extractFormData
    };
};