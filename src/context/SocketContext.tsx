// SocketContext.tsx
'use client'

import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


interface SocketContextValue {
  socket: Socket | null;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  getUserNotifications: (userId: string) => void;
  markNotificationAsSeen: (notificationId: string, userId: string) => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const useSocketContext = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return; // Espera a que la sesión esté disponible

    // Crea la conexión con Socket.IO
    const socketIo = io(process.env.NEXT_PUBLIC_WEBSOCKETS_URL as string, {
      transports: ["websocket"], // Opcional: fuerza el uso de websocket
    });

    // Una vez conectado, únete a la sala del usuario
    socketIo.emit("join", session.user.id);

    // Escucha el evento de notificaciones en tiempo real
    socketIo.on("userNotifications", (data: Notification[]) => {
      setNotifications(data);
    });

    setSocket(socketIo);

    // Limpieza: desconecta el socket cuando se desmonte el provider
    return () => {
      socketIo.disconnect();
    };
  }, [session?.user?.id]);

  // Función para solicitar notificaciones manualmente
  const getUserNotifications = (userId: string): void => {
    if (socket) {
      socket.emit("getUserNotifications", userId);
    }
  };

  // Función para marcar una notificación como vista
  const markNotificationAsSeen = (notificationId: string, userId: string): void => {
    if (socket) {
      socket.emit("markNotificationAsSeen", notificationId, userId);
    }
  };

  const value: SocketContextValue = {
    socket,
    notifications,
    setNotifications,
    getUserNotifications,
    markNotificationAsSeen,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
