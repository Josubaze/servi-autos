import { useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { useGetCustomersQuery } from "src/redux/services/customersApi";
import { CUSTOMERVOID } from "src/utils/constanst";
import { TableCustomers } from "../TableCustomers"; 


export const BudgetCustomerForm = () => {
    const { data: customers = [], isLoading, isError, isFetching, isSuccess } = useGetCustomersQuery();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>(CUSTOMERVOID);
    const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
    const handleCustomerSelect = (customer: Customer) => {
        setSelectedCustomer(customer); 
        setIsTableVisible(false); 
    };

    return (
        <>
            {/* Botón para abrir la tabla */}
            <div className="flex items-center">
                <p className="font-title font-bold">Presupuestar a</p>
                <div className="relative ml-3">
                    <button
                        type="button"
                        className="rounded-xl text-white flex items-center justify-center text-sm h-8 px-2 border-2 border-green-600 transition ease-in-out delay-150 hover:scale-110 hover:bg-green-600 duration-300"
                        onClick={() => setIsTableVisible(true)} 
                    >
                        <span className="flex items-center justify-center gap-x-2">
                            Cargar
                            <IoPersonAdd className="h-5 w-5"/>
                        </span>
                    </button>
                </div>
            </div>

            {/* Inputs para mostrar el cliente seleccionado */}
            <div className="flex flex-wrap gap-y-2 pt-4 w-full">
                <div className="w-full">
                    <input
                        placeholder="Nombre del cliente"
                        value={selectedCustomer?.name || ''}
                        className="w-1/2 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />
                </div>
                
                <div className="w-full">
                    <input
                        placeholder="Correo del cliente"
                        value={selectedCustomer?.email || ''}
                        className="w-3/4 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />
                </div>

                <div className="w-full">
                    <input
                        placeholder="Teléfono del cliente"
                        value={selectedCustomer?.phone || ''}
                        className="w-1/2 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />
                </div>

                <div className="w-full flex flex-wrap gap-x-2">
                    <input
                        placeholder="Estado"
                        value={selectedCustomer?.address.state || ''}
                        className="w-1/4 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />

                    <input
                        placeholder="Ciudad"
                        value={selectedCustomer?.address.city || ''}
                        className="w-1/2 px-2 block border-solid border-2 border-gray-500 rounded-xl bg-gray-800 focus:outline-none focus:border-indigo-600 h-8"
                    />
                </div>
            </div>

        {/* Modal para la tabla de selección de clientes */}
        {isTableVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                <div className="bg-gray-100 p-2 rounded-lg shadow-lg w-3/4">
                    <TableCustomers
                        data={customers} 
                        isLoading={isLoading}
                        isError={isError}
                        isFetching={isFetching}
                        isSuccess={isSuccess}
                        onSelectCustomer={handleCustomerSelect}
                        onCloseTable={() => setIsTableVisible(false)}
                    />
                </div>
            </div>
            )}
        </>
    );
};

export default BudgetCustomerForm;
