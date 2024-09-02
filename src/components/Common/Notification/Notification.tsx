import React, { useEffect, useState } from 'react';

type NotificationProps = {
  message: string;
};

export const Notification = ({ message }: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); 
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  if (!isVisible) return null; 

  return (
    <div className="fixed bottom-2/4 sm:bottom-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 w-full max-w-lg rounded shadow-md text-center flex items-center justify-between">
      <span>{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-4 bg-transparent text-white font-bold py-1 px-2 rounded hover:bg-red-700 focus:outline-none"
      >
        X
      </button>
    </div>
  );
};
