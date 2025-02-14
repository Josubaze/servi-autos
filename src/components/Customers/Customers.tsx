'use client';

import { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { SearchBar } from 'src/components/Common/SearchBar';
import { useDeleteCustomerMutation, useGetCustomersQuery } from 'src/redux/services/customersApi'; 
import { CustomersTable } from './CustomersTable'; 
import { CustomerForm } from './CustomerForm';
import { CustomerUpdateForm } from './CustomerUpdateForm';
import { Notification } from '../Common/Notification';
import { CUSTOMERVOID } from 'src/utils/constanst'; 
import { PageTitle } from '../Common/PageTitle';
import { LottiePersons } from '../Dashboard/DashWidgets/DashWidgets';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { toast } from 'react-toastify';

export const Customers = () => {
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetCustomersQuery();
  const [deleteCustomer, { isError: isErrorDelete, isLoading: isLoadingDelete }] = useDeleteCustomerMutation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(CUSTOMERVOID);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCustomerId, setPendingCustomerId] = useState<string | null>(null);

  const handleEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    setShowFormUpdate(true);
  };

  const handleDelete = (customerId: string) => {
    setPendingCustomerId(customerId);
    setIsModalOpen(true);
  };

  const confirmDeleteCustomer = async () => {
    if (pendingCustomerId) {
      await deleteCustomer(pendingCustomerId);
      toast.success('Cliente eliminado exitosamente!');
      setIsModalOpen(false);
      setPendingCustomerId(null);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">  
        <LottiePersons loop className="h-24 pt-2" />
        <PageTitle title="GESTIÓN DE CLIENTES"/>
      </div>

      <div className="relative flex flex-col pb-6 px-0 sm:px-12">
        <div className="my-4 flex justify-between items-center gap-2 pb-2">
          <Button
            radius="md"
            className="h-14 text-gray-100 bg-green-600"
            variant="solid"
            onClick={() => setShowForm(true)}
          >
            <span className="flex items-center gap-2">
              <FaUsers />
              Agregar Cliente
            </span>
          </Button>

          <div className='w-full sm:w-3/12'>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
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

        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-gray-200">
                  Confirmar eliminación de cliente
                </ModalHeader>
                <ModalBody>
                  <p className="text-gray-300">
                    ¿Deseas eliminar este cliente? Esta acción no se puede deshacer.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" color="default" onPress={() => onClose()}>
                    Cancelar
                  </Button>
                  <Button 
                    color="danger" 
                    onPress={confirmDeleteCustomer}
                    isLoading={isLoadingDelete}
                  >                      
                    Aceptar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};
