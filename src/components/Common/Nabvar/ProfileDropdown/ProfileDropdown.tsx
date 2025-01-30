
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { BellIcon} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link';
import { MENUPROFILE } from 'src/utils/constanst'

interface ProfileDropdownProps {
    image: string | null | undefined;
  }

export const ProfileDropdown = ({ image }: ProfileDropdownProps ) => {
    return (
        <>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-indigo-950 p-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <MenuButton className="relative flex rounded-full bg-indigo-950 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-950">
                <span className="absolute -inset-1.5" />
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={image ?? "/svg/user.svg"}
                    alt="Profile Image"
                    width={50}
                    height={50}
                  />
                </div>
              </MenuButton>

              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right py-1  rounded-md outline outline-2 outline-indigo-800 bg-indigo-950">
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
        </>        
    );
}

