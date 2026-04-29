import { useEffect } from 'react';

export function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('SW registered:', reg.scope);
          // Request notification permission
          if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then((permission) => {
              console.log('Notification permission:', permission);
            });
          }
        })
        .catch((err) => console.error('SW registration failed:', err));
    }
  }, []);

  const scheduleLocalNotification = (title: string, body: string, delay = 0) => {
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.svg' });
      }
    }, delay);
  };

  return { scheduleLocalNotification };
}
