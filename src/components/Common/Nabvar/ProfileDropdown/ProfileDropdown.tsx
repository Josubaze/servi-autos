import React, { useState, useRef, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { MENUPROFILE } from 'src/utils/constanst';
import { Notifications } from '../Notifications'; 
import { Badge, Button, Divider } from '@nextui-org/react';
import { IoNotificationsCircleOutline } from 'react-icons/io5';
import { useSocketContext } from 'src/context/SocketContext';


export const ProfileDropdown: React.FC<OptionsMenuProps> = ({ session }) => {
  const { notifications } = useSocketContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0); 
  const notificationsContainerRef = useRef<HTMLDivElement>(null);

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

        {/* Panel de notificaciones */}
        {showNotifications && (
          <div className="absolute right-0 top-full mt-2">
            <Notifications />
          </div>
        )}
      </div>

      {/* Menú de perfil */}
      <div className="ml-3">
        <Menu as="div" className="relative">
          <MenuButton className="relative flex rounded-full bg-indigo-950 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-950">
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image
                src={session?.user.image ?? '/svg/user.svg'}
                alt="Profile Image"
                width={50}
                height={50}
              />
            </div>
          </MenuButton>

          <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md outline outline-2 outline-indigo-800 bg-indigo-950">
            {MENUPROFILE.map((item) => (
              <MenuItem key={item.name}>
                <Link
                  href={item.href}
                  className="block px-4 py-2 text-sm font-medium data-[focus]:bg-indigo-700"
                >
                  {item.name}
                </Link>
              </MenuItem>
            ))}
            {/* Divider para separar las opciones */}
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

