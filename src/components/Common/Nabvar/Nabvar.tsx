'use client'

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ProfileDropdown } from './ProfileDropdown'
import { NavbarMobile } from './NavbarMobile';
function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export const Navbar = () => {
  const { data: session } = useSession()
  const pathname = usePathname()
  const menuCrear = [
    { name: 'Presupuesto', href: '#' },
    { name: 'Factura', href: '#' },
    { name: 'Informe', href: '#' },
  ];
  const menuGestionar = [
    { name: 'Almacén', href: '/storehouse' },
    { name: 'Clientes', href: '#' },
    { name: 'Proveedores', href: '#' },
  ];
  const menuControl = [
    { name: 'Facturas', href: '#' },
    { name: 'Presupuestos', href: '#' },
    { name: 'Orden de Ejecución', href: '#' },
    { name: 'Orden de Compra', href: '#' },
  ];
  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Iniciar Sesión', href: '/login' },
    { name: 'Registrarse', href: '/signup' },
  ];
  return (
    <Disclosure as="nav" className="bg-black-nav">
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>
              {/* Logo*/}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex items-center font-medium text-sm text-gray-200">
                  <Image
                      src="/svg/auto.svg"
                      alt="Your Company"
                      width={60} 
                      height={60}  
                      className='pt-1.5'
                    />
                </div>
                {/* Rutas*/}
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {session?.user ? (
                      <>
                        <a href="/dashboard" className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', 
                            pathname === '/dashboard' ? 'bg-gray-700 text-white' : ''
                          )}
                          aria-current={pathname === '/dashboard' ? 'page' : undefined}>Principal</a>
                          
                        {/* Menú Crear */}
                        <Menu as="div" className="relative inline-block text-left">
                          <MenuButton className="inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                            Crear
                          </MenuButton>
                          <MenuItems className="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {menuCrear.map((item) => (
                              <MenuItem key={item.name}>
                                <a
                                  href={item.href}
                                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                >
                                  {item.name}
                                </a>
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Menu>
                          
                        {/* Menú Gestionar */}
                        <Menu as="div" className="relative inline-block text-left">
                          <MenuButton className="inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                            Gestionar
                          </MenuButton>
                          <MenuItems className="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {menuGestionar.map((item) => (
                              <MenuItem key={item.name}>
                                <a
                                  href={item.href}
                                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                >
                                  {item.name}
                                </a>
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Menu>

                        {/* Menú Control */}
                        <Menu as="div" className="relative inline-block text-left">
                          <MenuButton className="inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                            Control
                          </MenuButton>
                          <MenuItems className="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {menuControl.map((item) => (
                              <MenuItem key={item.name}>
                                <a
                                  href={item.href}
                                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                >
                                  {item.name}
                                </a>
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Menu>
                          
                        <a href="#" className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', 
                            pathname === '#' ? 'bg-gray-700 text-white' : ''
                          )}
                        aria-current={pathname === '#' ? 'page' : undefined}>Consultar Mercado</a>
                      </>
                    ) : (
                      <>  
                        {navItems.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', 
                              pathname === item.href ? 'bg-gray-700 text-white' : ''
                            )}
                            aria-current={pathname === item.href ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {session?.user && (
                <ProfileDropdown image={session.user.image}/>
              )}
            </div>
          </div>
          {/* Mobile menu */}
          <NavbarMobile session={session}/>
    </Disclosure>
  )
}
