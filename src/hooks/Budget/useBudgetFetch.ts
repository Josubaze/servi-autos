import { useRef, useState } from "react";
import { useGetCompanyQuery } from "src/redux/services/company.Api";
import { useCreateBudgetMutation } from "src/redux/services/budgets.Api";
import { toast } from "react-toastify";
import { useBudgetSubtotal } from "src/hooks/Budget/useBudgetSubtotal";
import dayjs from "dayjs";

interface BudgetFormHandle {
    submitForm: () => any;
    resetForm: () => void;
}

export const useBudgetFecth = () => {
    const formCustomerRef = useRef<BudgetFormHandle | null>(null);
    const formDateRef = useRef<BudgetFormHandle | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const subtotal = useBudgetSubtotal(selectedServices);
    const [currency, setCurrency] = useState<string>("$");
    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [description, setDescription] = useState<string>("");
    const { data: company, isLoading, isError } = useGetCompanyQuery();
    const [createBudget] = useCreateBudgetMutation();
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const resetValues = () => {
        setSelectedServices([]);
        setDescription("");
        if (formCustomerRef.current) {
            formCustomerRef.current.resetForm();
        }
    };

    // Función para validar los datos del presupuesto
    const validateBudget = async () => {
        const customerData = formCustomerRef.current
            ? await formCustomerRef.current.submitForm()
            : null;
        const dateData = formDateRef.current
            ? await formDateRef.current.submitForm()
            : null;

        if (!company) {
            toast.error("Faltan datos de la empresa");
            throw new Error("Datos de la empresa incompletos");
        }

        if (!customerData) {
            toast.error("Faltan datos del cliente");
            throw new Error("Datos del cliente incompletos");
        }

        if (!dateData) {
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
            dateData,
            company,
            selectedServices,
            description,
            currency,
            exchangeRate,
        };
    };

    // Función principal para guardar el presupuesto
    const handleSave = async (action: "draft" | "save") => {
        setIsSaving(true);
        try {
            const {
                customerData,
                dateData,
                company,
                selectedServices,
                description,
                currency,
                exchangeRate,
            } = await validateBudget();

            const budget: Omit<Budget, "_id"> = {
                n_budget: dateData.n_budget,
                dateCreation: dayjs(dateData.dateCreation).toDate(),
                dateExpiration: dayjs(dateData.dateExpiration).toDate(),
                currency,
                exchangeRate,
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
                state: action === 'draft' ? 'Borrador' : action === 'save' ? 'Aceptado' : '',
            };

            await createBudget(budget).unwrap();
            toast.success("Presupuesto creado exitosamente!");
            resetValues();
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formCustomerRef,
        formDateRef,
        selectedServices,
        setSelectedServices,
        subtotal,
        currency,
        setCurrency,
        exchangeRate,
        setExchangeRate,
        description,
        setDescription,
        company,
        isLoading,
        isError,
        isSaving,
        handleSave,
    };
};