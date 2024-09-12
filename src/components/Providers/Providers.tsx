'use client';

import { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { FaUsersGear } from "react-icons/fa6";
import { SearchBar } from 'src/components/Common/SearchBar';
import { useDeleteProviderMutation, useGetProvidersQuery } from 'src/redux/services/providersApi'; 
import { ProvidersTable } from './ProvidersTable'; 
import { ProviderForm } from './ProviderForm';
import { ProviderUpdateForm } from './ProvidersUpdateForm';
import { Notification } from '../Common/Notification';
import { PROVIDERVOID } from 'src/utils/constanst';
import { PageTitle } from '../Common/PageTitle';
import { LottieSupplier } from '../Dashboard/DashWidgets/DashWidgets';


export const Providers = () => {
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetProvidersQuery();
  const [deleteProvider, { isError: isErrorDelete }] = useDeleteProviderMutation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(PROVIDERVOID);

  const handleEdit = (provider: Provider) => {
    setCurrentProvider(provider);
    setShowFormUpdate(true);
  };

  const handleDelete = async (providerId: string) => {
    await deleteProvider(providerId);
  };
  
  return (
    <>
    <div className="flex justify-center items-center">  
        <LottieSupplier loop className="h-20 pt-2" />
        <PageTitle title="Gestión de Proveedores"/>
    </div>
    <div className="relative flex flex-col pb-6 px-0 sm:px-12">
      <div className="my-4 flex justify-between items-center gap-2 pb-2">
        <button
          className="transition ease-in-out delay-150 bg-emerald-600 text-white px-4 py-2 rounded hover:-translate-y-1 hover:scale-110 hover:bg-indigo-600 duration-300 max-sm:hidden"
          onClick={() => setShowForm(true)}
        >
          <span className='flex items-center gap-2 '>
            <FaUsersGear />
            Agregar Proveedor
          </span>
        </button>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder='Buscar por id, nombre o correo..' />
      </div>

      <ProvidersTable
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
        <Notification message="Hubo un error al borrar el proveedor" />
      }
      {showForm && <ProviderForm onClose={() => setShowForm(false)} />}
      {showFormUpdate && <ProviderUpdateForm provider={currentProvider} onClose={() => setShowFormUpdate(false)} />}
    </div>
    </>
  );
};
