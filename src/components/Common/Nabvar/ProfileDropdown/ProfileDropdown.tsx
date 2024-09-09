
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { BellIcon} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { MENUPROFILE } from 'src/utils/constanst'

interface ProfileDropdownProps {
    image?: string | null;
  }

export const ProfileDropdown = ({ image }: ProfileDropdownProps ) => {
    return (
        <>
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
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={image ?? "svg/user.svg"}
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
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {MENUPROFILE.map((item) => (
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
            </div>   
        </>        
    );
}

