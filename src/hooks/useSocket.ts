import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (serverUrl : any) => {
    const [socket, setSocket] = useState<any>(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const socketIo = io(serverUrl); // Conectar con el WebSocket del servidor
        setSocket(socketIo);

        socketIo.on("loadProducts", (data) => {
            setProducts(data); // Actualizar los productos cuando lleguen del server
        });

        return () => {
            socketIo.disconnect(); // Limpiar conexión cuando el componente se desmonte
        };
    }, [serverUrl]);

    return { socket, products };
};
