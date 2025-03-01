import React, { useState, useRef, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { MENUPROFILE } from 'src/utils/constanst';
import { Notifications } from '../Notifications'; 
import { Badge, Button, Divider, Tooltip } from '@nextui-org/react';
import { IoNotificationsCircleOutline } from 'react-icons/io5';
import { useSocketContext } from 'src/context/SocketContext';
import { usePathname } from 'next/navigation';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export const ProfileDropdown: React.FC<OptionsMenuProps> = ({ session }) => {
  const { notifications } = useSocketContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0); 
  const notificationsContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Actualiza el estado cuando cambien las notificaciones
  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.seen).length;
    setUnreadNotifications(unreadCount);
  }, [notifications]);

  // Detecta clics fuera del contenedor de notificaciones para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsContainerRef.current &&
        !notificationsContainerRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center">
      {/* Contenedor para el botón de notificaciones y su panel */}
      <div className="relative flex items-center justify-center" ref={notificationsContainerRef}>
        <Tooltip content="Notificaciones">
          {unreadNotifications > 0 ? (
            <Badge 
              content={unreadNotifications} 
              className='border-none text-gray-100 bg-indigo-700' 
              shape="circle"
            >
              <Button  
                isIconOnly 
                radius="full"
                variant="light"
                onClick={() => setShowNotifications((prev) => !prev)}
              >
                <IoNotificationsCircleOutline size={36} />
              </Button>
            </Badge>
          ) : (
            <Button  
              isIconOnly 
              radius="full"
              variant="light"
              onClick={() => setShowNotifications((prev) => !prev)}
            >
              <IoNotificationsCircleOutline size={36} />
            </Button>
          )}
        </Tooltip>

        {/* Panel de notificaciones */}
        {showNotifications && (
          <div className="absolute right-0 top-full mt-1.5">
            <Notifications />
          </div>
        )}
      </div>

      {/* Menú de configuración */}
      <div className="ml-3">
        <Menu as="div" className="relative">
          <Tooltip content='Cuenta'>
            <MenuButton className="relative flex rounded-full bg-indigo-700 text-sm focus:outline-none focus:ring-2 ">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={session?.user.image ?? '/svg/user.svg'}
                  alt="Profile Image"
                  width={50}
                  height={50}
                />
              </div>
            </MenuButton>
          </Tooltip>

          <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md outline outline-2 outline-indigo-700 bg-indigo-700">
            {MENUPROFILE.map((item) => (
              <MenuItem key={item.name}>
                 {item.href ? (
                    <Link
                      href={item.href}
                      className={classNames(
                        pathname === item.href ? 'bg-indigo-600' : 'data-[focus]:bg-indigo-600',
                        'block px-4 py-2 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      onClick={item.onClick}
                      className="block w-full text-left px-4 py-2 text-sm font-medium data-[focus]:bg-indigo-600"
                    >
                      {item.name}
                    </button>
                  )}
              </MenuItem>
            ))}
            
            <Divider orientation="horizontal" />
            {/* Elemento extra con información del usuario */}
            <MenuItem as="div" disabled>
              <div className="flex items-center p-2">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={session?.user.image ?? '/svg/user.svg'}
                    alt="Profile Image"
                    width={50}
                    height={50}
                  />
                </div>
                <span className="ml-2">{session?.user.name}</span>
              </div>
            </MenuItem>
          </MenuItems>
          
        </Menu>
      </div>
    </div>
  );
};

