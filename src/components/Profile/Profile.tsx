'use client'

import React from 'react';
import { UploadImage } from './UploadImage';
import { useSession } from 'next-auth/react';
import { useGetUserByIdQuery } from 'src/redux/services/usersApi';
import { ProfileForm } from './ProfileForm';
import { PageTitle } from '../Common/PageTitle';
import { SectionTitle } from '../Common/SectionTitle';

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
    const userId = session?.user?.id ?? ''; // Asegura que siempre sea una string (aunque vacía)

    // Evita llamar el hook si userId está vacío
    const { data: user, isLoading, error } = useGetUserByIdQuery(userId, { skip: !userId });

    if (isLoading) return <p>Cargando usuario...</p>;
    if (error) return <p>Error al cargar el usuario</p>;

    return (
        <div className='w-full px-8 py-4'>
            <PageTitle title="CONFIGURACIÓN DE PERFIL"/>
            <div className='grid grid-cols-2 items-center pt-8'>

                <div className=''>    
                    {user && <ProfileForm user={user} />}
                </div>

                <div className=''>                  
                    <UploadImage />
                </div>         

            </div>
        </div>
    );
}