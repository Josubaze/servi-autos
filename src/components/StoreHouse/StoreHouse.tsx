'use client';

import { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { FaBoxes } from "react-icons/fa";
import { SearchBar } from 'src/components/Common/SearchBar';
import { useDeleteProductMutation, useGetProductsQuery } from 'src/redux/services/productsApi';
import { useGetServicesQuery } from 'src/redux/services/servicesApi';
import { TableProducts } from './TableProducts';
import { FormProduct } from './ProductForm';
import { UpdateProductForm } from './UpdateProductForm';
import { Notification } from '../Common/Notification';
import { PRODUCTVOID } from 'src/utils/constanst';
import { PageTitle } from '../Common/PageTitle';
import { LottieProduct } from '../Dashboard/DashWidgets/DashWidgets';
import { MarketModal } from '../Common/MarketModal';
import { 
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,

} from '@nextui-org/react';
import { MdStore } from "react-icons/md";
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

export const StoreHouse = () => {
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetProductsQuery();
  const { data: services = [] } = useGetServicesQuery();
  const [deleteProduct, { isError: isErrorDelete, isLoading: isLoadingDeleteProduct }] = useDeleteProductMutation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(PRODUCTVOID);
  const { data: session } = useSession(); 
  const isLider = session?.user.role === 'lider';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenNoRef, setIsModalOpenNoRef] = useState(false);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [referencingServices, setReferencingServices] = useState<any[]>([]);

  const handleEdit = (product: Product) => {
    if(isLider) return;
    setCurrentProduct(product);
    setShowFormUpdate(true);
  };

  const handleDelete = async (id: string) => {
    const productServices = services.filter((service: any) =>
      service.products.some((item: any) => item.product._id === id)
    );

    if (productServices.length > 0) {
      setPendingProductId(id);
      setReferencingServices(productServices);
      setIsModalOpen(true);
    } else {
      setPendingProductId(id);
      setIsModalOpenNoRef(true);
    }
  };
  
  const confirmDelete = async () => {
    if (pendingProductId) {
      await deleteProduct(pendingProductId);
      toast.success('Producto Borrado Exitosamente!');
      setIsModalOpen(false);
      setIsModalOpenNoRef(false);
      setPendingProductId(null);
      setReferencingServices([]);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">  
        <LottieProduct loop className="h-28 pt-2" />
        <PageTitle title="GESTIÓN DE ALMACÉN"/>
      </div>
      <div className="relative flex flex-col pb-6 px-0 sm:px-12">
        <div className="my-4 flex justify-between items-center gap-2 pb-2">
        <Button
              radius="md"
              className="h-14 text-gray-100 bg-green-600"
              variant="solid"
              onClick={() => setShowForm(true)}
            >
              <span className='flex items-center justify-center gap-x-2'>
                <FaBoxes/>
                Agregar Producto
              </span>
        </Button>

          <div className='flex gap-x-2'>
            <Tooltip content="Consultar Mercado">
              <Button
                radius="md"
                className="h-14 bg-yellow-500"
                variant="solid"
                onClick={() => setShowMarket(true)}
              >
                <MdStore className="h-8 w-8 text-gray-100"/>
              </Button>
            </Tooltip>    

            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </div>
        </div>

        <TableProducts
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
          <Notification message="Hubo un error al borrar el producto" />
        }
        {showForm && <FormProduct onClose={() => setShowForm(false)} />}
        {showFormUpdate && <UpdateProductForm product={currentProduct} onClose={() => setShowFormUpdate(false)} />}

        {
          showMarket && (
            <MarketModal isOpen={showMarket} onClose={() => setShowMarket(false)} />
          )
        }
      
        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Confirmar eliminación de producto</ModalHeader>
                <ModalBody>
                  <h2 className="text-lg font-semibold mb-4 text-gray-200">
                    Lista de Servicios:
                  </h2>
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <div className="max-h-60 overflow-y-auto space-y-4 scrollbar-custom">
                      {referencingServices.map((service) => (
                        <div
                          key={service._id}
                          className="p-4 border-l-4 border-indigo-600 bg-gray-800/50 rounded-md shadow-md"
                        >
                          <p className="text-gray-300 text-sm font-semibold">ID:</p>
                          <p className="text-gray-400 text-sm break-all">{service._id}</p>
                          <p className="text-gray-300 text-sm font-semibold mt-2">Nombre:</p>
                          <p className="text-gray-400 text-sm">{service.name}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 border-l-4 border-red-500 bg-gray-700/30 rounded-md">
                      <p className="text-red-500 font-medium">
                        Al eliminar este producto, se removerá de todos estos servicios.
                        <br />
                        <span className="font-semibold">¿Deseas continuar?</span>
                      </p>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="flat"
                    color="default"
                    onPress={() => onClose()}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    color="danger"
                    onPress={confirmDelete}
                    isLoading={isLoadingDeleteProduct}
                  >
                    Aceptar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal isOpen={isModalOpenNoRef} onOpenChange={setIsModalOpenNoRef}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-gray-200">
                  Confirmar eliminación de producto
                </ModalHeader>
                <ModalBody>
                  <p className="text-gray-300">
                    ¿Deseas eliminar este producto? Esta acción no se puede deshacer.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" color="default" onPress={() => onClose()}>
                    Cancelar
                  </Button>
                  <Button 
                    color="danger" 
                    onPress={confirmDelete}
                    isLoading={isLoadingDeleteProduct}
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
