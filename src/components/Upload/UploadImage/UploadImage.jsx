'use client'

import { useState } from "react";
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export const UploadImage = () => {
  const [file, setFile] = useState(null);
  const { data: session, update } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const dataUpload = await response.json();

      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUpload.url })
      });

      if (!updateResponse.ok) {
        throw new Error('Error al actualizar el perfil del usuario');
      }

      await update({
        user: {
          ...session.user,
          image: dataUpload.url,
        },
      });    

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <>
    <div className="mx-2 max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Configuración de Perfil</h1>
    </div>
    <div className="flex justify-center py-4 h-5/6">
      <form
        className="w-full md:w-1/2 p-4 border rounded-lg shadow-md max-lg:border-none"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-center">
          { session?.user?.image ? (
            <div>
              <Image
                src={session.user.image}
                alt="User Image"
                width={400} 
                height={400} 
                className="max-w-xs md:max-w-lg mx-auto"
              />
            </div>
          ) : (
            <Image
                src="svg/user.svg"
                alt="User Image"
                width={400} 
                height={400} 
                className="max-w-xs md:max-w-lg mx-auto"
            />
          )}
        </div>

        <label htmlFor="imageUpload" className="block text-lg font-semibold mt-4">
          Imagen de Perfil 
        </label>
        <input
          type="file"
          id="imageUpload"
          className="w-full border rounded-md p-2"
          onChange={(e) => { setFile(e.target.files[0]) }}
        />

        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 mt-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Cargar Imagen
        </button>
      </form>
    </div>
    </>
  );
}
