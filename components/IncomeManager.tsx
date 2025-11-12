import React, { useState } from 'react';

interface IncomeManagerProps {
  income: number;
  totalBalance: number;
  onSetIncome: (income: number) => void;
  onGetInsight: () => void;
  isInsightLoading: boolean;
}

const MagicWandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H18a2 2 0 0 1 2 2v3.5L14.5 13 4 2.5 2 6l10.5 10.5L6 22l3.5-1.5L13 17l6.5 6.5L22 18l-3.5-3.5L14.5 2z" />
    </svg>
);


const IncomeManager: React.FC<IncomeManagerProps> = ({ income, totalBalance, onSetIncome, onGetInsight, isInsightLoading }) => {
  const [isEditing, setIsEditing] = useState(income === 0);
  const [currentIncome, setCurrentIncome] = useState(income.toString());
  
  const handleSave = () => {
    const newIncome = +currentIncome;
    if(newIncome > 0) {
        onSetIncome(newIncome);
        setIsEditing(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-primary to-purple-600 text-white p-6 rounded-2xl shadow-2xl shadow-primary/30 animate-pop-in">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-lg opacity-80">Tổng số dư</p>
          <p className="text-4xl font-extrabold tracking-tight">
            {totalBalance.toLocaleString('vi-VN')}
            <span className="text-2xl opacity-80 ml-1">đ</span>
          </p>
           <div className="mt-2 text-primary-light text-sm">
            Thu nhập tháng: {income.toLocaleString('vi-VN')}đ
          </div>
        </div>
        <button 
          onClick={onGetInsight} 
          disabled={isInsightLoading}
          className="flex-shrink-0 flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
        >
            <MagicWandIcon />
            <span>{isInsightLoading ? 'Đang hỏi AI...' : 'Nhận Lời Khuyên'}</span>
        </button>
      </div>

      <div className="mt-4">
        {isEditing ? (
            <div className="flex items-center space-x-2 bg-white/20 p-2 rounded-lg">
                <input
                    type="number"
                    value={currentIncome}
                    onChange={(e) => setCurrentIncome(e.target.value)}
                    placeholder="Nhập thu nhập tháng..."
                    className="w-full bg-transparent placeholder-white/70 outline-none px-2 py-1"
                />
                <button onClick={handleSave} className="bg-accent text-white font-bold px-4 py-1 rounded-md">Lưu</button>
            </div>
        ) : (
            <button onClick={() => setIsEditing(true)} className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full">
                Cập nhật thu nhập
            </button>
        )}
      </div>
    </div>
  );
};

export default IncomeManager;
