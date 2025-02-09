// Navbar.tsx
'use client'

import { Disclosure } from '@headlessui/react'
import { ButtonMenu } from './NavbarMobile/ButtonMenu';
import { useSession } from "next-auth/react"
import Image from 'next/image'
import { ProfileDropdown } from './ProfileDropdown'
import { OptionsMobile } from './NavbarMobile/OptionsMobile';
import { OptionsDesktop } from './OptionsDesktop';

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <Disclosure as="nav" className="bg-indigo-950">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <ButtonMenu />
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex items-center font-medium text-sm text-gray-200">
              <Image
                  src="/images/logo.png"
                  alt="Your Company"
                  width={60}
                  height={60}
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:justify-center">
              <OptionsDesktop session={session}/>
            </div>
          </div>
          {session?.user && <ProfileDropdown image={session.user.image} />}
        </div>
      </div>
      <OptionsMobile session={session} />
    </Disclosure>
  );
};
