import { useEffect, useRef, useState } from "react";
import { useGetCompanyQuery } from "src/redux/services/company.Api";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import {useBudgetSummary} from './../Budget/useBudgetSummary'
import { useUpdateProductQuantityMutation } from "src/redux/services/productsApi";
import { useCreateCreditNoteMutation } from "src/redux/services/creditNotes.Api";
import { useSession } from "next-auth/react";

interface FormHandle {
    submitForm: () => Promise<FormCreditNote | null>;
    submitFormCustomer: () => Promise<Customer | null>;
    setForm: (form: Omit<FormCreditNote, 'num'>) => void;
    setFormCustomer: (customer: Customer) => void;
    getForm: () => FormCreditNote | null;
    getFormCustomer: () => Customer | null;
    resetFormCustomer: () => void;
}

interface UseCreditNoteProps {
    mode?: "create" | "upload";
    invoiceData?: Invoice | null;
}

export const useCreditNote = ({ mode = "create", invoiceData = null }: UseCreditNoteProps) => {

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
    const [dateUpdate, setDateUpdate] = useState<Date | null>(null);
    const [ivaPercentage, setIvaPercentage] = useState<number>(16); // IVA predeterminado al 16%
    const [igtfPercentage, setIgtfPercentage] = useState<number>(3); // IGTF predeterminado al 3%
    const subtotal = calculateSubtotal(selectedServices);
    const calculatedIva = calculateIva(subtotal, ivaPercentage);
    const calculatedIgtf = calculateIgft((subtotal+calculatedIva), igtfPercentage);
    const total = calculateTotal((subtotal), calculatedIva, 0);
    const totalWithIgft = calculateTotal((subtotal), calculatedIva, calculatedIgtf);
    const [updateProductQuantity ] = useUpdateProductQuantityMutation();
    const router = useRouter();
    const { data: session } = useSession();

    // // Inicializar datos si el modo es "update"
    useEffect(() => {
        if (mode === "upload" && invoiceData) {
            handleSetForm({
                numInvoice: invoiceData.form.num,
                dateCreation: Date(),
                currency: invoiceData.form.currency,  // act estado del form
                exchangeRate: invoiceData.form.exchangeRate,
            });
            handleSetFormCustomer(invoiceData.customer);
            setCurrency(invoiceData.form.currency); // act estado del padre para sincro.
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
            setDescription("");
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

    const handleSetForm = (form : Omit<FormCreditNote, 'num'>) => {
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
            toast.error("Falta agregar el motivo o descripción");
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

    // Función principal para guardar la nota
    const handleSave = async () => {
        try {
            // 1. Validar datos del presupuesto
            const {
                customerData,
                form,
                company,
                selectedServices,
                description,
                currency,
                exchangeRate,
            } = await validateBudget();
    
            // 2. Construcción del objeto `creditNote`
            const creditNote: Omit<CreditNote, "_id"> = {
                form: {
                    num: form.num,
                    numInvoice: form.numInvoice,
                    dateCreation: form.dateCreation.toDate(),
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
                subtotal,
                ivaPercentage,
                igtfPercentage,
                calculatedIva,
                calculatedIgtf,
                total,
                totalWithIgft,
            };
    
            // 3. Intentar crear la nota de crédito en la base de datos
            try {
                await createCreditNote(creditNote).unwrap();
                toast.success("Nota de crédito creada exitosamente!");
            } catch (error: any) {
                toast.error("Error al crear la nota de crédito");
                return; // Si falla la creación, detener el proceso
            }
    
            // 4. Crear el array de actualizaciones para devolver los productos al inventario
            const updates = selectedServices.flatMap((service) =>
                service.products.map((product) => ({
                    id: product.product._id,
                    quantity: product.quantity,
                    operation: "add" as "add", // Especificar que queremos sumar de vuelta
                }))
            );
    
            // 5. Intentar actualizar los productos en el almacén
            try {
                await updateProductQuantity(updates).unwrap();
                toast.success("Los productos han sido devueltos al almacén correctamente.");
            } catch (error: any) {
                const typedError = error as ErrorResponse;
                toast.error(
                    typedError?.data?.message || "Error desconocido al actualizar los productos"
                );
            }
    
            // 6. Redirigir y resetear valores solo si todo salió bien
            router.push("/control/credit-note");
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
        extractFormData
    };
};