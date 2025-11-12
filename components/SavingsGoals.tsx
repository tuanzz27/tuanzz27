import React, { useState, useCallback } from 'react';
import { SavingsGoal } from '../types';
import { suggestGoalIcon } from '../services/geminiService';
import { useNotification } from '../context/NotificationContext';

interface SavingsGoalsProps {
    goals: SavingsGoal[];
    onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => Promise<void>;
    onDeleteGoal: (id: string) => void;
    onDeposit: (id: string, amount: number) => void;
    ltssBalance: number;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);

const GoalItem: React.FC<{ goal: SavingsGoal; onDelete: () => void; onDeposit: (amount: number) => void; ltssBalance: number }> = ({ goal, onDelete, onDeposit, ltssBalance }) => {
    const [depositAmount, setDepositAmount] = useState('');
    const [isDepositing, setIsDepositing] = useState(false);
    const { showNotification } = useNotification();
    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    const isCompleted = goal.completed || progress >= 100;
    const displayProgress = isCompleted ? 100 : progress;


    const handleDeposit = () => {
        const amount = +depositAmount;
        if (amount > 0 && amount <= ltssBalance) {
            onDeposit(amount);
            setDepositAmount('');
            setIsDepositing(false);
        } else if (amount > ltssBalance) {
            showNotification('Số tiền vượt quá số dư trong lọ LTSS!', 'error');
        } else {
            showNotification('Vui lòng nhập số tiền hợp lệ!', 'error');
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm transition-shadow duration-300 animate-fade-in space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <span className="text-3xl">{goal.icon}</span>
                    <div>
                        <p className="font-bold text-text-main">{goal.name}</p>
                        <p className="text-xs text-text-light">Mục tiêu: {goal.targetAmount.toLocaleString('vi-VN')}đ</p>
                    </div>
                </div>
                <button onClick={onDelete} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50">
                    <TrashIcon />
                </button>
            </div>
            <div>
                <div className="flex justify-between text-sm text-text-light mb-1">
                    <span>Tiến độ</span>
                     <span className="font-semibold">{isCompleted ? '✓ Hoàn thành' : `${goal.currentAmount.toLocaleString('vi-VN')}đ`}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`${isCompleted ? 'bg-green-500' : 'bg-accent'} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${displayProgress}%` }}></div>
                </div>
            </div>
            {isDepositing && !isCompleted ? (
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder={`Tối đa: ${ltssBalance.toLocaleString('vi-VN')}`}
                        className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-light"
                    />
                    <button onClick={handleDeposit} className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-semibold">Nạp</button>
                    <button onClick={() => setIsDepositing(false)} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm">Hủy</button>
                </div>
            ) : (
                <button 
                    onClick={() => setIsDepositing(true)} 
                    disabled={isCompleted}
                    className="w-full bg-accent/10 text-accent hover:bg-accent/20 font-semibold py-2 rounded-lg transition-colors text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                    {isCompleted ? 'Đã hoàn thành mục tiêu!' : '+ Nạp tiền từ lọ LTSS'}
                </button>
            )}
        </div>
    );
};


const AddGoalForm: React.FC<{ onAddGoal: SavingsGoalsProps['onAddGoal'] }> = ({ onAddGoal }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || +targetAmount <= 0) {
            showNotification('Vui lòng nhập tên và số tiền hợp lệ cho mục tiêu!', 'error');
            return;
        }
        setIsAiLoading(true);
        try {
            const icon = await suggestGoalIcon(name);
            await onAddGoal({ name, icon, targetAmount: +targetAmount });
            setName('');
            setTargetAmount('');
        } catch(err) {
            console.error(err);
            showNotification('Không thể tạo mục tiêu lúc này, thử lại sau nhé.', 'error');
        } finally {
            setIsAiLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="p-4 bg-primary-light/50 rounded-xl space-y-3">
             <h3 className="font-bold text-primary">Tạo mục tiêu mới ✨</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tên mục tiêu (VD: Mua tai nghe)"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-light"
                />
                 <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="Số tiền cần đạt (VNĐ)"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-light"
                />
            </div>
            <button type="submit" disabled={isAiLoading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg transition-all disabled:bg-primary/50">
                {isAiLoading ? 'AI đang tìm icon...' : 'Thêm mục tiêu'}
            </button>
        </form>
    );
};


const SavingsGoals: React.FC<SavingsGoalsProps> = ({ goals, onAddGoal, onDeleteGoal, onDeposit, ltssBalance }) => {
  return (
    <div className="space-y-4 animate-pop-in">
      <h2 className="text-xl font-bold text-text-main">Mục tiêu tiết kiệm 🎯</h2>
      <div className="space-y-3">
        {goals.length > 0 ? (
            goals.map(goal => (
                <GoalItem 
                    key={goal.id} 
                    goal={goal} 
                    onDelete={() => onDeleteGoal(goal.id)}
                    onDeposit={(amount) => onDeposit(goal.id, amount)}
                    ltssBalance={ltssBalance}
                />
            ))
        ) : (
            <div className="text-center py-6 px-4 bg-white rounded-2xl shadow-sm">
                <p className="text-3xl mb-2">🤔</p>
                <p className="text-text-light">Bạn chưa có mục tiêu nào cả.</p>
                <p className="text-text-light text-sm">Hãy tạo một mục tiêu để có động lực tiết kiệm nhé!</p>
            </div>
        )}
        <AddGoalForm onAddGoal={onAddGoal} />
      </div>
    </div>
  );
};

export default SavingsGoals;
