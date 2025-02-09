import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketReturn {
  socket: Socket | null;
  products: Product[];
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
  getUserNotifications: (userId: string) => void;
  markNotificationAsSeen: (notificationId: string) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // URL fija para la conexión con el servidor de WebSocket
    const socketIo = io("https://app-notifications-yzwl.onrender.com/");
    setSocket(socketIo);

    // Escucha para actualizar los productos
    socketIo.on("loadProducts", (data: Product[]) => {
      setProducts(data);
    });

    // Escucha para recibir las notificaciones del usuario
    socketIo.on("userNotifications", (data: Notification[]) => {
      setNotifications(data);
      console.log(data);
    });

    // Escucha para recibir la notificación actualizada (al marcarla como vista)
    socketIo.on("notificationUpdated", (updatedNotification: Notification) => {
      console.log("Notificación actualizada:", updatedNotification);
      // Aquí podrías actualizar el estado `notifications` si lo consideras necesario.
    });

    // Escucha para manejar errores
    socketIo.on("error", (error: any) => {
      console.error("Socket error:", error);
    });

    // Cleanup: desconectar el socket cuando el componente se desmonte
    return () => {
      socketIo.disconnect();
    };
  }, []); 

  // Función para solicitar las notificaciones de un usuario.
  const getUserNotifications = (userId: string): void => {
    if (socket) {
      socket.emit("getUserNotifications", userId);
    }
  };

  // Función para marcar una notificación como vista.
  const markNotificationAsSeen = (notificationId: string): void => {
    if (socket) {
      socket.emit("markNotificationAsSeen", notificationId);
    }
  };

  return { socket, products, notifications, setNotifications, getUserNotifications, markNotificationAsSeen };
};
