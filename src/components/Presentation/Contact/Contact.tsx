import { Button, Input, Textarea } from '@nextui-org/react';

export const Contact = () => {
    return (
        <div className=' -mb-[85px] bg-black-nav'>
            {/* Sección de Contacto */}
            <section id="contact" className=" pb-32 pt-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold border-b-4 border-gray-600 inline-block pb-2">
                            Contacto
                        </h2>
                        <p className="mt-4 text-gray-300">
                            ¿Tienes dudas o necesitas más información? ¡Contáctanos!
                        </p>
                    </div>
                    <div className="max-w-xl mx-auto">
                        <form className="space-y-6">
                            <div>
                                <Input 
                                    variant="underlined"
                                    placeholder="Nombre" 
                                    className="w-full" 
                                />
                            </div>
                            <div>
                                <Input 
                                    variant="underlined"
                                    placeholder="Correo Electrónico" 
                                    className="w-full" 
                                />
                            </div>
                            <div>
                                <Textarea 
                                    variant="underlined"
                                    placeholder="Correo Electrónico" 
                                    className="w-full" 
                                />
                            </div>
                            <div>
                                <Button 
                                    type="submit" 
                                    className="w-full bg-indigo-700"
                                >
                                    Enviar Mensaje
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};
