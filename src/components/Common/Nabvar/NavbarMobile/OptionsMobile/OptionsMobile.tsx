import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { usePathname } from 'next/navigation'
import { MENUCONTROL, MENUCREATE, MENUMANAGE, NAVITEMS } from 'src/utils/constanst';
function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export const OptionsMobile: React.FC<OptionsMenuProps> = ({ session }) => {
    const pathname = usePathname();
    return (
        <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
            {session?.user ? (
            <>
                <DisclosureButton as="a" href="/dashboard" className={classNames(
                'block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                pathname === '/dashboard' ? 'bg-gray-700 text-white' : ''
                )}
                aria-current={pathname === '/dashboard' ? 'page' : undefined}>Panel</DisclosureButton>

                {/* Menú Crear */}
                <Disclosure>
                <DisclosureButton className={classNames(
                    'block w-full rounded-md  px-3 py-2 text-start font-medium text-gray-300 hover:bg-gray-700 hover:text-white', 
                    MENUCREATE.some(item => pathname === item.href) ? 'bg-gray-700 text-white' : ''
                )}>
                    Crear
                </DisclosureButton>
                <DisclosurePanel className="pl-4">
                    {MENUCREATE.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className={classNames(
                        'block w-full rounded-md  px-3 py-2 text-start font-medium text-gray-300 hover:bg-gray-700 hover:text-white',
                        pathname === item.href ? 'bg-gray-700 text-white' : ''
                        )}
                    >
                        {item.name}
                    </a>
                    ))}
                </DisclosurePanel>
                </Disclosure>

                {/* Menú Gestionar */}
                <Disclosure>
                <DisclosureButton className={classNames(
                    'block w-full rounded-md  px-3 py-2 text-start font-medium text-gray-300 hover:bg-gray-700 hover:text-white',
                    MENUMANAGE.some(item => pathname === item.href) ? 'bg-gray-700 text-white' : ''
                )}>
                    Gestionar
                </DisclosureButton>
                <DisclosurePanel className="pl-4">
                    {MENUMANAGE.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className={classNames(
                        'block w-full rounded-md  px-3 py-2 text-start font-medium text-gray-300 hover:bg-gray-700 hover:text-white',
                        pathname === item.href ? 'bg-gray-700 text-white' : ''
                        )}
                    >
                        {item.name}
                    </a>
                    ))}
                </DisclosurePanel>
                </Disclosure>

                {/* Menú Control */}
                <Disclosure>
                <DisclosureButton className={classNames(
                    'block w-full rounded-md  px-3 py-2 text-start font-medium text-gray-300 hover:bg-gray-700 hover:text-white',
                    MENUCONTROL.some(item => pathname === item.href) ? 'bg-gray-700 text-white' : ''
                )}>
                    Control
                </DisclosureButton>
                <DisclosurePanel className="pl-4">
                    {MENUCONTROL.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className={classNames(
                        'block w-full rounded-md  px-3 py-2 text-start font-medium text-gray-300 hover:bg-gray-700 hover:text-white',
                        pathname === item.href ? 'bg-gray-700 text-white' : ''
                        )}
                    >
                        {item.name}
                    </a>
                    ))}
                </DisclosurePanel>
                </Disclosure>

                {/* Opción Consultar Mercado */}
                <DisclosureButton as="a" href="/market" className={classNames(
                'block w-full rounded-md  px-3 py-2 text-start font-medium text-gray-300 hover:bg-gray-700 hover:text-white',
                pathname === '/market' ? 'bg-gray-700 text-white' : ''
                )}
                aria-current={pathname === '/market' ? 'page' : undefined}>Consultar Mercado</DisclosureButton>

            </>
            ) : (
            <>
                {NAVITEMS.map((item) => {
                const isCurrent = pathname === item.href;
                return (
                    <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                        'block w-full rounded-md  px-3 py-2 text-start font-medium text-gray-300 hover:bg-gray-700 hover:text-white',
                        isCurrent ? 'bg-gray-700 text-white' : ''
                    )}
                    aria-current={isCurrent ? 'page' : undefined}
                    >
                    {item.name}
                    </DisclosureButton>
                );
                })}
            </>
            )}
        </div>
        </DisclosurePanel>
    );
}

