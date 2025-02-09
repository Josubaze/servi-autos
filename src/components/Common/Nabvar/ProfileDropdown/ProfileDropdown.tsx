import React, { useState, useRef, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { MENUPROFILE } from 'src/utils/constanst';
import { Notifications } from '../Notifications'; 
import { Badge, Button } from '@nextui-org/react';
import { IoNotificationsCircleOutline } from 'react-icons/io5';
import { useSocketContext } from 'src/context/SocketContext';

interface ProfileDropdownProps {
  image: string | null | undefined;
}

export const ProfileDropdown = ({ image }: ProfileDropdownProps) => {
  const { notifications } = useSocketContext();
  const [showNotifications, setShowNotifications] = useState(false);
  // Ref para envolver el botón de notificaciones y el panel
  const notificationsContainerRef = useRef<HTMLDivElement>(null);


  // Listener para detectar clics fuera del contenedor de notificaciones
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
        {notifications.length > 0 ? (
          <Badge 
            content={notifications.filter(n => !n.seen).length} 
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
            <Notifications/>
          </div>
        )}
      </div>


      {/* Menú de perfil */}
      <div className="ml-3">
        <Menu as="div" className="relative">
          <MenuButton className="relative flex rounded-full bg-indigo-950 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-950">
            <span className="absolute -inset-1.5" />
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image
                src={image ?? '/svg/user.svg'}
                alt="Profile Image"
                width={50}
                height={50}
              />
            </div>
          </MenuButton>

          <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right py-1 rounded-md outline outline-2 outline-indigo-800 bg-indigo-950">
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
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};
