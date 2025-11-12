
import React from 'react';

interface InsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: string;
  isLoading: boolean;
}

const AILoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-primary-light animate-ping"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-primary-light animate-ping delay-300"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">🧠</div>
        </div>
        <p className="text-primary font-semibold animate-pulse">AI đang suy nghĩ...</p>
    </div>
);


const InsightModal: React.FC<InsightModalProps> = ({ isOpen, onClose, insight, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md m-4 p-6 md:p-8 text-center relative animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="mb-4">
            <span className="text-4xl">💡</span>
            <h2 className="text-2xl font-bold text-primary mt-2">Lời khuyên từ AI Thông Thái</h2>
        </div>

        <div className="text-left text-text-light space-y-3 whitespace-pre-wrap min-h-[100px] flex items-center justify-center">
            {isLoading ? <AILoadingAnimation /> : <p>{insight}</p>}
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Đã hiểu!
        </button>
      </div>
    </div>
  );
};

export default InsightModal;
