'use client'

import { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { SearchBar } from 'src/components/Common/SearchBar';
import { useDeleteServiceMutation, useGetServicesQuery } from 'src/redux/services/servicesApi';
import { TableServices } from './TableServices';
import { Notification } from '../Common/Notification';
import { PageTitle } from '../Common/PageTitle';
import { ServiceForm } from './ServiceForm';
import { UpdateServiceForm } from './UpdateServiceForm';
import { SERVICEVOID } from 'src/utils/constanst';
import dynamic from 'next/dynamic';
export const LottieTools = dynamic(() => import("src/components/LottieIcon/LottieTools"), { ssr: false });
import { FaTools } from "react-icons/fa";

export const Services = () => {
  const { data = [], isError, isLoading, isSuccess } = useGetServicesQuery();
  const [deleteService, { isError: isErrorDelete }] = useDeleteServiceMutation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [currentService, setCurrentService] = useState(SERVICEVOID);

  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setShowFormUpdate(true);
  };

  const handleDelete = async (serviceId: string) => {
    await deleteService(serviceId);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <>
      <div className="flex justify-center items-center ">
        <LottieTools loop className="h-24 pt-3" />
        <PageTitle title="Gestión de Servicios" />
      </div>
      <div className="relative flex flex-col pb-6 px-0 sm:px-12">
        <div className="my-4 flex flex-col sm:flex-row sm:justify-between justify-start sm:items-center gap-2 pb-2">
          {/* Botón: Oculto en pantallas pequeñas */}
          <button
            className="transition ease-in-out delay-150 bg-emerald-600 text-white px-4 py-2 rounded hover:-translate-y-1 hover:scale-110 hover:bg-indigo-600 duration-300 max-sm:hidden"
            onClick={() => setShowForm(true)}
          >
            <span className="flex items-center gap-2">
              <FaTools />
              Agregar Servicio
            </span>
          </button>

          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <TableServices
          data={data}
          searchTerm={searchTerm}
          isLoading={isLoading}
          isError={isError}
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
          <Notification message="Hubo un error al borrar el servicio" />
        }

        {showForm && (
          <ServiceForm
            onClose={handleCloseForm}
          />
        )}

        {showFormUpdate && 
          <UpdateServiceForm 
            service={currentService} 
            onClose={() => setShowFormUpdate(false)}
          />}
      </div>
    </>
  );
};
