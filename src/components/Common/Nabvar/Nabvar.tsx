'use client'

import { Disclosure } from '@headlessui/react'
import { ButtonMenu } from './NavbarMobile/ButtonMenu'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { ProfileDropdown } from './ProfileDropdown'
import { OptionsMobile } from './NavbarMobile/OptionsMobile'
import { OptionsGuest } from './OptionsGuest'
import { OptionsDesktop } from './OptionsDesktop'
import Link from 'next/link'
import { Divider } from '@nextui-org/react'

export const Navbar = () => {
  const { data: session } = useSession()

  return (
    <>
      {/* Navbar fijo */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Disclosure as="nav" className="bg-transparent">
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <ButtonMenu />
              <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
                <Link
                  href="/"
                  className="flex items-center font-medium text-sm text-gray-200"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Your Company"
                    width={60}
                    height={60}
                  />
                </Link>
                {session?.user ? (
                  <div className="flex items-center space-x-4 pl-4">
                    <OptionsDesktop session={session} />
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 ml-auto">
                    <OptionsGuest />
                  </div>
                )}
              </div>
              {session?.user && <ProfileDropdown session={session} />}
            </div>
          </div>
          <OptionsMobile session={session} />
          <Divider orientation="horizontal" />
        </Disclosure>
      </div>

      {/* Placeholder para reservar el espacio del navbar y evitar que el contenido se suba */}
      <div className="h-16"></div>
    </>
  )
}
