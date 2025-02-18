import Image from "next/image";

export const About = () => {
    return (
        <section id="about" className="relative py-16">
            {/* Imagen de fondo con opacidad y desenfoque */}
            <div className="absolute inset-0">
                <Image 
                    src="https://res.cloudinary.com/dxlgp2kxh/image/upload/v1739725145/spanner-3013129_1920_jdxwaf.jpg" 
                    alt="Acerca del Proyecto" 
                    fill 
                    className="object-cover w-full h-full brightness-50 blur-sm"
                />
            </div>

            {/* Contenedor del contenido */}
            <div className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col items-center text-center lg:text-left">
                <div className="bg-black/60 p-6 md:p-12 rounded-lg max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
                        <span className="border-b-4 border-gray-600 inline-block pb-1">Sobre el Proyecto</span>
                    </h2>
                    <p className="text-gray-300 mb-4">
                        Este proyecto consiste en una aplicación web diseñada para la gestión y automatización de los servicios en la empresa automotriz <strong>ServiAutos Báez</strong>. Su objetivo es optimizar y agilizar los procesos internos del taller, proporcionando soluciones integrales para la gestión eficiente de todos los servicios requeridos por los vehículos.
                    </p>
                    <h3 className="text-2xl font-semibold text-white mb-2">Objetivo General</h3>
                    <p className="text-gray-300 mb-4">
                        Desarrollar una aplicación web para la gestión y automatización de los servicios en la empresa automotriz <strong>ServiAutos Báez</strong>.
                    </p>
                    <h3 className="text-2xl font-semibold text-white mb-2">Objetivos Específicos</h3>
                    <ul className="list-disc pl-6 text-gray-300">
                        <li>Determinar los requerimientos funcionales clave para satisfacer las necesidades de la aplicación.</li>
                        <li>Diseñar una estructura de base de datos centralizada, asegurando la confidencialidad de los datos.</li>
                        <li>Integrar la API de MercadoLibre para la búsqueda y comparación de precios de repuestos en tiempo real.</li>
                        <li>Codificar los diferentes módulos funcionales de la aplicación.</li>
                        <li>Validar cada uno de los procesos y módulos funcionales.</li>
                        <li>Realizar pruebas para verificar la calidad y funcionalidad del software.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};
