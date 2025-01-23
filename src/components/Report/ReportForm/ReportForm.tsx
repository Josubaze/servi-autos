import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReportFormSchema } from 'src/utils/validation.zod';
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"; 
import { Loading } from "src/components/Common/Loading";
import { MarketModal } from "src/components/Common/MarketModal";
import { useCalendarDate } from 'src/hooks/useCalendarDate';
import { getLocalTimeZone, now } from "@internationalized/date";
import { DatePicker, Divider,  Spinner } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { OptionsCreditNoteForm } from '../../CreditNote/OptionsCreditNoteForm';
import { useGetReportsQuery } from 'src/redux/services/reports.Api';
import { useSession } from 'next-auth/react';
import { SelectReports } from 'src/components/Common/SelectReports';
import { Dispatch, SetStateAction } from 'react';
import { get } from 'http';


interface ReportFormProps {
    setSelectedServices: Dispatch<SetStateAction<Service[]>>; 
    setOriginalServices: Dispatch<SetStateAction<Service[]>>; 
    handleSetFormCustomer: (customer: Customer) => void; 
    setDescription: (description: string) => void; 
    mode: string;
  }   
export const ReportForm = forwardRef(({ 
    handleSetFormCustomer,
    setDescription,
    setSelectedServices,
    setOriginalServices,
    mode
}: ReportFormProps, ref) => {
    const today = now(getLocalTimeZone());
    const { data: reports = [], isSuccess, isLoading, isFetching, isError } = useGetReportsQuery();  
    const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
    const [showMarket, setShowMarket] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [localNum, setLocalNum] = useState<number | undefined>(undefined);
    const { transformToCalendarDate } = useCalendarDate();
    const { data: session } = useSession();

    const { 
        getValues, 
        setValue, 
        trigger, 
        watch 
    } = useForm<FormReport>({
        resolver: zodResolver(ReportFormSchema), 
        defaultValues: {
            num: 0, 
            dateCreation: today,
            nameWorker: session?.user?.name || "", 
            emailWorker: session?.user?.email || "",
        }
    });

    // // Función para cargar el presupuesto y convertir si es necesario
    const handleReportSelect = (report: ReportWork) => {
        if (!report) return;

        setIsUpdating(true); // Activar el loading al inicio

        setTimeout(() => {
            handleSetFormCustomer(report.customer);
            setSelectedServices(report.services);
            setOriginalServices(report.services);
            setDescription(report.description);
            setIsTableVisible(false);
            setIsUpdating(false); 
        }, 500); // Simulamos un pequeño delay de 500ms
    };

    // Exponer método para validar el formulario desde el padre
    const submitForm = async () => {
        const isFormValid = await trigger();
        return isFormValid ? getValues() : null;
    };

    const getForm = () => {
        return getValues(); // Retorna los valores actuales del formulario
    };

    // Función setFormDate para actualizar los datos
    const setForm = (formReport: FormReport) => {
        setValue("num", formReport.num);
        setValue("nameWorker", formReport.nameWorker);
        setValue("emailWorker", formReport.emailWorker);
        setValue("dateCreation", transformToCalendarDate(formReport.dateCreation));
    };
    
    useImperativeHandle(ref, () => ({
        setForm,
        submitForm,
        getForm,
    }));

    useEffect(() => {
        if (mode === "upload" || !isSuccess){
            setLocalNum(getValues("num"));
            return; 
        } 

        if (isSuccess) {
            const maxReport = reports.length > 0
            ? Math.max(...reports.map(report => report.form.num)) // Obtener el mayor valor de n_budget
            : 0; 

            const nextNum = maxReport + 1;
            setLocalNum(nextNum); 
            setValue("num", nextNum);   
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, reports, isSuccess]);
    

    return (
        <>
        <OptionsCreditNoteForm 
            setIsTableVisible={setIsTableVisible} 
            setShowMarket={setShowMarket}>
        </OptionsCreditNoteForm>

        <form className="w-full pt-4 sm:pl-6">
            <div className="bg-black-nav/50 rounded-lg p-4">
                <div className="grid gap-y-4 w-full">
                    {/* Nº de informe */}
                    <div className="w-full h-14 pt-4 text-xl font-bold flex items-center justify-start gap-x-2">
                        <p>Informe Nº</p>
                        {/* Verificamos si está cargando o si el valor de num es undefined */}
                        {isLoading || localNum === undefined ? (
                            <div className="flex items-center justify-center">
                                <Spinner color="secondary" size="sm" />
                            </div>
                        ) : (
                            <p>{localNum}</p> // Mostramos el valor local de num
                        )}
                    </div>

                    {/* datos del trabajador */}
                    <Divider orientation='horizontal'></Divider>
                    <div className='grid gap-y-2 w-full'>
                        <p className='text-xl font-bold pb-0.5'>Realizado por:</p>
                        <p className="text-md font-semibold pl-4">{`Nombre: ${getValues('nameWorker')}`}</p>
                        <p className="text-md font-semibold pl-4">{`Correo Electrónico: ${getValues('emailWorker')}`}</p>
                    </div>
                    <Divider orientation='horizontal'></Divider>

                    {/* Fecha de creación */}
                    <div className="flex flex-col w-full  sm:items-center">
                        <I18nProvider locale="es">                 
                            <DatePicker
                                label="Fecha de Creación"
                                size='md'
                                variant='underlined'
                                hideTimeZone
                                granularity="day"
                                showMonthAndYearPickers
                                value={watch("dateCreation")}
                                onChange={(newValue) => setValue("dateCreation", newValue)}
                                className="w-full"
                                aria-labelledby="dateCreation"
                            />
                        </I18nProvider>
                    </div>

                </div>
            </div>
        </form>
        {/* Modal para la tabla de selección de informe */}
        {isTableVisible && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                <SelectReports
                    data={reports}
                    isLoading={isLoading}
                    isError={isError}
                    isFetching={isFetching}
                    isSuccess={isSuccess}
                    onSelectReport={handleReportSelect}
                    onCloseTable={() => setIsTableVisible(false)}
                />
            </div>
        )}

        {isUpdating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                  <Loading />
                </div>
        )}
        {
            showMarket && (
                <MarketModal isOpen={showMarket} onClose={() => setShowMarket(false)}></MarketModal>
            )
        }
        </>
    );
});

// Agrega el displayName para evitar el error de ESLint
ReportForm.displayName = 'ReportForm';
