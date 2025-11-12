import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import NotificationComponent from '../components/Notification';
import { Notification, NotificationType } from '../types';

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  // FIX: In a browser environment, `setTimeout` returns a `number`, not a `NodeJS.Timeout` object.
  // Changed the state type to `ReturnType<typeof setTimeout>` which correctly infers the type based on the environment.
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newNotification = { id: Date.now(), message, type };
    setNotification(newNotification);

    const newTimeoutId = setTimeout(() => {
      setNotification(null);
    }, 4000); // Notification stays for 4 seconds
    setTimeoutId(newTimeoutId);
  }, [timeoutId]);
  
  const handleClose = useCallback(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setNotification(null);
  }, [timeoutId]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && <NotificationComponent notification={notification} onClose={handleClose} />}
    </NotificationContext.Provider>
  );
};