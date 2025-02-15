import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { 
  MENUCONTROL, MENUCREATE, MENUMANAGE, 
  MENUCONTROLLIDER, MENUCREATELIDER, MENUMANAGELIDER
} from 'src/utils/constanst';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

interface OptionsAuthProps {
  session: any;
}

export const OptionsDesktop: React.FC<OptionsAuthProps> = ({ session }) => {
  const pathname = usePathname();
  const isLider = session?.user?.role === 'lider';

  return (
    <div className="flex space-x-4">
      <Link 
        href="/dashboard" 
        className={classNames(
          'hover:bg-indigo-700 rounded-md px-3 py-2 text-sm font-medium', 
          pathname === '/dashboard' ? 'bg-indigo-700' : ''
        )}
      >
        Panel
      </Link>

      {/* Menú Crear */}
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton className={classNames(
          'inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-indigo-700', 
          (isLider ? MENUCREATELIDER : MENUCREATE).some(item => pathname === item.href) ? 'bg-indigo-700' : ''
        )}>
          Crear
        </MenuButton>
        <MenuItems className="absolute z-10 mt-2 w-48 origin-top-right rounded-md outline outline-2 outline-indigo-800 bg-indigo-950">
          {(isLider ? MENUCREATELIDER : MENUCREATE).map((item) => (
            <MenuItem key={item.name}>
              <Link
                href={item.href}
                className={classNames(
                  pathname === item.href ? 'bg-indigo-700' : 'data-[focus]:bg-indigo-700',
                  'block px-4 py-2 text-sm font-medium'
                )}
              >
                {item.name}
              </Link>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>

      {/* Menú Control */}
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton className={classNames(
          'inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-indigo-700', 
          (isLider ? MENUCONTROLLIDER : MENUCONTROL).some(item => pathname === item.href) ? 'bg-indigo-700' : ''
        )}>
          Control
        </MenuButton>
        <MenuItems className="absolute z-10 mt-2 w-48 origin-top-right rounded-md outline outline-2 outline-indigo-800 bg-indigo-950">
          {(isLider ? MENUCONTROLLIDER : MENUCONTROL).map((item) => (
            <MenuItem key={item.name}>
              <Link
                href={item.href}
                className={classNames(
                  pathname === item.href ? 'bg-indigo-700' : 'data-[focus]:bg-indigo-700',
                  'block px-4 py-2 text-sm font-medium'
                )}
              >
                {item.name}
              </Link>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>

      {/* Menú Gestionar */}
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton className={classNames(
          'inline-flex justify-center w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-indigo-700',  
          (isLider ? MENUMANAGELIDER : MENUMANAGE).some(item => pathname === item.href) ? 'bg-indigo-700' : ''
        )}>
          Gestionar
        </MenuButton>
        <MenuItems className="absolute z-10 mt-2 w-48 origin-top-right rounded-md outline outline-2 outline-indigo-800 bg-indigo-950">
          {(isLider ? MENUMANAGELIDER : MENUMANAGE).map((item) => (
            <MenuItem key={item.name}>
              <Link
                href={item.href}
                className={classNames(
                  pathname === item.href ? 'bg-indigo-700' : 'data-[focus]:bg-indigo-700',
                  'block px-4 py-2 text-sm font-medium'
                )}
              >
                {item.name}
              </Link>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>

      <Link 
        href="/market" 
        className={classNames(
          'hover:bg-indigo-700 rounded-md px-3 py-2 text-sm font-medium', 
          pathname === '/market' ? 'bg-indigo-700' : ''
        )}
      >
        Consultar Mercado
      </Link>
    </div>
  );
};

