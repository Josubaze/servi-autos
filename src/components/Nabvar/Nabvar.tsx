'use client'

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export const Navbar = () => {
  const { data: session } = useSession()
  const pathname = usePathname()
  return (
    <Disclosure as="nav" className="bg-black-nav">
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex items-center font-medium text-sm text-gray-200">
                  <Image
                      src="/svg/nombreEmpresa.svg"
                      alt="Your Company"
                      width={120} 
                      height={120}  
                      className='pt-1.5'
                    />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {session?.user ? (
                      <>
                        <a href="/dashboard" className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', 
                            pathname === '/dashboard' ? 'bg-gray-700 text-white' : ''
                          )}
                          aria-current={pathname === '/dashboard' ? 'page' : undefined}>Principal</a>
                        <a href="#" className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', 
                            pathname === '#' ? 'bg-gray-700 text-white' : ''
                          )}
                          aria-current={pathname === '#' ? 'page' : undefined}>Proveedores</a>
                        <a href="/storehouse" className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', 
                            pathname === '/storehouse' ? 'bg-gray-700 text-white' : ''
                          )}
                          aria-current={pathname === '/storehouse' ? 'page' : undefined}>Almacén</a>
                        <a href="#" className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', 
                            pathname === '#' ? 'bg-gray-700 text-white' : ''
                          )}
                          aria-current={pathname === '#' ? 'page' : undefined}>Consultar Mercado</a>
                      </>
                    ) : (
                      <>  
                        <a href="/" className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', 
                            pathname === '/' ? 'bg-gray-700 text-white' : ''
                          )}
                          aria-current={pathname === '/' ? 'page' : undefined}>Inicio</a>
                        <a href="/login" className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', 
                            pathname === '/login' ? 'bg-gray-700 text-white' : ''
                          )}
                          aria-current={pathname === '/login' ? 'page' : undefined}>Iniciar Sesión</a>
                        <a href="/signup" className={classNames(
                            'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', 
                            pathname === '/signup' ? 'bg-gray-700 text-white' : ''
                          )}
                          aria-current={pathname === '/signup' ? 'page' : undefined}>Registrarse</a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {session?.user && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
  
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={session.user?.image ?? "svg/user.svg"}
                            alt="Profile Image"
                            width={50}
                            height={50}
                            objectFit="cover"
                            objectPosition="50% 50%"
                            className="absolute inset-0"
                          />
                        </div>
                      </MenuButton>
                    </div>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <MenuItem>
                          {({ focus }) => (
                            <a
                              href="/profile"
                              className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Tu perfil
                            </a>
                          )}
                        </MenuItem>
                        
                        <MenuItem>
                          {({ focus }) => (
                            <a
                              href="/api/auth/signout"
                              className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Cerrar Sesión
                            </a>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </Transition>
                  </Menu>
                </div>
              )}
            </div>
          </div>
  
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {session?.user ? (
                <>
                  <DisclosureButton as="a" href="/dashboard" className={classNames(
                      'block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                      pathname === '/dashboard' ? 'bg-gray-700 text-white' : ''
                    )}
                    aria-current={pathname === '/dashboard' ? 'page' : undefined}>Principal</DisclosureButton>
                  <DisclosureButton as="a" href="#" className={classNames(
                      'block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                      pathname === '#' ? 'bg-gray-700 text-white' : ''
                    )}
                    aria-current={pathname === '#' ? 'page' : undefined}>Proveedores</DisclosureButton>
                  <DisclosureButton as="a" href="/storehouse" className={classNames(
                      'block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                      pathname === '/storehouse' ? 'bg-gray-700 text-white' : ''
                    )}
                    aria-current={pathname === '/storehouse' ? 'page' : undefined}>Almacén</DisclosureButton>
                  <DisclosureButton as="a" href="#" className={classNames(
                      'block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                      pathname === '#' ? 'bg-gray-700 text-white' : ''
                    )}
                    aria-current={pathname === '#' ? 'page' : undefined}>Consultar Mercado</DisclosureButton>
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
        </>
      )}
    </Disclosure>
  )
}
