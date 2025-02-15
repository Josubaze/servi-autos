import { useState } from "react";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button, Spinner } from "@nextui-org/react";
import { toast } from 'react-toastify';

export const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);  // Estado de carga
  const { data: session, update } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.info("Selecciona una imagen primero.");

    setLoading(true); // Iniciar el estado de carga

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) return toast.error('Error al subir la imagen');

      const dataUpload = await response.json();

      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.id}`, {
        method: 'PATCH', // Usamos PATCH en lugar de PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUpload.url })
      });

      if (!updateResponse.ok) return toast.error('Error al actualizar el perfil del usuario');

      await update({
        user: {
          ...session.user,
          image: dataUpload.url,
        },
      });

      setFile(null); // Limpiar el archivo seleccionado
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false); // Terminar el estado de carga
    }
  };

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-lg mx-auto p-4 shadow bg-transparent" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center mb-3">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="User Image"
              width={290} 
              height={290} 
              className="rounded-full"
            />
          ) : (
            <Image
              src="svg/user.svg"
              alt="User Image"
              width={100} 
              height={100} 
              className="rounded-full"
            />
          )}
        </div>

        <label htmlFor="imageUpload" className="block text-sm font-medium mt-2">
          Imagen de Perfil
        </label>
        <input
          type="file"
          id="imageUpload"
          className="w-full border border-gray-700 rounded p-1"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={loading} // Deshabilitar input si está cargando
        />

        <Button
          size="lg"
          className="mt-4"
          type="submit"
          variant="solid"
          color="success"
          fullWidth
          isDisabled={loading} // Deshabilitar botón si está cargando
        >
          {loading ? <Spinner size="sm" color="white" /> : "Cargar Imagen"}
        </Button>
      </form>
    </div>
  );
};
