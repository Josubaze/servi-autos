'use client'

import { Disclosure} from '@headlessui/react'
import { ButtonMenu } from './NavbarMobile/ButtonMenu';
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { ProfileDropdown } from './ProfileDropdown'
import { OptionsMobile } from './NavbarMobile/OptionsMobile';
import { OptionsDesktop } from './OptionsDesktop';

export const Navbar = () => {
  const { data: session } = useSession();
  return (
    <Disclosure as="nav" className="bg-black-nav">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Button Mobile Menu */}
          <ButtonMenu/>
          {/* Logo*/}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex items-center font-medium text-sm text-gray-200">
              <Image
                  src="/svg/auto.svg"
                  alt="Your Company"
                  width={60} 
                  height={60}  
                  className='pt-1.5'
                />
            </div>
            {/* Rutas Desktop */}
            <div className="hidden sm:ml-6 sm:block">
              <OptionsDesktop session={session}/> 
            </div>
          </div>
          {session?.user && (
            <ProfileDropdown image={session.user.image}/>
          )}
        </div>
      </div>
      {/* Rutas Mobile */}
      <OptionsMobile session={session}/>    
    </Disclosure>
  )
}
