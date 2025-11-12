
import React from 'react';

interface SummaryProps {
  total: number;
  onGetInsight: () => void;
  isLoading: boolean;
}

const MagicWandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H18a2 2 0 0 1 2 2v3.5L14.5 13 4 2.5 2 6l10.5 10.5L6 22l3.5-1.5L13 17l6.5 6.5L22 18l-3.5-3.5L14.5 2z" />
    </svg>
);

const Summary: React.FC<SummaryProps> = ({ total, onGetInsight, isLoading }) => {
  return (
    <div className="bg-gradient-to-br from-primary to-purple-600 text-white p-6 rounded-2xl shadow-2xl shadow-primary/30 animate-pop-in">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg opacity-80">Tổng chi tiêu</p>
          <p className="text-4xl font-extrabold tracking-tight">
            {total.toLocaleString('vi-VN')}
            <span className="text-2xl opacity-80 ml-1">đ</span>
          </p>
        </div>
        <button 
          onClick={onGetInsight} 
          disabled={isLoading}
          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
        >
            <MagicWandIcon />
            <span>{isLoading ? 'Đang hỏi AI...' : 'Nhận Lời Khuyên'}</span>
        </button>
      </div>
    </div>
  );
};

export default Summary;
