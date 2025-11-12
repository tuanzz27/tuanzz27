import React from 'react';
import { Expense, Category, JarName } from '../types';
import { JARS_CONFIG } from '../constants';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const categoryIcons: Record<Category, string> = {
  'Ăn uống': '🍔',
  'Học tập': '📚',
  'Giải trí': '🎮',
  'Di chuyển': '🚌',
  'Mua sắm': '🛍️',
  'Khác': '✨',
};

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
);

const JarTag: React.FC<{ jar: JarName }> = ({ jar }) => {
    const config = JARS_CONFIG[jar];
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.color}`}>
            {config.name}
        </span>
    );
};

const ExpenseItem: React.FC<{ expense: Expense; onDelete: (id: string) => void }> = ({ expense, onDelete }) => (
  <li className="flex items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 group animate-fade-in">
    <div className={`w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center text-2xl`}>
      {categoryIcons[expense.category] || '✨'}
    </div>
    <div className="flex-grow ml-4">
      <p className="font-semibold text-text-main">{expense.name}</p>
      <div className="flex items-center space-x-2">
        <p className="text-sm text-text-light">{expense.date.toLocaleDateString('vi-VN')}</p>
        <JarTag jar={expense.jar} />
      </div>
    </div>
    <div className="text-right flex items-center space-x-2">
        <p className="font-bold text-secondary text-lg">
            -{expense.amount.toLocaleString('vi-VN')}đ
        </p>
        <button onClick={() => onDelete(expense.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-red-50">
            <TrashIcon />
        </button>
    </div>
  </li>
);

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-text-main">Chi tiêu gần đây 📜</h2>
      {expenses.length > 0 ? (
        <ul className="space-y-3">
          {expenses.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} onDelete={onDeleteExpense}/>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 px-6 bg-white rounded-2xl shadow-sm">
          <p className="text-5xl mb-4">🎉</p>
          <p className="text-text-light">Tuyệt vời! Chưa có chi tiêu nào.</p>
          <p className="text-text-light">Hãy thêm thu nhập và khoản chi đầu tiên nhé!</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;