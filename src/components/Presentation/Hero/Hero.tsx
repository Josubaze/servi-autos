'use client'

import { Autoplay, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { Button } from "@nextui-org/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Image from 'next/image';

export const Hero = () => {
  return (
    <div className="relative h-screen w-screen -mt-[65px]">
      {/* Menú de navegación único para secciones */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-6 bg-white/20 backdrop-blur-lg px-8 py-3 rounded-full shadow-lg">
        <Link href="#about">
          <div className="px-4 py-2 rounded-full transition-colors duration-200 hover:bg-white/10">
            <span className="text-lg font-bold">Sobre el Proyecto</span>
          </div>
        </Link>
        <Link href="#services">
          <div className="px-4 py-2 rounded-full transition-colors duration-200 hover:bg-white/10">
            <span className="text-lg font-bold">Servicios</span>
          </div>
        </Link>
        <Link href="#contact">
          <div className="px-4 py-2 rounded-full transition-colors duration-200 hover:bg-white/10">
            <span className="text-lg font-bold">Contacto</span>
          </div>
        </Link>
      </div>

      {/* Swiper de imágenes */}
      <Swiper
        modules={[Autoplay, Pagination, Scrollbar, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-screen w-screen"
      >
        {/* Imagen 1 */}
        <SwiperSlide className="relative h-screen flex justify-center items-center">
          <Image
            src="https://res.cloudinary.com/dxlgp2kxh/image/upload/v1739725138/ai-generated-8214510_1920_fbrjnd.jpg"
            alt="Automatización de Servicios"
            className="h-full w-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
          {/* Contenido principal */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Automatiza los Servicios de tu Taller
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-white mb-8">
              Gestiona facturas, presupuestos e inventario de manera eficiente para llevar tu negocio al siguiente nivel.
            </p>
          </div>
        </SwiperSlide>

        {/* Imagen 2 */}
        <SwiperSlide className="relative h-screen flex justify-center items-center">
          <Image
            src="https://res.cloudinary.com/dxlgp2kxh/image/upload/v1739725140/auto-repair-shop-1954636_1920_bwxm1b.jpg"
            alt="Gestión de Taller"
            className="h-full w-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
          {/* Contenido principal */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Optimiza la Gestión de tu Taller
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-white mb-8">
              Controla todos los procesos de tu taller desde un solo lugar, mejorando la eficiencia y productividad.
            </p>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Botón "Empezar" centrado */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
        <Link href="/signup">
          <Button variant="solid" size="lg" className="bg-indigo-700">
            Empezar
          </Button>
        </Link>
      </div>
    </div>
  );
}
