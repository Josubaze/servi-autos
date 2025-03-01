'use client';

import React from 'react';
import { UploadImage } from './UploadImage';
import { useSession } from 'next-auth/react';
import { useGetUserByIdQuery } from 'src/redux/services/usersApi';
import { ProfileForm } from './ProfileForm';
import { PageTitle } from '../Common/PageTitle';
import { Tabs, Tab } from '@nextui-org/react';
import { Loading } from '../Common/Loading';
import { LottieRecover } from 'src/components/Dashboard/DashWidgets/DashWidgets';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
}

export const Profile = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? '';

  // Evita llamar el hook si userId está vacío
  const { data: user, isLoading, error } = useGetUserByIdQuery(userId, { skip: !userId });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Loading />
      </div>
    );

  if (error) return <p className="text-center">Error al cargar el usuario</p>;

  return (
    <div className="w-full px-4 py-4">
      <PageTitle title="CONFIGURACIÓN DE CUENTA" />
      <div className="flex justify-center p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full max-w-6xl">
          {/* Tabs Section */}
          <div className="w-full flex flex-col">
            <Tabs 
              aria-label="Configuración de perfil"
              variant='bordered'
              className='items-center justify-center'
              color="success"
            >
              <Tab key="changePassword" title="Cambiar contraseña">
                {user && <ProfileForm user={user} />}
              </Tab>
              <Tab key="changePhoto" title="Cambiar foto de perfil">
                <UploadImage />
              </Tab>
            </Tabs>
          </div>
          {/* Lottie Animation */}
          <div className="flex justify-center items-center w-full">
            <LottieRecover />
          </div>
        </div>
      </div>
    </div>
  );
};
