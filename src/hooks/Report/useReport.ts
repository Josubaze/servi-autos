import { useEffect, useRef, useState } from "react";
import { useGetCompanyQuery } from "src/redux/services/company.Api";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { useCreateReportMutation, useUpdateReportMutation } from "src/redux/services/reports.Api";
import { useCheckAvailabilityMutation } from "src/redux/services/productsApi";

interface FormHandle {
    submitForm: () => Promise<FormReport | null>;
    submitFormCustomer: () => Promise<Customer | null>;
    setForm: ( form : FormReport ) => void;
    setFormCustomer: ( customer: Customer ) => void;
    getForm: () => FormReport | null;
    getFormCustomer: () => Customer | null;
    resetFormCustomer: () => void;
}

interface UseReportProps {
    mode?: "create" | "upload";
    reportData?: ReportWork | null;
}

export const useReport = ({ mode = "create", reportData = null }: UseReportProps) => {

    const formCustomerRef = useRef<FormHandle | null>(null);
    const formRef = useRef<FormHandle | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [originalServices, setOriginalServices] = useState<Service[]>([]);
    const [description, setDescription] = useState<string>("");
    const { data: company, isLoading, isError } = useGetCompanyQuery();
    const [createReport] = useCreateReportMutation();
    const [updateReport] = useUpdateReportMutation();
    const [dateUpdate, setDateUpdate] = useState<Date | null>(null);
    const router = useRouter();
      const [ checkAvailability ] = useCheckAvailabilityMutation();


    // Inicializar datos si el modo es "update"
    useEffect(() => {
        if (mode === "upload" && reportData) {
            handleSetFormCustomer(reportData.customer);
            handleSetForm(reportData.form);
            setSelectedServices(reportData.services);
            setOriginalServices(reportData.services);       
            setDescription(reportData.description);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, reportData]);

    const resetValues = () => {
        setSelectedServices([]);
        setOriginalServices([]);
        setDescription("");
        if (formCustomerRef.current) {
            formCustomerRef.current.resetFormCustomer();
        }
    };

    const handleSetForm = (form : FormReport) => {
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

        return {
            customerData,
            form,
            company,
            selectedServices,
            description,
        };
    };

    // Función principal para guardar el informe
    const handleSave = async (mode: "create" | "upload", report_id: string) => {
        try {
            const {
                customerData,
                form,
                company,
                selectedServices,
                description,
            } = await validateBudget();
    
            const productsToCheck = selectedServices.flatMap(service =>
                service.products.map(product => ({
                    id: product.product._id, 
                    quantity: product.quantity,
                }))
            );
    
            const { results } = await checkAvailability(productsToCheck).unwrap();
            const unavailableProducts = results.filter(product => !product.available);
    
            if (unavailableProducts.length > 0) {
                unavailableProducts.forEach(product => {
                    toast.error(
                        `Stock insuficiente para ${product.name}. Disponible: ${product.currentQuantity ?? 0}`
                    );
                });
                return; // 🚨 Salir sin crear el informe
            }
    
            const report: Omit<ReportWork, "_id"> = {
                form: {
                    num: form.num,
                    dateCreation: form.dateCreation.toDate(),
                    dateUpdate: null,
                    nameWorker: form.nameWorker,
                    emailWorker: form.emailWorker,
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
                state: "Sin Presupuestar"
            };
    
            if (mode === "create") {
                await createReport(report).unwrap();
                toast.success("Informe creado exitosamente!");
            } else if (mode === "upload") {
                const reportWithId = {
                    ...report,
                    _id: report_id,
                    form: {
                        ...report.form,
                        dateUpdate: new Date(), // ✅ Actualiza la fecha
                    }
                };
    
                await updateReport(reportWithId).unwrap();
                router.push("/control/reports");
                toast.success("Informe actualizado exitosamente!");
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
        description,
        setDescription,
        company,
        dateUpdate,
        setDateUpdate,
        isLoading,
        isError,
        handleSetForm,
        handleSetFormCustomer,
        handleSave,
        extractFormData
    };
};