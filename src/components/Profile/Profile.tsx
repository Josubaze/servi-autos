'use client';

import React from 'react';
import { UploadImage } from './UploadImage';
import { useSession } from 'next-auth/react';
import { useGetUserByIdQuery } from 'src/redux/services/usersApi';
import { ProfileForm } from './ProfileForm';
import { PageTitle } from '../Common/PageTitle';
import { Tabs, Tab } from '@nextui-org/react';
import { Loading } from '../Common/Loading';

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

  if (isLoading) return (
    <div className="flex justify-center items-center h-[500px]">
        <Loading />
    </div>
  );
  if (error) return <p className='text-center'>Error al cargar el usuario</p>;

  return (
    <div className="w-full px-8 py-4">
      <PageTitle title="CONFIGURACIÓN DE PERFIL" />
        <Tabs className='flex items-center justify-center p-16' aria-label="Configuración de perfil">
          <Tab key="changePassword" title="Cambiar contraseña">
            {user && <ProfileForm user={user} />}
          </Tab>
          <Tab key="changePhoto" title="Cambiar foto de perfil">
            <UploadImage />
          </Tab>
        </Tabs>
    </div>
  );
};
