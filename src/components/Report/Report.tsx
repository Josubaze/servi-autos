'use client';

import { CustomerForm } from "../Budget/CustomerForm";
import { Loading } from "../Common/Loading";
import { ReportForm } from "./ReportForm";
import { DocHeader } from "../Common/DocHeader";
import { ReportTable } from "./ReportTable";
import { ReportActions } from "./ReportActions";
import { useReport } from "src/hooks/Report/useReport";
import { ReportOptions } from "./ReportOptions";

    interface ReportProps {
        mode?: "create" | "upload";
        reportData?: ReportWork | null;
    }

    export const Report: React.FC<ReportProps> = ({ mode = "create", reportData= null }) => {
    const {
        formCustomerRef,
        formRef,
        selectedServices,
        setSelectedServices,
        originalServices,
        setOriginalServices,
        description,
        setDescription,
        company,
        isLoading,
        isError,
        isSaving,
        handleSave,
        extractFormData,
    } = useReport({ mode, reportData });   

    return (
        <div className="relative flex flex-col py-6 px-0 sm:px-12">
            {isSaving && (
                <div className="absolute inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
                    <Loading />
                </div>
            )}
            <ReportOptions  
                company={company}
                selectedServices={selectedServices}
                extractFormData={extractFormData}
                description={description}
            />
            <DocHeader company={company || null} isError={isError} isLoading={isLoading} title="INFORME" />
            <div className="flex flex-col sm:flex-row py-4 px-8">
                <div className="flex-1">
                    <CustomerForm title="Infome realizado a:" ref={formCustomerRef} />
                </div>
                <div className="flex-1">
                    <ReportForm
                        ref={formRef}
                        mode={mode}
                    />
                </div>
            </div>
            <ReportTable
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                originalServices={originalServices}
                setOriginalServices={setOriginalServices}
            />

            <ReportActions
                description={description}
                setDescription={setDescription}
                handleSave={() => handleSave(mode, reportData?._id || '')} 
            />
        </div>
    );
};
