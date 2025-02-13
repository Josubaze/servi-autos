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
  Divider,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import { MdStore } from "react-icons/md";
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

export const StoreHouse = () => {
  const { data = [], isError, isLoading, isFetching, isSuccess } = useGetProductsQuery();
  const { data: services = [] } = useGetServicesQuery();
  const [deleteProduct, { isError: isErrorDelete, isLoading: isLoadingProduct }] = useDeleteProductMutation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(PRODUCTVOID);
  const { data: session } = useSession(); 
  const isLider = session?.user.role === 'lider';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [referencingServices, setReferencingServices] = useState<any[]>([]);

  const handleEdit = (product: Product) => {
    if(isLider) return;
    setCurrentProduct(product);
    setShowFormUpdate(true);
  };

  // Función que se ejecuta al presionar el botón de eliminar
  const handleDelete = async (id: string) => {
    const productServices = services.filter((service: any) =>
      service.products.some((item: any) => item.product._id === id)
    );

    if (productServices.length > 0) {
      setPendingProductId(id);
      setReferencingServices(productServices);
      setIsModalOpen(true);
    } else {
      // Si no hay referencias, eliminamos el producto directamente
      await deleteProduct(id);
      toast.success('Producto Borrado Exitosamente!');
    }
  };

  // Función que se ejecuta al confirmar en el modal
  const confirmDelete = async () => {
    if (pendingProductId) {
      await deleteProduct(pendingProductId);
      toast.success('Producto Borrado Exitosamente!');
      setIsModalOpen(false);
      setPendingProductId(null);
      setReferencingServices([]);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">  
        <LottieProduct loop className="h-20 pt-2" />
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
                  <h2>
                    El producto se encuentra referenciado en los siguientes servicios:
                  </h2>
                  <div
                    style={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      marginTop: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    {referencingServices.map((service) => (
                      <div key={service._id} style={{ padding: '4px 0' }}>
                        <p >
                          {service.name} (ID: {service._id})
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className='text-red-600'>
                    Al eliminar este producto se removerá de todos estos servicios. ¿Deseas continuar?
                  </p>
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
                    onPress={confirmDelete}
                    isLoading={isLoadingProduct}
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
