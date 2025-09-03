// contexts/NotificationContext.jsx
import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const showNotification = (newStatus, newMessage) => {
    setStatus(newStatus);
    setMessage(newMessage);
    setOpen(true);

    // Auto close after 3s if not loading
    if (newStatus !== 'loading') {
      setTimeout(() => setOpen(false), 3000);
    }
  };

  const closeNotification = () => setOpen(false);

  return (
    <NotificationContext.Provider
      value={{ open, status, message, showNotification, closeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
