'use client';

import { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { SearchBar } from 'src/components/Common/SearchBar';
import { useDeleteCustomerMutation, useGetCustomersQuery } from 'src/redux/services/customersApi'; 
import { CustomersTable } from './CustomersTable'; 
import { CustomerForm } from './CustomerForm';
import { CustomerUpdateForm } from './CustomerUpdateForm';
import { Notification } from '../Common/Notification';
import { CUSTOMERVOID } from 'src/utils/constanst'; // Asegúrate de definir CUSTOMERVOID

export const Customers = () => {
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetCustomersQuery();
  const [deleteCustomer, { isError: isErrorDelete }] = useDeleteCustomerMutation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(CUSTOMERVOID);

  const handleEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    setShowFormUpdate(true);
  };

  const handleDelete = async (customerId: string) => {
    await deleteCustomer(customerId);
  };
  return (
    <div className="relative flex flex-col py-6 px-0 sm:px-12 ">
      <div className="my-4 flex justify-between items-center gap-2 pb-2">
        <button
          className="transition ease-in-out delay-150 bg-emerald-600 text-white px-4 py-2 rounded hover:-translate-y-1 hover:scale-110 hover:bg-indigo-600 duration-300 max-sm:hidden"
          onClick={() => setShowForm(true)}
        >
          <span className='flex items-center gap-2 '>
            <FaPlus />
            Agregar Cliente
          </span>
        </button>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder='Buscar por id, nombre o correo..' />
      </div>

      <CustomersTable
        data={data}
        searchTerm={searchTerm}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        isSuccess={isSuccess}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />

      <button
        className="bg-emerald-600 hover:bg-emerald-800 text-3xl text-white p-5 rounded-full fixed bottom-0 right-0 mr-8 mb-12 shadow-2xl shadow-emerald-400 sm:hidden z-50"
        onClick={() => setShowForm(true)}
      >
        <FaPlus />
      </button>

      {isErrorDelete && 
        <Notification message="Hubo un error al borrar el cliente" />
      }
      {showForm && <CustomerForm onClose={() => setShowForm(false)} />}
      {showFormUpdate && <CustomerUpdateForm customer={currentCustomer} onClose={() => setShowFormUpdate(false)} />}
    </div>
  );
};
