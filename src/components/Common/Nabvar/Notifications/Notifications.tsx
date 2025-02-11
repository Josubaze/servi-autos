import React, { useState } from 'react';
import { Checkbox, Tooltip } from "@nextui-org/react";
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useSocketContext } from 'src/context/SocketContext';


export const Notifications = () => {
  const { notifications, markNotificationAsSeen } = useSocketContext();
  const [markedNotifications, setMarkedNotifications] = useState<string[]>([]);
  const { data: session } = useSession();

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.seen === b.seen) return 0;
    return a.seen ? 1 : -1;
  });

  const handleMarkAsSeen = (id: string) => {
    if(!session?.user) return;
    // Marcar localmente para aplicar el efecto visual
    setMarkedNotifications((prev) => [...prev, id]);
    // Llamamos a la función del socket para marcarla como leída en el servidor
    markNotificationAsSeen(id, session?.user.id );
  };

  return (
    <div className="w-96 p-6 bg-indigo-950 text-white rounded-lg shadow-xl z-50 relative">
      <h2 className="text-2xl font-semibold text-center mb-4">🔔 Notificaciones</h2>
      
      <div className="max-h-96 overflow-y-auto scrollbar-custom space-y-3">
        {sortedNotifications.length === 0 ? (
          <p className="text-center text-gray-400">No hay notificaciones</p>
        ) : (
          <ul className="space-y-2">
            {sortedNotifications.map((notification) => {
              // Se considera "marcada" si ya está en el estado global (notif.seen) o en el local.
              const isMarked = notification.seen || markedNotifications.includes(notification._id);

              return (
                <motion.li
                  key={notification._id}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isMarked ? 0.5 : 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-[1fr,auto] items-center bg-indigo-900 border border-indigo-700 p-3 rounded-lg shadow-md gap-4 transition-opacity"
                >
                  {/* Mensaje e ID */}
                  <div>
                    <span className="text-base font-medium">📩 {notification.message}</span>
                    <span className="block text-sm text-gray-300 mt-1">
                      🕓 Hora: <span className="font-mono text-white">
                        {`${new Date(notification.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute:     '2-digit', hour12: true })}  - 
                          ${new Date(notification.createdAt).toLocaleDateString('es-ES')}`}
                    </span>
                    
                    </span>
                    <span className="block text-sm text-gray-300 mt-1">
                      🆔 ID: <span className="font-mono text-white">{notification.identifier}</span>
                    </span>
                  </div>
    
                  {/* Checkbox de NextUI con Tooltip */}
                  <Tooltip color='foreground' content="Marca como leído" offset={20}>
                    <Checkbox 
                      color="default"
                      size="md"
                      classNames={{ wrapper: "border border-2 border-gray-100/50" }}
                      onClick={() => handleMarkAsSeen(notification._id)}
                      isDisabled={isMarked} 
                      isSelected={isMarked}   
                    />
                  </Tooltip>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
