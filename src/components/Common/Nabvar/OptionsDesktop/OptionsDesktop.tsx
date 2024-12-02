import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MENUCONTROL, MENUCREATE, MENUMANAGE, NAVITEMS } from 'src/utils/constanst';
import { usePathname } from 'next/navigation'
import Link from 'next/link';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}
export const OptionsDesktop: React.FC<OptionsMenuProps> = ({ session }) => {
    const pathname = usePathname();
    return (
        <div className="flex space-x-4">
                {session?.user ? (
                  <>
                    <Link href="/dashboard" className={classNames(
                        'hover:bg-gray-700 rounded-md px-3 py-2 text-sm font-medium', 
                        pathname === '/dashboard' ? 'bg-gray-700' : ''
                      )}
                      aria-current={pathname === '/dashboard' ? 'page' : undefined}>Panel</Link>
                      
                    {/* Menú Crear */}
                    <Menu as="div" className="relative inline-block text-left">
                      <MenuButton className={classNames(
                        'inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 ', 
                        MENUCREATE.some(item => pathname === item.href) ? 'bg-gray-700' : '')
                        }>
                        Crear
                      </MenuButton>
                      <MenuItems className="absolute z-10 mt-2 w-48 origin-top-right rounded-md outline outline-2 outline-indigo-800 bg-black-nav">
                        {MENUCREATE.map((item) => {
                          const isCurrent = pathname === item.href;
                          return (
                            <MenuItem key={item.name}>
                              <Link
                                href={item.href}
                                aria-current={isCurrent ? 'page' : undefined}
                                className={classNames(
                                  isCurrent ? 'bg-gray-700' : 'data-[focus]:bg-gray-700 ',
                                  'block px-4 py-2 text-sm font-medium'
                                )}
                              >
                                {item.name}
                              </Link>
                            </MenuItem>
                          );
                        })}
                      </MenuItems>
                    </Menu>

                     {/* Menú Control */}
                    <Menu as="div" className="relative inline-block text-left">
                      <MenuButton 
                        className={classNames(
                        'inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700', 
                        MENUCONTROL.some(item => pathname === item.href) ? 'bg-gray-700' : '')
                        }>
                        Control
                      </MenuButton>
                      <MenuItems className="absolute z-10 mt-2 w-48 origin-top-right rounded-md outline outline-2 outline-indigo-800 bg-black-nav">
                        {MENUCONTROL.map((item) => {
                          const isCurrent = pathname === item.href;
                          return (
                            <MenuItem key={item.name}>
                              <Link
                                href={item.href}
                                aria-current={isCurrent ? 'page' : undefined}
                                className={classNames(
                                  isCurrent ? 'bg-gray-700' : ' data-[focus]:bg-gray-700 ',
                                  'block px-4 py-2 text-sm font-medium'
                                )}
                              >
                                {item.name}
                              </Link>
                            </MenuItem>
                          );
                        })}
                      </MenuItems>
                    </Menu>
                      
                    {/* Menú Gestionar */}
                    <Menu as="div" className="relative inline-block text-left">
                      <MenuButton 
                        className={classNames(
                        'inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-mediumhover:bg-gray-700', 
                        MENUMANAGE.some(item => pathname === item.href) ? 'bg-gray-700 text-white' : '')
                        }>
                        Gestionar
                      </MenuButton>
                      <MenuItems className="absolute z-10 mt-2 w-48 origin-top-right rounded-md outline outline-2 outline-indigo-800 bg-black-nav">
                        {MENUMANAGE.map((item) => {
                          const isCurrent = pathname === item.href;
                          return (
                            <MenuItem key={item.name}>
                              <Link
                                href={item.href}
                                aria-current={isCurrent ? 'page' : undefined}
                                className={classNames(
                                  isCurrent ? 'bg-gray-700' : ' data-[focus]:bg-gray-700 ',
                                  'block px-4 py-2 text-sm font-medium'
                                )}
                              >
                                {item.name}
                              </Link>
                            </MenuItem>
                            
                          );
                        })}
                      </MenuItems>
                    </Menu>
                      
                    <Link href="/market" className={classNames(
                        'hover:bg-gray-700  rounded-md px-3 py-2 text-sm font-medium', 
                        pathname === '/market' ? 'bg-gray-700' : ''
                      )}
                    aria-current={pathname === '/market' ? 'page' : undefined}>Consultar Mercado</Link>
                  </>
                ) : (
                  <>  
                    { 
                      NAVITEMS.map((item) => {
                      const isCurrent = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            'hover:bg-gray-700 rounded-md px-3 py-2 text-sm font-medium',
                            isCurrent ? 'bg-gray-700' : ''
                          )}
                          aria-current={isCurrent ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </>
                )}
              </div>
    );
}

export default OptionsDesktop;
