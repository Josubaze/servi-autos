import { useEffect, useRef, useState } from "react";
import { useGetCompanyQuery } from "src/redux/services/company.Api";
import { useCreateInvoiceMutation , useUpdateInvoiceMutation } from "src/redux/services/invoices.Api";
import { useCreateExecutionOrderMutation  } from "src/redux/services/executionOrders.Api";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import {useBudgetSummary} from './../Budget/useBudgetSummary'
import { useUpdateProductQuantityMutation } from "src/redux/services/productsApi";


interface FormHandle {
    submitForm: () => Promise<Form | null>;
    submitFormCustomer: () => Promise<Customer | null>;
    setForm: ( form : Form ) => void;
    setFormCustomer: ( customer: Customer ) => void;
    getForm: () => Form | null;
    getFormCustomer: () => Customer | null;
    resetFormCustomer: () => void;
}

interface UseInvoiceProps {
    mode?: "create" | "upload";
    invoiceData?: Invoice | null;
}

export const useInvoice = ({ mode = "create", invoiceData = null }: UseInvoiceProps) => {

    const { calculateIgft, calculateIva, calculateTotal, calculateSubtotal } = useBudgetSummary();
    const formCustomerRef = useRef<FormHandle | null>(null);
    const formRef = useRef<FormHandle | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [originalServices, setOriginalServices] = useState<Service[]>([]);
    const [currency, setCurrency] = useState<string>("$");
    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [description, setDescription] = useState<string>("");
    const { data: company, isLoading, isError } = useGetCompanyQuery();
    const [createInvoice] = useCreateInvoiceMutation();
    const [createExecutionOrder] = useCreateExecutionOrderMutation();
    const [updateInvoice] = useUpdateInvoiceMutation();
    const router = useRouter();
    const [ivaPercentage, setIvaPercentage] = useState<number>(16); // IVA predeterminado al 16%
    const [igtfPercentage, setIgtfPercentage] = useState<number>(3); // IGTF predeterminado al 3%
    const subtotal = calculateSubtotal(selectedServices);
    const calculatedIva = calculateIva(subtotal, ivaPercentage);
    const calculatedIgtf = calculateIgft((subtotal+calculatedIva), igtfPercentage);
    const total = calculateTotal((subtotal), calculatedIva, 0);
    const totalWithIgft = calculateTotal((subtotal), calculatedIva, calculatedIgtf);
    const [ updateProductQuantity ] = useUpdateProductQuantityMutation();


    // Inicializar datos si el modo es "update"
    useEffect(() => {
        if (mode === "upload" && invoiceData) {
            handleSetForm(invoiceData.form);
            handleSetFormCustomer(invoiceData.customer);
            setCurrency(invoiceData.form.currency);
            setExchangeRate(invoiceData.form.exchangeRate);
            setSelectedServices(invoiceData.services);

            if (invoiceData.form.currency === "Bs" && invoiceData.form.exchangeRate > 1) {
                const updatedOriginalServices = invoiceData.services.map((service) => ({
                    ...service,
                    totalPrice: parseFloat((service.totalPrice / invoiceData.form.exchangeRate).toFixed(2)),
                    servicePrice: parseFloat((service.servicePrice / invoiceData.form.exchangeRate).toFixed(2)),
                    products: service.products.map((product) => ({
                        ...product,
                        product: {
                            ...product.product,
                            price: parseFloat((product.product.price / invoiceData.form.exchangeRate).toFixed(2)),
                        },
                    })),
                }));

                setOriginalServices(updatedOriginalServices);
            } else {
                setOriginalServices(invoiceData.services);
            }
            setDescription(invoiceData.description);
            setIvaPercentage(invoiceData.ivaPercentage || 16);
            setIgtfPercentage(invoiceData.igtfPercentage || 3);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, invoiceData]);

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
        const form = formRef.current?.getForm?.() || null;
    
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

    const handleSave = async (action: "draft" | "paid" | "pending", mode: "create" | "upload", invoice_id: string) => {
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
    
            // Construcción del objeto `invoice`
            const invoice: Omit<Invoice, "_id"> = {
                form: {
                    num: form.num,
                    dateCreation: form.dateCreation.toDate(),
                    dateExpiration: form.dateExpiration.toDate(),
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
                state: action === "draft" ? "Borrador" : action === "paid" ? "Pagada" : "Pendiente",
                subtotal,
                ivaPercentage,
                igtfPercentage,
                calculatedIva,
                calculatedIgtf,
                total,
                totalWithIgft,
            };
    
            // Validar disponibilidad y restar cantidades antes de crear la factura
            for (const service of selectedServices) {
                for (const product of service.products) {
                    try {
                        await updateProductQuantity({
                            _id: product.product._id,
                            quantity: product.quantity,
                            operation: "subtract",
                        }).unwrap();
                    } catch (error: any) {
                        const typedError = error as ErrorResponse;
                        toast.error(
                            typedError?.data?.message
                                ? `${typedError.data.message} de: ${product.product.name}.`
                                : `Error desconocido al actualizar el producto: ${product.product.name}`
                        );
                        return; // Detener el proceso si hay error en el stock
                    }
                }
            }
    
            // Crear factura solo si el mode es "create"
            if (mode === "create") {
                try {
                    // Intentar crear la factura
                    await createInvoice(invoice).unwrap();
                    toast.success("Factura creada exitosamente!");
                } catch (error) {
                    toast.error("Error al crear la factura.");
                    return;
                }
    
                // Si la factura está en estado "Pendiente" o "Pagada", crear la orden de ejecución
                if (invoice.state === "Pendiente" || invoice.state === "Pagada") {
                    try {
                        const executionOrder: Omit<ExecutionOrder, "_id"> = {
                            form: invoice.form, // Usar los datos de la factura creada
                            company: invoice.company,
                            customer: invoice.customer,
                            services: invoice.services,
                            description: invoice.description,
                            state: "En proceso",
                        };
    
                        // Intentar crear la orden de ejecución
                        await createExecutionOrder(executionOrder).unwrap();
                        toast.success("Orden de ejecución creada exitosamente!");
                    } catch (error) {
                        toast.error("Error al crear la orden de ejecución.");
                        return;
                    }
                }
            } else if (mode === "upload") {
                const invoiceWithId = {
                    ...invoice,
                    _id: invoice_id,
                    form: {
                        ...invoice.form,
                        dateUpdate: Date.now(), // Actualiza la fecha
                    },
                };
    
                try {
                    // Intentar actualizar la factura
                    await updateInvoice(invoiceWithId).unwrap();
                    router.push("/control/invoices");
                    toast.success("Borrador actualizado exitosamente!");
                } catch (error) {
                    toast.error("Error al actualizar el borrador de la factura.");
                }
            }
    
        } catch (error) {
            toast.error("Ha ocurrido un error inesperado.");
        } finally {
            resetValues();
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
        extractFormData
    };
};