import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { usePathname } from 'next/navigation'
import { Session } from 'next-auth';
function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

interface NavbarMobileProps {
  session: Session | null;
}

export const NavbarMobile: React.FC<NavbarMobileProps> = ({ session }) => {
    const pathname = usePathname()
    return (
        <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {session?.user ? (
            <>
              <DisclosureButton as="a" href="/dashboard" className={classNames(
                'block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                pathname === '/dashboard' ? 'bg-gray-700 text-white' : ''
              )}
              aria-current={pathname === '/dashboard' ? 'page' : undefined}>Principal</DisclosureButton>

              <Disclosure>
                  <>
                    <DisclosureButton className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                      Crear
                    </DisclosureButton>
                    <DisclosurePanel className="pl-4">
                      <a href="/create/budget" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Presupuesto</a>
                      <a href="/create/invoice" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Factura</a>
                      <a href="/create/report" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Informe</a>
                    </DisclosurePanel>
                  </>
              </Disclosure>

              <Disclosure>
                    <DisclosureButton className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                      Gestionar
                    </DisclosureButton>
                    <DisclosurePanel className="pl-4">
                      <a href="/storehouse" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Almacén</a>
                      <a href="/clients" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Clientes</a>
                      <a href="/providers" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Proveedores</a>
                    </DisclosurePanel>
              </Disclosure>

              <Disclosure>
                    <DisclosureButton className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                      Control
                    </DisclosureButton>
                    <DisclosurePanel className="pl-4">
                      <a href="/control/invoices" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Facturas</a>
                      <a href="/control/budgets" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Presupuestos</a>
                      <a href="/control/orders" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Órdenes de Ejecución</a>
                      <a href="/control/purchase-orders" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">Órdenes de Compra</a>
                    </DisclosurePanel>
              </Disclosure>

              <DisclosureButton as="a" href="/market" className={classNames(
                'block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                pathname === '/market' ? 'bg-gray-700 text-white' : ''
              )}
              aria-current={pathname === '/market' ? 'page' : undefined}>Consultar Mercado</DisclosureButton>
            </>
          ) : (
            <>
              <DisclosureButton as="a" href="/" className={classNames(
                'block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                pathname === '/' ? 'bg-gray-700 text-white' : ''
              )}
              aria-current={pathname === '/' ? 'page' : undefined}>Inicio</DisclosureButton>
              <DisclosureButton as="a" href="/login" className={classNames(
                'block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                pathname === '/login' ? 'bg-gray-700 text-white' : ''
              )}
              aria-current={pathname === '/login' ? 'page' : undefined}>Iniciar Sesión</DisclosureButton>
              <DisclosureButton as="a" href="/signup" className={classNames(
                'block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                pathname === '/signup' ? 'bg-gray-700 text-white' : ''
              )}
              aria-current={pathname === '/signup' ? 'page' : undefined}>Registrarse</DisclosureButton>
            </>
          )}
        </div>
      </DisclosurePanel>
    );
}

