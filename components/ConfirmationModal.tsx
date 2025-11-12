import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm m-4 p-6 md:p-8 text-center relative animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
            <span className="text-4xl">🤔</span>
            <h2 className="text-2xl font-bold text-primary mt-2">{title}</h2>
        </div>

        <p className="text-text-light">{message}</p>

        <div className="mt-8 flex gap-4">
            <button 
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-text-main font-bold py-3 px-4 rounded-lg transition-all"
            >
              Hủy
            </button>
            <button 
              onClick={onConfirm}
              className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-lg transition-all"
            >
              Xác nhận
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;