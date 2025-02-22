import { useEffect, useRef, useState } from "react";
import { useGetCompanyQuery } from "src/redux/services/company.Api";
import { useCreateInvoiceMutation , useUpdateInvoiceMutation } from "src/redux/services/invoices.Api";
import { useCreateExecutionOrderMutation  } from "src/redux/services/executionOrders.Api";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import {useBudgetSummary} from './../Budget/useBudgetSummary'
import { useCheckAvailabilityMutation, useUpdateProductQuantityMutation } from "src/redux/services/productsApi";
import { useSession } from "next-auth/react";
import { useGetBudgetByIdQuery } from "src/redux/services/budgets.Api";
import { useUpdateStateBudgetMutation } from "src/redux/services/budgets.Api";

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
    const [createInvoice, { isError: isErrorCreateInvoice}] = useCreateInvoiceMutation();
    const [createExecutionOrder] = useCreateExecutionOrderMutation();
    const [updateInvoice] = useUpdateInvoiceMutation();
    const router = useRouter();
    const [ivaPercentage, setIvaPercentage] = useState<number>(16); 
    const [igtfPercentage, setIgtfPercentage] = useState<number>(3); 
    const subtotal = calculateSubtotal(selectedServices);
    const calculatedIva = calculateIva(subtotal, ivaPercentage);
    const calculatedIgtf = calculateIgft((subtotal+calculatedIva), igtfPercentage);
    const total = calculateTotal((subtotal), calculatedIva, 0);
    const totalWithIgft = calculateTotal((subtotal), calculatedIva, calculatedIgtf);
    const [ updateProductQuantity ] = useUpdateProductQuantityMutation();
    const { data: session } = useSession();
    const [refBudget, setRefBudget] = useState<string | null>(null);
    const { data: budget } = useGetBudgetByIdQuery(refBudget!, { skip: !refBudget });
    const [ updateStateBudget ]  = useUpdateStateBudgetMutation();
    const [ checkAvailability ] = useCheckAvailabilityMutation();


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
        setRefBudget(null);
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
            toast.error("Falta el nombre del Administrador");
            throw new Error("Nombre del Administrador no definido");
        }
        
        if (!session?.user?.email) {
            toast.error("Falta el correo del Administrador");
            throw new Error("Correo del Administrador no definido");
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

    const handleSave = async (
        action: "draft" | "paid" | "pending",
        mode: "create" | "upload",
        invoice_id: string
      ) => {
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
              nameWorker: session!.user.name!,
              emailWorker: session!.user.email!,
              nameWorkerLeader: budget?.report?.form.nameWorker || session!.user.name!,
              emailWorkerLeader: budget?.report?.form.emailWorker || session!.user.email!,
            },
            company: { ...company },
            customer: { ...customerData },
            services: selectedServices.map((service) => ({
              ...service,
              products: service.products.map((product) => ({
                product: { ...product.product },
                quantity: product.quantity,
              })),
            })),
            description,
            state:
              action === "draft"
                ? "Borrador"
                : action === "paid"
                ? "Pagada"
                : "Pendiente",
            subtotal,
            ivaPercentage,
            igtfPercentage,
            calculatedIva,
            calculatedIgtf,
            total,
            totalWithIgft,
          };
      
          // 1. Validar disponibilidad en inventario sin modificar cantidades
          const productsToCheck = selectedServices.flatMap((service) =>
            service.products.map((product) => ({
              id: product.product._id,
              quantity: product.quantity,
            }))
          );
      
          if (mode === "create") {
            const { results } = await checkAvailability(productsToCheck).unwrap();
            const unavailableProducts = results.filter((product) => !product.available);
      
            if (unavailableProducts.length > 0) {
              unavailableProducts.forEach((product) => {
                toast.error(
                  `Stock insuficiente para ${product.name}. Disponible: ${product.currentQuantity ?? 0}`
                );
              });
              return;
            }
      
            // 2. Crear la factura
            try {
              await createInvoice(invoice).unwrap();
              toast.success("Factura creada exitosamente!");
            } catch (error) {
              toast.error("Error al crear la factura.");
              return;
            }
            // 3. Actualizar el estado del presupuesto
            if (refBudget !== null) {
              try {
                await updateStateBudget({ id: refBudget }).unwrap();
                toast.info("Se ha actualizado el estado del Presupuesto");
              } catch (updateError) {
                toast.error(
                  "Factura creada, pero ocurrió un error al actualizar el estado del Presupuesto"
                );
              }
            }
      
            // 4. Crear orden de ejecución si el estado es "Pendiente" o "Pagada"
            if (invoice.state === "Pendiente" || invoice.state === "Pagada") {
              const executionOrder: Omit<ExecutionOrder, "_id"> = {
                form: invoice.form,
                company: invoice.company,
                customer: invoice.customer,
                services: invoice.services,
                description: invoice.description,
                state: "En proceso",
              };
              try {
                await createExecutionOrder(executionOrder).unwrap();
                toast.success("Orden de ejecución creada exitosamente!");
              } catch (error) {
                toast.error("Error al crear la orden de ejecución.");
                return;
              }
            }
      
            // 5. Actualizar (restar) las cantidades usando el array completo
            const updates = productsToCheck.map((item) => ({
              id: item.id,
              quantity: item.quantity,
              operation: "subtract" as "subtract",
            }));
            try {
              await updateProductQuantity( updates ).unwrap();
              toast.info("Se han descontado los productos en almacén");
            } catch (error: any) {
              const typedError = error as ErrorResponse;
              toast.error(
                typedError?.data?.message ||
                  "Error desconocido al actualizar los productos"
              );
              return;
            }
          } else if (mode === "upload") {
            const invoiceWithId = {
              ...invoice,
              _id: invoice_id,
              form: {
                ...invoice.form,
                dateUpdate: Date.now(),
                nameWorker: session!.user.name!,
                emailWorker: session!.user.email!,
                nameWorkerLeader: budget?.report?.form.nameWorker || session!.user.name!,
                emailWorkerLeader: budget?.report?.form.emailWorker || session!.user.email!,
              },
            };
      
            try {
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
        extractFormData,
        setRefBudget
    };
};