import { useRef, useState } from "react";
import { useGetCompanyQuery } from "src/redux/services/company.Api";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from 'next/navigation';
import {useBudgetSummary} from './../Budget/useBudgetSummary'
import { useUpdateProductQuantityMutation } from "src/redux/services/productsApi";
import { useCreateCreditNoteMutation, useUpdateCreditNoteMutation } from "src/redux/services/creditNotes.Api";

interface FormHandle {
    submitForm: () => Promise<FormCreditNote | null>;
    submitFormCustomer: () => Promise<Customer | null>;
    setForm: (form: FormCreditNote) => void;
    setFormCustomer: (customer: Customer) => void;
    getForm: () => FormCreditNote | null;
    getFormCustomer: () => Customer | null;
    resetFormCustomer: () => void;
}

interface UseCreditNoteProps {
    mode?: "create" | "update";
    creditNoteData?: CreditNote | null;
}

export const useCreditNote = () => {

    const { calculateIgft, calculateIva, calculateTotal, calculateSubtotal } = useBudgetSummary();
    const formCustomerRef = useRef<FormHandle | null>(null);
    const formRef = useRef<FormHandle | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [originalServices, setOriginalServices] = useState<Service[]>([]);
    const [currency, setCurrency] = useState<string>("$");
    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [description, setDescription] = useState<string>("");
    const { data: company, isLoading, isError } = useGetCompanyQuery();
    const [createCreditNote] = useCreateCreditNoteMutation();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [updateCreditNote] = useUpdateCreditNoteMutation();
    const [dateUpdate, setDateUpdate] = useState<Dayjs | null>(null);
    const router = useRouter();
    const [ivaPercentage, setIvaPercentage] = useState<number>(16); // IVA predeterminado al 16%
    const [igtfPercentage, setIgtfPercentage] = useState<number>(3); // IGTF predeterminado al 3%
    const subtotal = calculateSubtotal(selectedServices);
    const calculatedIva = calculateIva(subtotal, ivaPercentage);
    const calculatedIgtf = calculateIgft((subtotal+calculatedIva), igtfPercentage);
    const total = calculateTotal((subtotal), calculatedIva, 0);
    const totalWithIgft = calculateTotal((subtotal), calculatedIva, calculatedIgtf);
    const [updateProductQuantity ] = useUpdateProductQuantityMutation();
    // // Inicializar datos si el modo es "update"
    // useEffect(() => {
    //     if (mode === "update" && creditNoteData) {
    //         handleSetForm(creditNoteData.formCreditNote);
    //         handleSetFormCustomer(creditNoteData.customer);
    //         setCurrency(creditNoteData.formCreditNote.currency);
    //         setExchangeRate(creditNoteData.formCreditNote.exchangeRate);
    //         setSelectedServices(creditNoteData.services);

    //         if (creditNoteData.formCreditNote.currency === "Bs" && creditNoteData.formCreditNote.exchangeRate > 1) {
    //             const updatedOriginalServices = creditNoteData.services.map((service) => ({
    //                 ...service,
    //                 totalPrice: parseFloat((service.totalPrice / creditNoteData.formCreditNote.exchangeRate).toFixed(2)),
    //                 servicePrice: parseFloat((service.servicePrice / creditNoteData.formCreditNote.exchangeRate).toFixed(2)),
    //                 products: service.products.map((product) => ({
    //                     ...product,
    //                     product: {
    //                         ...product.product,
    //                         price: parseFloat((product.product.price / creditNoteData.formCreditNote.exchangeRate).toFixed(2)),
    //                     },
    //                 })),
    //             }));

    //             setOriginalServices(updatedOriginalServices);
    //         } else {
    //             setOriginalServices(creditNoteData.services);
    //         }
    //         setDescription(creditNoteData.description);
    //         setIvaPercentage(creditNoteData.ivaPercentage || 16);
    //         setIgtfPercentage(creditNoteData.igtfPercentage || 3);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [mode, creditNoteData]);

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

    const handleSetForm = (form : FormCreditNote) => {
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

    // Función principal para guardar la factura
    const handleSave = async () => {
        setIsSaving(true);
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
    
            // Construcción del objeto `creditNote`
            const creditNote: Omit<CreditNote, "_id"> = {
                form: {
                    n_creditNote: form.n_creditNote,
                    n_invoice: form.n_invoice,
                    dateCreation: dayjs(form.dateCreation).toDate(),
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
                subtotal,
                ivaPercentage,
                igtfPercentage,
                calculatedIva,
                calculatedIgtf,
                total,
                totalWithIgft,
            };
    
            // Actualizar cantidades de productos en la base de datos
            for (const service of selectedServices) {
                for (const product of service.products) {
                    try {
                        // Realizar una solicitud para sumar productos de nuevo al inventario
                        await updateProductQuantity({
                            _id: product.product._id,
                            quantity: product.quantity,
                            operation: "add", // Especificar que queremos sumar
                        }).unwrap();
                    } catch (error: any) {
                        const typedError = error as ErrorResponse;
                        // Verificar si el error tiene un mensaje
                        if (typedError?.data?.message) {
                            toast.error(`${typedError.data.message} de: ${product.product.name}.`);
                        } else {
                            toast.error(`Error desconocido al actualizar el producto: ${product.product.name}`);
                        }
                        setIsSaving(false);
                        return; // Salir de la función sin crear
                    }
                }
            }
    
            // Si todos los productos se actualizaron correctamente, crear la nota de crédito
            await createCreditNote(creditNote).unwrap();
            toast.success("Nota de crédito creada exitosamente!");
            resetValues();
        } catch (error) {
            toast.error("Ha ocurrido un error");
        } finally {
            setIsSaving(false);
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
        isSaving,
        handleSetForm,
        handleSetFormCustomer,
        handleSave,
        extractFormData
    };
};