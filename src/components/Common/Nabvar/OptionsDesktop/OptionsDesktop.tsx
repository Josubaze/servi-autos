import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MENUCONTROL, MENUCREATE, MENUMANAGE, NAVITEMS } from 'src/utils/constanst';
import { usePathname } from 'next/navigation'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}
export const OptionsDesktop: React.FC<OptionsMenuProps> = ({ session }) => {
    const pathname = usePathname();
    return (
        <div className="flex space-x-4">
                {session?.user ? (
                  <>
                    <a href="/dashboard" className={classNames(
                        'text-gray-100 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', 
                        pathname === '/dashboard' ? 'bg-gray-700' : ''
                      )}
                      aria-current={pathname === '/dashboard' ? 'page' : undefined}>Panel</a>
                      
                    {/* Menú Crear */}
                    <Menu as="div" className="relative inline-block text-left">
                      <MenuButton className={classNames(
                        'inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                        MENUCREATE.some(item => pathname === item.href) ? 'bg-gray-700 text-white' : '')
                        }>
                        Crear
                      </MenuButton>
                      <MenuItems className="absolute z-10 mt-2 w-48 origin-top-right rounded-md outline outline-2 outline-indigo-800 bg-black-nav">
                        {MENUCREATE.map((item) => {
                          const isCurrent = pathname === item.href;
                          return (
                            <MenuItem key={item.name}>
                              <a
                                href={item.href}
                                aria-current={isCurrent ? 'page' : undefined}
                                className={classNames(
                                  isCurrent ? 'bg-gray-700' : 'text-gray-100 data-[focus]:bg-gray-700 ',
                                  'block px-4 py-2 text-sm font-medium'
                                )}
                              >
                                {item.name}
                              </a>
                            </MenuItem>
                          );
                        })}
                      </MenuItems>
                    </Menu>

                     {/* Menú Control */}
                    <Menu as="div" className="relative inline-block text-left">
                      <MenuButton 
                        className={classNames(
                        'inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                        MENUCONTROL.some(item => pathname === item.href) ? 'bg-gray-700 text-white' : '')
                        }>
                        Control
                      </MenuButton>
                      <MenuItems className="absolute z-10 mt-2 w-48 origin-top-right rounded-md outline outline-2 outline-indigo-800 bg-black-nav">
                        {MENUCONTROL.map((item) => {
                          const isCurrent = pathname === item.href;
                          return (
                            <MenuItem key={item.name}>
                              <a
                                href={item.href}
                                aria-current={isCurrent ? 'page' : undefined}
                                className={classNames(
                                  isCurrent ? 'bg-gray-700' : 'text-gray-100 data-[focus]:bg-gray-700 ',
                                  'block px-4 py-2 text-sm font-medium'
                                )}
                              >
                                {item.name}
                              </a>
                            </MenuItem>
                          );
                        })}
                      </MenuItems>
                    </Menu>
                      
                    {/* Menú Gestionar */}
                    <Menu as="div" className="relative inline-block text-left">
                      <MenuButton 
                        className={classNames(
                        'inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                        MENUMANAGE.some(item => pathname === item.href) ? 'bg-gray-700 text-white' : '')
                        }>
                        Gestionar
                      </MenuButton>
                      <MenuItems className="absolute z-10 mt-2 w-48 origin-top-right rounded-md outline outline-2 outline-indigo-800 bg-black-nav">
                        {MENUMANAGE.map((item) => {
                          const isCurrent = pathname === item.href;
                          return (
                            <MenuItem key={item.name}>
                              <a
                                href={item.href}
                                aria-current={isCurrent ? 'page' : undefined}
                                className={classNames(
                                  isCurrent ? 'bg-gray-700' : 'text-gray-100 data-[focus]:bg-gray-700 ',
                                  'block px-4 py-2 text-sm font-medium'
                                )}
                              >
                                {item.name}
                              </a>
                            </MenuItem>
                            
                          );
                        })}
                      </MenuItems>
                    </Menu>
                      
                    <a href="/market" className={classNames(
                        'text-gray-100 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium', 
                        pathname === '/market' ? 'bg-gray-700' : ''
                      )}
                    aria-current={pathname === '/market' ? 'page' : undefined}>Consultar Mercado</a>
                  </>
                ) : (
                  <>  
                    { 
                      NAVITEMS.map((item) => {
                      const isCurrent = pathname === item.href;
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            'text-gray-100 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium',
                            isCurrent ? 'bg-gray-700' : ''
                          )}
                          aria-current={isCurrent ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      );
                    })}
                  </>
                )}
              </div>
    );
}

export default OptionsDesktop;
