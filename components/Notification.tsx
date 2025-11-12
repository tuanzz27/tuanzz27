import React from 'react';
import { Notification } from '../types';

interface NotificationProps {
  notification: Notification;
  onClose: () => void;
}

const icons = {
  success: '🎉',
  error: '😥',
  info: '💡',
};

const colors = {
  success: 'bg-green-100 border-green-400 text-green-700',
  error: 'bg-red-100 border-red-400 text-red-700',
  info: 'bg-blue-100 border-blue-400 text-blue-700',
};

const NotificationComponent: React.FC<NotificationProps> = ({ notification, onClose }) => {
  const { message, type } = notification;

  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-sm">
      <div 
        className={`flex items-center p-4 rounded-lg shadow-lg border animate-pop-in ${colors[type]}`}
        role="alert"
      >
        <div className="text-xl mr-3">{icons[type]}</div>
        <div className="flex-grow text-sm font-medium">{message}</div>
        <button onClick={onClose} className="ml-4 -mr-1 p-1 rounded-full hover:bg-black/10 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationComponent;
