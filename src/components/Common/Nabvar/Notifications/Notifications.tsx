// Notifications.tsx
import React from 'react';

interface Notification {
  id: number;
  message: string;
}

interface NotificationsProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export const Notifications = ({ notifications, setNotifications }: NotificationsProps) => {
  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="w-96 p-6 bg-indigo-950 text-white rounded-md shadow-2xl z-50 relative">
      <h2 className="text-xl font-bold mb-4">Notificaciones</h2>
      <div className="max-h-96 overflow-y-auto">
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="flex items-center justify-between border-b border-gray-700 py-3"
            >
              <span className="text-base">{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-red-400 hover:text-red-300 focus:outline-none text-lg"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>
      {notifications.length === 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          No hay notificaciones
        </p>
      )}
    </div>
  );
};
